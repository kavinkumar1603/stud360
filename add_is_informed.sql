-- Add is_informed column to leave_applications
ALTER TABLE public.leave_applications ADD COLUMN is_informed boolean DEFAULT false;
