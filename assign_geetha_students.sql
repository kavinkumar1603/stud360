DO $$
DECLARE
    v_tutor_id uuid;
    v_advisor_id uuid;
BEGIN
    SELECT id INTO v_tutor_id FROM public.advisors WHERE email = 'geetha.n@sece.ac.in' LIMIT 1;
    SELECT id INTO v_advisor_id FROM public.advisors WHERE email = 'anandaraj.a@sece.ac.in' LIMIT 1;

    -- Update students from 24CS095 to 24CS098 and 24CS101 to 24CS120
    UPDATE public.students
    SET tutor_id = v_tutor_id, advisor_id = v_advisor_id
    WHERE roll_no IN (
        '24CS095', '24CS096', '24CS097', '24CS098',
        '24CS101', '24CS102', '24CS103', '24CS104',
        '24CS105', '24CS106', '24CS107', '24CS108',
        '24CS109', '24CS110', '24CS111', '24CS112',
        '24CS113', '24CS114', '24CS115', '24CS116',
        '24CS117', '24CS118', '24CS119', '24CS120'
    );
END $$;
