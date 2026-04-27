-- migration_vector_store.sql
-- SQL Migration for Vector Store Setup
-- Run this in your Supabase SQL Editor

-- Enable the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the product_embeddings table
CREATE TABLE IF NOT EXISTS product_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vector similarity search function
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(1536),
    match_count INT DEFAULT 5,
    threshold FLOAT DEFAULT 0.5
)
RETURNS TABLE (
    id UUID,
    product_id UUID,
    content TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        pe.id,
        pe.product_id,
        pe.content,
        1 - (pe.embedding <=> query_embedding) AS similarity
    FROM product_embeddings pe
    WHERE pe.embedding IS NOT NULL
      AND 1 - (pe.embedding <=> query_embedding) > threshold
    ORDER BY pe.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Create index for faster similarity search
CREATE INDEX IF NOT EXISTS product_embeddings_embedding_idx 
ON product_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create function to generate embeddings for products
CREATE OR REPLACE FUNCTION generate_product_embeddings()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    product_record RECORD;
    content_text TEXT;
BEGIN
    -- Clear existing embeddings
    DELETE FROM product_embeddings;
    
    -- Generate embeddings for each product
    FOR product_record IN 
        SELECT 
            p.id,
            p.name,
            p.description,
            c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.description IS NOT NULL
    LOOP
        content_text := COALESCE(product_record.name || '. ', '') || 
                       COALESCE(product_record.description || '. ', '') || 
                       COALESCE('Category: ' || product_record.category_name, '');
        
        -- Note: You'll need to generate embeddings using OpenAI API
        -- This function prepares the content; embedding generation happens server-side
        INSERT INTO product_embeddings (product_id, content)
        VALUES (product_record.id, content_text);
    END LOOP;
    
    RAISE NOTICE 'Product embeddings content generated. Now generate vector embeddings.';
END;
$$;

-- Create read-only user for SQL agent (run in Supabase dashboard)
-- CREATE USER readonly_user WITH PASSWORD 'your_secure_password';
-- GRANT CONNECT ON DATABASE your_database TO readonly_user;
-- GRANT SELECT ON products, orders, categories, users TO readonly_user;