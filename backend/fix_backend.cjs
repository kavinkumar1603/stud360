const fs = require('fs');

let content = fs.readFileSync('index.js', 'utf8');

content = content.replace(/\s*\{\s*data:\s*coursesData\s*\},/g, '');
content = content.replace(/\s*supabase\.from\('online_courses'\)\.select\('\*, nptel_tracking\(\*\)'\)\.order\('created_at', \{ ascending: false \}\),/g, '');
content = content.replace(/\s*onlineCourses:\s*coursesData\s*\|\|\s*\[\],/g, '');

content = content.replace(/\s*app\.post\('\/api\/courses'[\s\S]*?\}\);/g, '');
content = content.replace(/\s*app\.put\('\/api\/courses\/:id'[\s\S]*?\}\);/g, '');
content = content.replace(/\s*app\.post\('\/api\/courses\/:id\/nptel'[\s\S]*?\}\);/g, '');

fs.writeFileSync('index.js', content);
