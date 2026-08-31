import 'dotenv/config';
import jwt from 'jsonwebtoken';
// backend uses ES modules since type="module" in package.json

const token = jwt.sign({ id: '89391e7d-b51a-4a7a-97b0-a563cddf974f', role: 'ADVISOR' }, process.env.JWT_SECRET || 'fallback_secret');
console.log('Token:', token);

async function test() {
  const res = await fetch('http://localhost:5000/api/data', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  console.log('Students count:', data.students.length);
  console.log('Advisors count:', data.advisors.length);
  
  if (data.students.length > 0) {
    console.log('Sample student:', data.students[0].name);
  }
}
test();
