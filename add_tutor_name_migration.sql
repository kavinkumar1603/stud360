-- Add tutor_name column to leave_applications table
ALTER TABLE public.leave_applications ADD COLUMN IF NOT EXISTS tutor_name text;
