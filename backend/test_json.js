import 'dotenv/config';
import jwt from 'jsonwebtoken';

const token = jwt.sign({ id: 'a3146512-d35e-47c9-a19c-6405bee4c785', role: 'STUDENT' }, process.env.JWT_SECRET);

async function test() {
  const res = await fetch('http://localhost:5000/api/data', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Response:', text.substring(0, 100));
}

test();
