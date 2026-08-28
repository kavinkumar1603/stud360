-- Create Leave Applications Table
CREATE TYPE leave_type AS ENUM ('Personal', 'Medical');
CREATE TYPE scholar_type AS ENUM ('Day Scholar', 'Hosteller');

CREATE TABLE public.leave_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) NOT NULL,
  student_name text NOT NULL,
  student_roll text NOT NULL,
  advisor_id uuid REFERENCES public.advisors(id) NOT NULL,
  leave_type leave_type NOT NULL,
  scholar_type scholar_type NOT NULL,
  semester semester NOT NULL,
  from_date date,
  to_date date,
  on_date date,
  no_of_days numeric NOT NULL,
  purpose text NOT NULL,
  advisor_status request_status DEFAULT 'PENDING' NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and Policies for Leave Applications
ALTER TABLE public.leave_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.leave_applications FOR ALL USING (true);

