-- Create Enum Types
CREATE TYPE user_role AS ENUM ('STUDENT', 'ADVISOR');
CREATE TYPE academic_year AS ENUM ('2025-2026', '2024-2025', '2023-2024');
CREATE TYPE semester AS ENUM ('Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8');
CREATE TYPE od_request_type AS ENUM ('Individual', 'Team');
CREATE TYPE request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE proof_status AS ENUM ('LOCKED', 'OPEN', 'SUBMITTED', 'VERIFIED', 'REJECTED');
CREATE TYPE course_platform AS ENUM ('NPTEL', 'Udemy', 'Coursera', 'Other');
CREATE TYPE course_status AS ENUM ('Enrolled', 'In Progress', 'Completed', 'Dropped');

-- Create Advisors Table
CREATE TABLE public.advisors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  department text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  title text NOT NULL,
  avatar text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Students Table
CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_no text UNIQUE NOT NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  department text NOT NULL,
  section text,
  year text,
  semester semester,
  advisor_id uuid REFERENCES public.advisors(id),
  avatar text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create OD Requests Table
CREATE TABLE public.od_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) NOT NULL,
  student_name text NOT NULL,
  student_roll text NOT NULL,
  advisor_id uuid REFERENCES public.advisors(id) NOT NULL,
  academic_year academic_year NOT NULL,
  semester semester NOT NULL,
  event_name text NOT NULL,
  description text,
  from_date date NOT NULL,
  to_date date NOT NULL,
  request_type od_request_type NOT NULL,
  team_members jsonb DEFAULT '[]'::jsonb,
  advisor_status request_status DEFAULT 'PENDING' NOT NULL,
  od_final_status request_status DEFAULT 'PENDING' NOT NULL,
  my_proof_link text,
  my_proof_remarks text,
  my_individual_proof_status proof_status DEFAULT 'LOCKED' NOT NULL,
  advisor_remarks text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Online Courses Table
CREATE TABLE public.online_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) NOT NULL,
  student_name text NOT NULL,
  student_roll text NOT NULL,
  academic_year academic_year NOT NULL,
  semester semester NOT NULL,
  platform course_platform NOT NULL,
  course_name text NOT NULL,
  provider text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  duration text NOT NULL,
  status course_status NOT NULL,
  cert_drive_link text,
  grade text,
  verified_by_advisor boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Deadlines Table
CREATE TABLE public.deadlines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id uuid REFERENCES public.advisors(id) NOT NULL,
  title text NOT NULL,
  description text,
  due_date date NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.od_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deadlines ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allowing all for now since there's no real authentication yet)
CREATE POLICY "Enable read access for all users" ON public.advisors FOR SELECT USING (true);
CREATE POLICY "Enable all access for all users" ON public.students FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.od_requests FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.online_courses FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.deadlines FOR ALL USING (true);

-- Insert Mock Data
INSERT INTO public.advisors (id, name, department, email, title)
VALUES 
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Dr. Sarah Wilson', 'Computer Science', 'sarah.wilson@university.edu', 'Associate Professor');

INSERT INTO public.students (id, roll_no, name, email, department, semester, advisor_id)
VALUES 
  ('123e4567-e89b-12d3-a456-426614174000', 'CB.EN.U4CYS22001', 'John Doe', 'john.doe@student.university.edu', 'Computer Science', 'Semester 6', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'CB.EN.U4CYS22002', 'Jane Smith', 'jane.smith@student.university.edu', 'Computer Science', 'Semester 6', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d');
