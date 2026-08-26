const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

content = content.replace(/OnlineCourse,\s*/g, '');
content = content.replace(/NptelTracking,\s*/g, '');

content = content.replace(/\s*onlineCourses:\s*OnlineCourse\[\];/g, '');
content = content.replace(/\s*addOnlineCourse:\s*\([\s\S]*?\)\s*=>\s*void;/g, '');
content = content.replace(/\s*updateNptelTracking:\s*\(.*?\)\s*=>\s*Promise<void>;/g, '');
content = content.replace(/\s*toggleCourseVerify:\s*\(.*?\)\s*=>\s*void;/g, '');

content = content.replace(/\s*const \[onlineCourses,\s*setOnlineCourses\]\s*=\s*useState<OnlineCourse\[\]>\(\[\]\);/g, '');

content = content.replace(/\s*if \(data\.onlineCourses\) \{[\s\S]*?\}\n/g, '');

content = content.replace(/\s*const addOnlineCourse = async \([\s\S]*?\} catch \(error\) \{\s*console\.error\(error\);\s*\}\s*\};\s*/g, '');
content = content.replace(/\s*const toggleCourseVerify = async \([\s\S]*?\} catch \(error\) \{\s*console\.error\(error\);\s*\}\s*\};\s*/g, '');
content = content.replace(/\s*const updateNptelTracking = async \([\s\S]*?\} catch \(error\) \{\s*console\.error\(error\);\s*\}\s*\};\s*/g, '');

content = content.replace(/\s*onlineCourses,/g, '');
content = content.replace(/\s*addOnlineCourse,/g, '');
content = content.replace(/\s*updateNptelTracking,/g, '');
content = content.replace(/\s*toggleCourseVerify,/g, '');

fs.writeFileSync('src/context/AppContext.tsx', content);
