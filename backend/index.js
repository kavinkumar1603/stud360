import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user; // { id, role }
    next();
  });
};

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
      console.error('Advisor query failed');
      return res.status(500).json({ error: 'Database connection failed' });
    }

    if (advisors && advisors.length > 0) {
      const advisor = advisors[0];
      let isValid = false;
      
      if (advisor.password_hash) {
        isValid = await bcrypt.compare(pass, advisor.password_hash);
      } else {
        isValid = pass === advisor.email;
      }
      
      if (isValid) {
        const token = jwt.sign({ id: advisor.id, role: 'ADVISOR' }, JWT_SECRET, { expiresIn: '24h' });
        // Don't send password hash to client
        const { password_hash, ...userWithoutHash } = advisor;
        return res.json({ token, user: { ...userWithoutHash, role: 'ADVISOR' } });
      }
    }

    // 2. Try Student
    const { data: students, error: stuError } = await supabase
      .from('students')
      .select('*')
      .eq('roll_no', input);

    if (stuError) {
      console.error('Student query failed');
      return res.status(500).json({ error: 'Database connection failed' });
    }

    if (students && students.length > 0) {
      const student = students[0];
      let isValid = false;
      
      if (student.password_hash) {
        isValid = await bcrypt.compare(pass, student.password_hash);
      } else {
        isValid = pass === student.roll_no;
      }
      
      if (isValid) {
        const token = jwt.sign({ id: student.id, role: 'STUDENT' }, JWT_SECRET, { expiresIn: '24h' });
        // Don't send password hash to client
        const { password_hash, ...userWithoutHash } = student;
        return res.json({ token, user: { ...userWithoutHash, role: 'STUDENT' } });
      }
    }

    return res.status(401).json({ error: 'Invalid credentials. Check your username and password.' });
  } catch (error) {
    console.error('Login error occurred');
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Change Password
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id, role } = req.user;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    const table = role === 'STUDENT' ? 'students' : 'advisors';
    const { data: users, error: fetchError } = await supabase
      .from(table)
      .select('*')
      .eq('id', id);

    if (fetchError || !users || users.length === 0) {
      return res.status(500).json({ error: 'User not found' });
    }

    const user = users[0];
    let isCurrentValid = false;
    
    if (user.password_hash) {
      isCurrentValid = await bcrypt.compare(currentPassword, user.password_hash);
    } else {
      isCurrentValid = currentPassword === (role === 'STUDENT' ? user.roll_no : user.email);
    }

    if (!isCurrentValid) {
      return res.status(401).json({ error: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    const { error: updateError } = await supabase
      .from(table)
      .update({ password_hash: newPasswordHash })
      .eq('id', id);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update password' });
    }

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Fetch user-scoped data
app.get('/api/data', authenticateToken, async (req, res) => {
  try {
    const { id, role } = req.user;
    
    let studentsData = [], advisorsData = [], odData = [], deadlinesData = [], classesData = [], leavesData = [];
    
    if (role === 'STUDENT') {
      const [
        { data: studentRes },
        { data: odRes },
        { data: leavesRes, error: leavesError }
      ] = await Promise.all([
        supabase.from('students').select('*').eq('id', id),
        supabase.from('od_requests').select('*').or(`student_id.eq.${id},team_members.cs.[{"student_id":"${id}"}]`).order('created_at', { ascending: false }),
        supabase.from('leave_applications').select('*').eq('student_id', id).order('created_at', { ascending: false })
      ]);
      
      studentsData = studentRes || [];
      odData = odRes || [];
      leavesData = leavesRes || [];
      
      if (studentsData.length > 0) {
          const advId = studentsData[0].advisor_id;
          const tutId = studentsData[0].tutor_id;
          const ids = [advId, tutId].filter(Boolean);
          
          const queries = [];
          if (ids.length > 0) {
            queries.push(supabase.from('advisors').select('id, name, department, title, avatar').in('id', ids));
          } else {
            queries.push(Promise.resolve({ data: [] }));
          }
          
          if (advId) {
            queries.push(supabase.from('classes').select('*').eq('advisor_id', advId).order('created_at', { ascending: true }));
            queries.push(supabase.from('deadlines').select('*').eq('advisor_id', advId).order('due_date', { ascending: true }));
          } else {
            queries.push(Promise.resolve({ data: [] }));
            queries.push(Promise.resolve({ data: [] }));
          }

          const [{ data: advRes }, { data: clRes }, { data: dlRes }] = await Promise.all(queries);
          
          advisorsData = advRes || [];
          classesData = clRes || [];
          deadlinesData = dlRes || [];
        }
    } else if (role === 'ADVISOR') {
      const [
        { data: advRes },
        { data: stRes1 },
        { data: stRes2 },
        { data: lRes1 },
        { data: lRes2 },
        { data: clRes },
        { data: dlRes }
      ] = await Promise.all([
        supabase.from('advisors').select('*').eq('id', id),
        supabase.from('students').select('*').eq('advisor_id', id),
        supabase.from('students').select('*').eq('tutor_id', id),
        supabase.from('leave_applications').select('*').eq('advisor_id', id).order('created_at', { ascending: false }),
        supabase.from('leave_applications').select('*').eq('tutor_id', id).order('created_at', { ascending: false }),
        supabase.from('classes').select('*').eq('advisor_id', id).order('created_at', { ascending: true }),
        supabase.from('deadlines').select('*').eq('advisor_id', id).order('due_date', { ascending: true })
      ]);

      advisorsData = advRes || [];
      
      const stMap = new Map();
      (stRes1 || []).forEach(s => stMap.set(s.id, s));
      (stRes2 || []).forEach(s => stMap.set(s.id, s));
      studentsData = Array.from(stMap.values());
      
      const studentIds = Array.from(stMap.keys());
      if (studentIds.length > 0) {
        const { data: odRes } = await supabase.from('od_requests').select('*').in('student_id', studentIds).order('created_at', { ascending: false });
        odData = odRes || [];
      } else {
        odData = [];
      }
      
      const lMap = new Map();
      (lRes1 || []).forEach(l => lMap.set(l.id, l));
      (lRes2 || []).forEach(l => lMap.set(l.id, l));
      leavesData = Array.from(lMap.values()).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
      
      classesData = clRes || [];
      deadlinesData = dlRes || [];
    }

    res.json({
      students: studentsData,
      advisors: advisorsData,
      odRequests: odData,
      deadlines: deadlinesData,
      classes: classesData,
      leaveApplications: leavesData
    });
  } catch (error) {
    console.error("Error fetching data processing failed");
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/classes', authenticateToken, async (req, res) => {
  try {
    const { data: inserted, error } = await supabase.from('classes').insert(req.body).select().single();
    if (error) throw error;
    res.json(inserted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/classes/:id', authenticateToken, async (req, res) => {
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

app.post('/api/od-requests', authenticateToken, async (req, res) => {
  try {
    const { data: inserted, error } = await supabase.from('od_requests').insert(req.body).select().single();
    if (error) throw error;
    res.json(inserted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/od-requests/:id', authenticateToken, async (req, res) => {
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

app.delete('/api/od-requests/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('od_requests').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  app.post('/api/leave-applications', authenticateToken, async (req, res) => {
    try {
      console.log('Received leave application:', req.body);
      const { data: inserted, error } = await supabase.from('leave_applications').insert(req.body).select().single();
      if (error) {
        console.error('Error inserting leave:', error);
        throw error;
      }
      console.log('Inserted leave application:', inserted);
      res.json(inserted);
    } catch (error) {
      console.error('Catch block error in POST /api/leave-applications:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

app.put('/api/leave-applications/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data: updated, error } = await supabase.from('leave_applications').update(updates).eq('id', id).select().single();
    if (error) throw error;
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/leave-applications/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('leave_applications').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/students', authenticateToken, async (req, res) => {
  try {
    const { data: inserted, error } = await supabase.from('students').insert(req.body).select().single();
    if (error) throw error;
    res.json(inserted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/deadlines', authenticateToken, async (req, res) => {
  try {
    const { data: inserted, error } = await supabase.from('deadlines').insert(req.body).select().single();
    if (error) throw error;
    res.json(inserted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/deadlines/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase.from('deadlines').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});

export default app;
