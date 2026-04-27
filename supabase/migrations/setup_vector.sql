-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create product embeddings table
CREATE TABLE IF NOT EXISTS product_embeddings (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector search
CREATE INDEX IF NOT EXISTS idx_product_embeddings_embedding 
ON product_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create match_documents function using pgvector
CREATE OR REPLACE FUNCTION match_documents(
    query_text TEXT,
    query_embedding vector(1536),
    match_count INTEGER DEFAULT 5
)
RETURNS TABLE (
    id BIGINT,
    product_id BIGINT,
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
    ORDER BY pe.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Simple version that works with text search fallback
CREATE OR REPLACE FUNCTION match_documents(
    query_text TEXT,
    match_count INTEGER DEFAULT 5
)
RETURNS TABLE (
    product_id BIGINT,
    content TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pe.product_id,
        pe.content,
        0.0 AS similarity
    FROM product_embeddings pe
    WHERE pe.content ILIKE '%' || query_text || '%'
    LIMIT match_count;
END;
$$;