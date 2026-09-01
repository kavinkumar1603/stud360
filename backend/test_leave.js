import 'dotenv/config';
import jwt from 'jsonwebtoken';

const token = jwt.sign({ id: 'a3146512-d35e-47c9-a19c-6405bee4c785', role: 'STUDENT' }, process.env.JWT_SECRET);

async function test() {
  const newLeave = {
    student_id: 'a3146512-d35e-47c9-a19c-6405bee4c785',
    student_name: 'KATHIRVEL S',
    student_roll: '24CS109',
    advisor_id: '89391e7d-b51a-4a7a-97b0-a563cddf974f',
    tutor_id: '0bd6ca05-90eb-4662-aae3-227210bf1ee4',
    tutor_status: 'PENDING',
    advisor_status: 'PENDING',
    leave_type: 'Medical',
    scholar_type: 'Hosteller',
    semester: 'Semester 5',
    from_date: '2026-09-01',
    to_date: '2026-09-02',
    no_of_days: 2,
    purpose: 'Fever'
  };

  console.log('Sending POST request...');
  const res = await fetch('http://localhost:5000/api/leave-applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(newLeave)
  });
  
  if (!res.ok) {
    console.error('POST failed:', res.status, await res.text());
    return;
  }
  
  const inserted = await res.json();
  console.log('Inserted:', inserted);
  
  console.log('Fetching GET data...');
  const res2 = await fetch('http://localhost:5000/api/data', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await res2.json();
  console.log('Fetched leave apps:', data.leaveApplications.length);
  if (data.leaveApplications.length > 0) {
    console.log('Latest leave app:', data.leaveApplications[0]);
  }
}

test();
