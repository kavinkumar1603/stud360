const fs = require('fs');

function fixStatusPill() {
  let content = fs.readFileSync('src/components/StatusPill.tsx', 'utf8');
  content = content.replace(/import \{ AdvisorStatus, CourseStatus, ODFinalStatus, ODRequest, ProofStatus, StatusPillConfig \} from '\.\.\/types';/g, 
                            "import { AdvisorStatus, ODFinalStatus, ODRequest, ProofStatus, StatusPillConfig } from '../types';");
  
  content = content.replace(/export function getCourseStatusConfig[\s\S]*?\}\n\n/g, '');
  content = content.replace(/type:\s*'OD'\s*\|\s*'COURSE';/g, "type: 'OD';");
  content = content.replace(/courseStatus\?:\s*CourseStatus;\n/g, '');
  content = content.replace(/courseStatus,\n/g, '');
  
  content = content.replace(/\s*\} else if \(type === 'COURSE' && courseStatus\) \{[\s\S]*?config = getCourseStatusConfig\(courseStatus\);\n/g, '');
  
  fs.writeFileSync('src/components/StatusPill.tsx', content);
}

function fixAdvisorDashboard() {
  let content = fs.readFileSync('src/components/advisor/AdvisorDashboardView.tsx', 'utf8');
  content = content.replace(/\|\s*'courses'\s*/g, '');
  content = content.replace(/,\s*onlineCourses\s*/g, ' ');
  content = content.replace(/\s*const cohortCourses = onlineCourses[\s\S]*?nptelPending = cohortNptelCourses\.length - nptelRegistered;\n/g, '');
  
  content = content.replace(/\s*\{\/\* Total Courses \*\/\}[\s\S]*?\{\/\* NPTEL Tracking \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, '');
  
  // Actually, let's just do it with replace by finding the block.
  // The structure is roughly:
  // {/* Total Courses */} ... </div> </div> </div>
  // Let me replace the specific components carefully. 
  fs.writeFileSync('src/components/advisor/AdvisorDashboardView.tsx', content);
}

function fixStudentDashboard() {
  let content = fs.readFileSync('src/components/student/DashboardView.tsx', 'utf8');
  content = content.replace(/\|\s*'courses'\s*/g, '');
  content = content.replace(/onOpenAddCourse:\s*\(\)\s*=>\s*void;\n/g, '');
  content = content.replace(/onOpenAddCourse,\n/g, '');
  content = content.replace(/,\s*onlineCourses\s*/g, ' ');
  
  fs.writeFileSync('src/components/student/DashboardView.tsx', content);
}

fixStatusPill();
fixAdvisorDashboard();
fixStudentDashboard();
