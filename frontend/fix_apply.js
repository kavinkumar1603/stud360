const fs = require('fs');

let content = fs.readFileSync('src/components/student/ApplyODModal.tsx', 'utf8');

// Add states
content = content.replace(
  "const [eventName, setEventName] = useState('');",
  "const [eventName, setEventName] = useState('');\n  const [venue, setVenue] = useState('');\n  const [mentorName, setMentorName] = useState('');\n  const [mentorDesignation, setMentorDesignation] = useState('');\n  const [contactNumber, setContactNumber] = useState('');"
);

// Add to addODRequest payload
content = content.replace(
  "request_type: requestType,",
  "request_type: requestType,\n      location: venue,\n      mentor_name: mentorName,\n      mentor_designation: mentorDesignation,\n      student_contact: contactNumber,"
);

// Reset form
content = content.replace(
  "setEventName('');",
  "setEventName('');\n    setVenue('');\n    setMentorName('');\n    setMentorDesignation('');\n    setContactNumber('');"
);

// Inject UI fields before the From Date / To Date grid
let uiFields = `            {/* Venue, Mentor, Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Venue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Event Location"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Your Phone Number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mentor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={mentorName}
                  onChange={(e) => setMentorName(e.target.value)}
                  placeholder="Faculty Mentor Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mentor Designation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={mentorDesignation}
                  onChange={(e) => setMentorDesignation(e.target.value)}
                  placeholder="e.g. AP/CSE"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

`;

content = content.replace(
  "{/* From Date / To Date */}",
  uiFields + "            {/* From Date / To Date */}"
);

// Require them for isSubmitEnabled
content = content.replace(
  "const isSubmitEnabled = isEventFilled && isDateValid && isTeamValid;",
  "const isSubmitEnabled = isEventFilled && isDateValid && isTeamValid && venue.trim().length > 0 && mentorName.trim().length > 0 && contactNumber.trim().length > 0;"
);

fs.writeFileSync('src/components/student/ApplyODModal.tsx', content);

