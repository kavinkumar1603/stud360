-- 1. Add tutor_id to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS tutor_id uuid REFERENCES public.advisors(id);

-- 2. Add tutor_id and tutor_status to leave_applications table
ALTER TABLE public.leave_applications 
ADD COLUMN IF NOT EXISTS tutor_id uuid REFERENCES public.advisors(id),
ADD COLUMN IF NOT EXISTS tutor_status request_status DEFAULT 'PENDING';

-- 3. Update Kirubakaran's email if it's currently .r to .k
UPDATE public.advisors
SET email = 'kirubakaran.k@sece.ac.in'
WHERE email = 'kirubakaran.r@sece.ac.in';

-- If Kirubakaran does not exist, insert:
INSERT INTO public.advisors (id, name, department, email, title, phone)
SELECT gen_random_uuid(), 'Kirubakaran K', 'CSE', 'kirubakaran.k@sece.ac.in', 'tutor', ''
WHERE NOT EXISTS (
    SELECT 1 FROM public.advisors WHERE email = 'kirubakaran.k@sece.ac.in'
);

-- 4. Assign Tutor and Advisor to the specified students
DO $$
DECLARE
    v_tutor_id uuid;
    v_advisor_id uuid;
BEGIN
    SELECT id INTO v_tutor_id FROM public.advisors WHERE email = 'kirubakaran.k@sece.ac.in' LIMIT 1;
    SELECT id INTO v_advisor_id FROM public.advisors WHERE email = 'anandaraj.a@sece.ac.in' LIMIT 1;

    -- Update students from 24CS071 to 24CS094
    UPDATE public.students
    SET tutor_id = v_tutor_id, advisor_id = v_advisor_id
    WHERE roll_no ~ '^24CS0(7[1-9]|8[0-9]|9[0-4])$';
END $$;
