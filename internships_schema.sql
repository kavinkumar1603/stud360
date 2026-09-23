-- Create Enum Types for Internships
CREATE TYPE internship_type AS ENUM ('Internal', 'External');
CREATE TYPE internship_status AS ENUM ('Ongoing', 'Completed');

-- Create Internships Table
CREATE TABLE public.internships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  internship_type internship_type NOT NULL,
  status internship_status NOT NULL,
  title text NOT NULL,
  organization text NOT NULL,
  department text,
  domain text,
  description text,
  skills_used text,
  start_date date NOT NULL,
  end_date date,
  mentors jsonb DEFAULT '[]'::jsonb,
  location_type text,
  company_location text,
  company_website text,
  documents jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allowing all for now since there's no real authentication yet)
CREATE POLICY "Enable all access for all users" ON public.internships FOR ALL USING (true);
