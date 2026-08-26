const fs = require('fs');

function fixProfile() {
  let content = fs.readFileSync('src/components/student/StudentProfileView.tsx', 'utf8');
  content = content.replace(/,\s*onlineCourses/g, '');
  content = content.replace(/\s*const countCourses = onlineCourses\.filter\(\(c\) => c\.student_id === currentStudent\.id\)\.length;\n/g, '');
  // Remove the courses stat block if it exists
  content = content.replace(/<div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">[\s\S]*?<BookOpen className="w-5 h-5 text-blue-500" \/>[\s\S]*?<\/div>[\s\S]*?<\/div>/g, '');
  
  fs.writeFileSync('src/components/student/StudentProfileView.tsx', content);
}

function fixShell() {
  try {
    let content = fs.readFileSync('src/components/student/StudentShell.tsx', 'utf8');
    content = content.replace(/import \{ OnlineCoursesListView \} from '\.\/OnlineCoursesListView';\n/g, '');
    content = content.replace(/import \{ AddCourseModal \} from '\.\/AddCourseModal';\n/g, '');
    content = content.replace(/\|\s*'courses'\s*/g, '');
    content = content.replace(/const \[isAddCourseOpen, setIsAddCourseOpen\] = useState\(false\);\n/g, '');
    content = content.replace(/\s*<button[\s\S]*?id="tab-student-courses"[\s\S]*?<\/button>/g, '');
    content = content.replace(/\s*<button[\s\S]*?id="mobile-nav-courses"[\s\S]*?<\/button>/g, '');
    content = content.replace(/\s*onOpenAddCourse=\{\(\) => setIsAddCourseOpen\(true\)\}/g, '');
    content = content.replace(/\s*\) : activeTab === 'courses' \? \([\s\S]*?<OnlineCoursesListView[\s\S]*?\/>/g, '');
    content = content.replace(/\s*<AddCourseModal[\s\S]*?\/>/g, '');
    
    fs.writeFileSync('src/components/student/StudentShell.tsx', content);
  } catch(e) {}
}

fixProfile();
fixShell();
