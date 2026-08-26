const fs = require('fs');
let content = fs.readFileSync('src/components/SidebarLayout.tsx', 'utf8');

content = content.replace(/\s*<button[\s\S]*?id="nav-student-courses"[\s\S]*?<\/button>/g, '');
content = content.replace(/\s*BookOpen,/g, '');

fs.writeFileSync('src/components/SidebarLayout.tsx', content);
