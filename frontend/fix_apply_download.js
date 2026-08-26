const fs = require('fs');

let content = fs.readFileSync('src/components/student/ApplyODModal.tsx', 'utf8');

// Import printForm
content = content.replace(
  "import { isValidDateRange } from '../../utils/validation';",
  "import { isValidDateRange } from '../../utils/validation';\nimport { printODForm } from '../../utils/printForm';"
);

// Define print handler inside component
const printHandler = `
  const handleDownload = () => {
    if (!isSubmitEnabled) {
      alert("Please fill all required fields first.");
      return;
    }
    
    // Calculate days
    const fDate = new Date(fromDate);
    const tDate = new Date(toDate);
    const diffTime = Math.abs(tDate.getTime() - fDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Gather names
    const names = [currentStudent.name, ...selectedTeamMembers.map(m => m.name)].join(', ');
    const rolls = [currentStudent.roll_no, ...selectedTeamMembers.map(m => m.roll_no)].join(', ');

    printODForm({
      academicYear: currentStudent.year || '2026-2027',
      studentNames: names,
      department: currentStudent.department,
      registerNumbers: rolls,
      year: currentStudent.year || '3',
      semester: currentStudent.semester,
      section: currentStudent.section || 'A',
      numberOfDays: diffDays,
      fromDate: fromDate,
      toDate: toDate,
      mentorName: mentorName,
      mentorDesignation: mentorDesignation,
      eventName: eventName,
      venue: venue,
      contactNumber: contactNumber
    });
  };
`;

content = content.replace(
  "const handleSubmit = (e: React.FormEvent) => {",
  printHandler + "\n  const handleSubmit = (e: React.FormEvent) => {"
);

// Add button to footer
content = content.replace(
  `<div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">`,
  `<div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">\n            <button\n              type="button"\n              onClick={handleDownload}\n              disabled={!isSubmitEnabled}\n              className={\`px-4 py-2.5 rounded-xl border border-blue-200 text-blue-700 text-sm font-semibold shadow-sm transition-all \${isSubmitEnabled ? 'hover:bg-blue-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}\`}\n            >\n              Download Form\n            </button>`
);

fs.writeFileSync('src/components/student/ApplyODModal.tsx', content);

