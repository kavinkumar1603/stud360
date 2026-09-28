-- Migration: Add od_category column to od_requests table
-- Run this script in the Supabase SQL Editor if you want od_category persisted directly as a dedicated column

ALTER TABLE public.od_requests 
ADD COLUMN IF NOT EXISTS od_category text DEFAULT 'External';
