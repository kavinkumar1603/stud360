-- Create Classes Table
CREATE TABLE public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  advisor_id uuid REFERENCES public.advisors(id) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add class_id to Students table
ALTER TABLE public.students 
ADD COLUMN class_id uuid REFERENCES public.classes(id);

-- Enable RLS and Policies for Classes
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.classes FOR ALL USING (true);
