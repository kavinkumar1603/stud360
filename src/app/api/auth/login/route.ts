import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const input = username.trim();
    const pass = password.trim();

    // 1. Try Advisor
    const { data: advisors, error: advError } = await supabase
      .from('advisors')
      .select('*')
      .eq('email', input);

    if (!advError && advisors && advisors.length > 0) {
      const advisor = advisors[0];
      if (pass === advisor.email) {
        const token = jwt.sign({ id: advisor.id, role: 'ADVISOR' }, JWT_SECRET, { expiresIn: '24h' });
        return NextResponse.json({ token, user: { ...advisor, role: 'ADVISOR' } });
      }
    }

    // 2. Try Student
    const { data: students, error: stuError } = await supabase
      .from('students')
      .select('*')
      .eq('roll_no', input);

    if (!stuError && students && students.length > 0) {
      const student = students[0];
      if (pass === student.roll_no) {
        const token = jwt.sign({ id: student.id, role: 'STUDENT' }, JWT_SECRET, { expiresIn: '24h' });
        return NextResponse.json({ token, user: { ...student, role: 'STUDENT' } });
      }
    }

    return NextResponse.json({ error: 'Invalid credentials. Check your username and password.' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
