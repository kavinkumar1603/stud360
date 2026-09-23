-- Migration to support multiple mentors
ALTER TABLE public.internships 
ADD COLUMN mentors jsonb DEFAULT '[]'::jsonb;

-- (Optional) If you want to migrate existing data, you could do it here before dropping the old columns
-- UPDATE public.internships SET mentors = jsonb_build_array(jsonb_build_object('name', mentor_name, 'email', mentor_email, 'contact', mentor_contact)) WHERE mentor_name IS NOT NULL;

ALTER TABLE public.internships 
DROP COLUMN mentor_name,
DROP COLUMN mentor_email,
DROP COLUMN mentor_contact;
