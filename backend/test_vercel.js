const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEzMTQ2NTEyLWQzNWUtNDdjOS1hMTljLTY0MDViZWU0Yzc4NSIsInJvbGUiOiJTVFVERU5UIiwiaWF0IjoxNzg4MTk5NTgwLCJleHAiOjE3ODgyODU5ODB9.FeAuPtA9KgkdxHzA-hsqfj8tQ5fC6OuxxAhZOQleGmw';
fetch('https://stud360-backend.vercel.app/api/data', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(res => res.json())
  .then(json => console.log('Leaves count on Vercel:', json.leaveApplications?.length));
