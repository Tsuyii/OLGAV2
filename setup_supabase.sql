-- ==========================================
-- OLGA Supabase Database Schema Setup
-- ==========================================

-- 1. Create the PROFILES table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users(id) primary key,
  first_name text,
  last_name text,
  full_name text,
  email text,
  newsletter_opt_in boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn off RLS for profiles temporarily so registration upsert works smoothly
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Create the PRODUCTS table (so the homepage doesn't crash)
CREATE TABLE IF NOT EXISTS public.products (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  category text not null,
  price numeric not null,
  sale_price numeric,
  badge text,
  images jsonb default '[]'::jsonb,
  sizes jsonb default '[]'::jsonb,
  colors jsonb default '[]'::jsonb,
  description text,
  materials text,
  care text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn off RLS for products so the frontend can read them
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
