const fs = require('fs');
let content = fs.readFileSync('src/app/[id]/page.tsx', 'utf8');

content = content.replace(/import \{ OnlineCoursesListView \} from '@\/components\/student\/OnlineCoursesListView';\n/g, '');
content = content.replace(/import \{ AddCourseModal \} from '@\/components\/student\/AddCourseModal';\n/g, '');
content = content.replace(/const \[isAddCourseOpen, setIsAddCourseOpen\] = useState\(false\);\n\s*/g, '');
content = content.replace(/\s*onOpenAddCourse=\{\(\) => setIsAddCourseOpen\(true\)\}/g, '');
content = content.replace(/\s*if \(tab === 'courses'\) setActiveTab\('student_courses'\);/g, '');

content = content.replace(/\s*\) : activeTab === 'student_courses' \? \([\s\S]*?<OnlineCoursesListView \/>/g, '');
content = content.replace(/\s*\) : activeTab === 'student_courses' \? \([\s\S]*?<OnlineCoursesListView \/>\s*/g, '');
content = content.replace(/\s*\) : activeTab === 'student_courses' \? \([\s\S]*?<OnlineCoursesListView[\s\S]*?\/>\s*/g, '');
content = content.replace(/\s*<AddCourseModal[\s\S]*?\/>/g, '');

fs.writeFileSync('src/app/[id]/page.tsx', content);
