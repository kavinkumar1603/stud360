import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:3000'] : '*' }));
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running on Vercel!' });
});

// Auth Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const input = username.trim();
    const pass = password.trim();

    // 1. Try Advisor
    const { data: advisors, error: advError } = await supabase
      .from('advisors')
      .select('*')
      .eq('email', input);

    if (advError) {
      console.error('Advisor query error:', advError);
      return res.status(500).json({ error: 'Database connection failed' });
    }

    if (advisors && advisors.length > 0) {
      const advisor = advisors[0];
      if (pass === advisor.email) {
        const token = jwt.sign({ id: advisor.id, role: 'ADVISOR' }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ token, user: { ...advisor, role: 'ADVISOR' } });
      }
    }

    // 2. Try Student
    const { data: students, error: stuError } = await supabase
      .from('students')
      .select('*')
      .eq('roll_no', input);

    if (stuError) {
      console.error('Student query error:', stuError);
      return res.status(500).json({ error: 'Database connection failed' });
    }

    if (students && students.length > 0) {
      const student = students[0];
      if (pass === student.roll_no) {
        const token = jwt.sign({ id: student.id, role: 'STUDENT' }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ token, user: { ...student, role: 'STUDENT' } });
      }
    }

    return res.status(401).json({ error: 'Invalid credentials. Check your username and password.' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch all data
app.get('/api/data', async (req, res) => {
  try {
    const [
      { data: studentsData },
      { data: advisorsData },
      { data: odData },
      { data: deadlinesData },
      { data: classesData }
    ] = await Promise.all([
      supabase.from('students').select('*'),
      supabase.from('advisors').select('*'),
      supabase.from('od_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('deadlines').select('*').order('due_date', { ascending: true }),
      supabase.from('classes').select('*').order('created_at', { ascending: true })
    ]);

    res.json({
      students: studentsData || [],
      advisors: advisorsData || [],
      odRequests: odData || [],
      deadlines: deadlinesData || [],
      classes: classesData || []
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/classes', async (req, res) => {
  try {
    const { data: inserted, error } = await supabase.from('classes').insert(req.body).select().single();
    if (error) throw error;
    res.json(inserted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/classes/:id', async (req, res) => {
  try {
    // First, unassign students from this class
    const { error: updateError } = await supabase
      .from('students')
      .update({ class_id: null })
      .eq('class_id', req.params.id);
    
    if (updateError) throw updateError;

    const { error } = await supabase.from('classes').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/od-requests', async (req, res) => {
  try {
    const { data: inserted, error } = await supabase.from('od_requests').insert(req.body).select().single();
    if (error) throw error;
    res.json(inserted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/od-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data: updated, error } = await supabase.from('od_requests').update(updates).eq('id', id).select().single();
    if (error) throw error;
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { data: inserted, error } = await supabase.from('students').insert(req.body).select().single();
    if (error) throw error;
    res.json(inserted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/deadlines', async (req, res) => {
  try {
    const { data: inserted, error } = await supabase.from('deadlines').insert(req.body).select().single();
    if (error) throw error;
    res.json(inserted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/deadlines/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('deadlines').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
  });
}

export default app;
