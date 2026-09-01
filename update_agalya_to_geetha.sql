-- Update AGALYA K to GEETHA N in the advisors table
UPDATE public.advisors
SET name = 'GEETHA N', 
    email = 'geetha.n@sece.ac.in'
WHERE email = 'agalya.k@sece.ac.in';
