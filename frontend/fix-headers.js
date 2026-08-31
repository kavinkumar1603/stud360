const fs = require('fs');
const path = 'src/context/AppContext.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/headers:\s*\{\s*'Content-Type':\s*'application\/json'\s*\}/g, 
  "headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }");

content = content.replace(/method:\s*'DELETE'\s*\n?\s*\}/g, 
  "method: 'DELETE',\n        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }\n      }");

// Remove all console.error statements completely or redact them
content = content.replace(/console\.error\([^)]+\);/g, "console.error('An error occurred');");

fs.writeFileSync(path, content);
console.log('Replaced fetch headers');
