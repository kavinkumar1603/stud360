import fs from 'fs';

// 1. Fix src/app/[id]/page.tsx activeTab sync logic
let page = fs.readFileSync('src/app/[id]/page.tsx', 'utf-8');
const oldEffect = `  useEffect(() => {
    if (role === 'STUDENT' && (activeTab === 'advisor_students' || activeTab === 'advisor_pending')) {
      setActiveTab('student_dashboard');
    }
  }, [role, activeTab]);`;

const newEffect = `  useEffect(() => {
    if (role === 'STUDENT' && (activeTab === 'advisor_dashboard' || activeTab === 'advisor_students' || activeTab === 'advisor_pending')) {
      setActiveTab('student_dashboard');
    } else if (role === 'ADVISOR' && (activeTab === 'student_dashboard' || activeTab === 'student_requests' || activeTab === 'student_courses')) {
      setActiveTab('advisor_dashboard');
    }
  }, [role, activeTab]);`;
page = page.replace(oldEffect, newEffect);
fs.writeFileSync('src/app/[id]/page.tsx', page);

// 2. Fix src/components/SidebarLayout.tsx to insert the Advisor Dashboard button
let sidebar = fs.readFileSync('src/components/SidebarLayout.tsx', 'utf-8');
const searchSection = `              <div className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Advisor Admin Tools</span>
              </div>`;

const replaceSection = `              <div className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Advisor Admin Tools</span>
              </div>

              <button
                id="nav-advisor-dashboard"
                onClick={() => handleNavClick('advisor_dashboard')}
                className={\`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer \${
                  activeTab === 'advisor_dashboard'
                    ? 'bg-amber-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:bg-amber-50 hover:text-amber-900'
                }\`}
              >
                <LayoutDashboard className={\`w-4 h-4 \${activeTab === 'advisor_dashboard' ? 'text-white' : 'text-amber-500'}\`} />
                <span>Advisor Dashboard</span>
              </button>`;

sidebar = sidebar.replace(searchSection, replaceSection);
fs.writeFileSync('src/components/SidebarLayout.tsx', sidebar);

console.log('Fixed advisor dashboard routing and sidebar');
