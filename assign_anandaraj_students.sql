DO $$
DECLARE
    v_advisor_id uuid;
BEGIN
    SELECT id INTO v_advisor_id FROM public.advisors WHERE email = 'anandaraj.a@sece.ac.in' LIMIT 1;

    -- Update students from 24CS121 to 24CS140, plus Lateral Entry (24CS301, 24CS315, 24CS317)
    UPDATE public.students
    SET tutor_id = NULL, advisor_id = v_advisor_id
    WHERE roll_no IN (
        '24CS121', '24CS122', '24CS123', '24CS124', '24CS125',
        '24CS126', '24CS127', '24CS128', '24CS129', '24CS130',
        '24CS131', '24CS132', '24CS133', '24CS134', '24CS135',
        '24CS136', '24CS137', '24CS138', '24CS139', '24CS140',
        '24CS301', '24CS315', '24CS317'
    );
END $$;
