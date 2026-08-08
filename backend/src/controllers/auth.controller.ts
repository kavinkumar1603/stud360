import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
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
        res.json({ token, user: { ...advisor, role: 'ADVISOR' } });
        return;
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
        res.json({ token, user: { ...student, role: 'STUDENT' } });
        return;
      }
    }

    res.status(401).json({ error: 'Invalid credentials. Check your username and password.' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
