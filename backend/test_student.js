import 'dotenv/config';
import jwt from 'jsonwebtoken';
const token = jwt.sign({ id: 'some-random-id', role: 'STUDENT' }, process.env.JWT_SECRET || 'fallback_secret');
async function test() {
  const res = await fetch('http://localhost:5000/api/data', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  console.log('Result:', data);
}
test();
