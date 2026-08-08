import { Advisor, ODRequest, OnlineCourse, Student } from '../types';

export const MOCK_ADVISORS: Advisor[] = [
  {
    id: 'adv-01',
    name: 'Dr. Sarah Jenkins',
    department: 'Computer Science & Engineering',
    email: 'sarah.jenkins@academic.edu',
    title: 'Senior Associate Professor & Faculty Advisor'
  },
  {
    id: 'adv-02',
    name: 'Prof. Rajesh Kumar',
    department: 'Information Technology',
    email: 'rajesh.kumar@academic.edu',
    title: 'Assistant Professor & Class Advisor'
  }
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'stu-101',
    roll_no: '22CS045',
    name: 'Alex Morgan',
    email: 'alex.morgan@student.edu',
    department: 'Computer Science',
    semester: 'Semester 6',
    advisor_id: 'adv-01'
  },
  {
    id: 'stu-102',
    roll_no: '22CS082',
    name: 'Priya Sharma',
    email: 'priya.sharma@student.edu',
    department: 'Computer Science',
    semester: 'Semester 6',
    advisor_id: 'adv-01'
  },
  {
    id: 'stu-103',
    roll_no: '22CS110',
    name: 'David Chen',
    email: 'david.chen@student.edu',
    department: 'Computer Science',
    semester: 'Semester 6',
    advisor_id: 'adv-01'
  },
  {
    id: 'stu-104',
    roll_no: '22CS012',
    name: 'Ananya Verma',
    email: 'ananya.verma@student.edu',
    department: 'Computer Science',
    semester: 'Semester 6',
    advisor_id: 'adv-01'
  },
  {
    id: 'stu-105',
    roll_no: '22IT033',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@student.edu',
    department: 'Information Technology',
    semester: 'Semester 6',
    advisor_id: 'adv-02'
  }
];

export const INITIAL_OD_REQUESTS: ODRequest[] = [
  // 1. Pending Advisor Review
  {
    id: 'od-101',
    student_id: 'stu-101',
    student_name: 'Alex Morgan',
    student_roll: '22CS045',
    advisor_id: 'adv-01',
    academic_year: '2025-2026',
    semester: 'Semester 6',
    event_name: 'National Level Hackathon 2026 (SmartIndia)',
    description: 'Participating in 36-hour continuous hackathon at IIT Madras presenting AI Healthcare solution.',
    from_date: '2026-08-15',
    to_date: '2026-08-17',
    request_type: 'Team',
    team_members: [
      {
        student_id: 'stu-102',
        roll_no: '22CS082',
        name: 'Priya Sharma',
        individual_proof_status: 'LOCKED'
      },
      {
        student_id: 'stu-103',
        roll_no: '22CS110',
        name: 'David Chen',
        individual_proof_status: 'LOCKED'
      }
    ],
    advisor_status: 'PENDING',
    od_final_status: 'PENDING',
    my_individual_proof_status: 'LOCKED',
    created_at: '2026-08-01'
  },

  // 2. Pending Final Approval (Advisor Approved, HOD/Dean Pending)
  {
    id: 'od-102',
    student_id: 'stu-101',
    student_name: 'Alex Morgan',
    student_roll: '22CS045',
    advisor_id: 'adv-01',
    academic_year: '2025-2026',
    semester: 'Semester 6',
    event_name: 'IEEE International Conference Paper Presentation',
    description: 'Presenting research paper on Federated Learning in IoT edge nodes.',
    from_date: '2026-08-20',
    to_date: '2026-08-21',
    request_type: 'Individual',
    team_members: [],
    advisor_status: 'APPROVED',
    od_final_status: 'PENDING',
    advisor_remarks: 'Paper accepted in IEEE venue. Approved for attendance.',
    my_individual_proof_status: 'LOCKED',
    created_at: '2026-07-28'
  },

  // 3. OD Approved, Proof Status: OPEN ("Upload Proof Now")
  {
    id: 'od-103',
    student_id: 'stu-101',
    student_name: 'Alex Morgan',
    student_roll: '22CS045',
    advisor_id: 'adv-01',
    academic_year: '2025-2026',
    semester: 'Semester 6',
    event_name: 'State Inter-College Badminton Championship',
    description: 'Representing university in men singles and doubles categories.',
    from_date: '2026-07-10',
    to_date: '2026-07-12',
    request_type: 'Individual',
    team_members: [],
    advisor_status: 'APPROVED',
    od_final_status: 'APPROVED',
    advisor_remarks: 'Representing college sports team.',
    my_individual_proof_status: 'OPEN',
    created_at: '2026-07-01'
  },

  // 4. OD Approved, Proof SUBMITTED ("Proof Submitted — Awaiting Verification")
  {
    id: 'od-104',
    student_id: 'stu-101',
    student_name: 'Alex Morgan',
    student_roll: '22CS045',
    advisor_id: 'adv-01',
    academic_year: '2025-2026',
    semester: 'Semester 6',
    event_name: 'Robotics Workshop & Competition at NIT Trichy',
    description: 'Hands-on Autonomous Drone Navigation Challenge.',
    from_date: '2026-06-18',
    to_date: '2026-06-20',
    request_type: 'Team',
    team_members: [
      {
        student_id: 'stu-104',
        roll_no: '22CS012',
        name: 'Ananya Verma',
        individual_proof_status: 'SUBMITTED',
        drive_link: 'https://drive.google.com/file/d/ananya_cert_104/view',
        remarks: 'Attached certificate of merit.'
      }
    ],
    advisor_status: 'APPROVED',
    od_final_status: 'APPROVED',
    my_proof_link: 'https://drive.google.com/file/d/alex_cert_104/view',
    my_proof_remarks: 'Participation certificate and photo badge attached.',
    my_individual_proof_status: 'SUBMITTED',
    created_at: '2026-06-10'
  },

  // 5. Completed (Proof VERIFIED)
  {
    id: 'od-105',
    student_id: 'stu-101',
    student_name: 'Alex Morgan',
    student_roll: '22CS045',
    advisor_id: 'adv-01',
    academic_year: '2024-2025',
    semester: 'Semester 5',
    event_name: 'ACM ICPC Regional Contest',
    description: 'Competitive programming contest participation.',
    from_date: '2025-11-14',
    to_date: '2025-11-16',
    request_type: 'Individual',
    team_members: [],
    advisor_status: 'APPROVED',
    od_final_status: 'APPROVED',
    my_proof_link: 'https://drive.google.com/file/d/acm_icpc_alex_cert/view',
    my_proof_remarks: 'Certificate of excellence.',
    my_individual_proof_status: 'VERIFIED',
    created_at: '2025-11-01'
  },

  // 6. Rejected by Advisor
  {
    id: 'od-106',
    student_id: 'stu-101',
    student_name: 'Alex Morgan',
    student_roll: '22CS045',
    advisor_id: 'adv-01',
    academic_year: '2025-2026',
    semester: 'Semester 6',
    event_name: 'Gaming Expo & LAN Tournament',
    description: 'eSports championship.',
    from_date: '2026-08-05',
    to_date: '2026-08-06',
    request_type: 'Individual',
    team_members: [],
    advisor_status: 'REJECTED',
    od_final_status: 'PENDING',
    advisor_remarks: 'Conflicts with scheduled Mid-Term Examinations.',
    my_individual_proof_status: 'LOCKED',
    created_at: '2026-07-20'
  },

  // 7. Proof Rejected — Resubmit
  {
    id: 'od-107',
    student_id: 'stu-101',
    student_name: 'Alex Morgan',
    student_roll: '22CS045',
    advisor_id: 'adv-01',
    academic_year: '2025-2026',
    semester: 'Semester 6',
    event_name: 'Industry Seminar on Quantum Computing',
    description: 'Guest speaker session hosted at IISc Bangalore.',
    from_date: '2026-05-10',
    to_date: '2026-05-11',
    request_type: 'Individual',
    team_members: [],
    advisor_status: 'APPROVED',
    od_final_status: 'APPROVED',
    my_proof_link: 'https://drive.google.com/file/d/bad_link_107/view',
    my_proof_remarks: 'Event photos.',
    my_individual_proof_status: 'REJECTED',
    advisor_remarks: 'Uploaded link does not contain official attendance certificate from IISc organizer.',
    created_at: '2026-05-01'
  },

  // 8. Advisor pending for another student (Priya Sharma)
  {
    id: 'od-108',
    student_id: 'stu-102',
    student_name: 'Priya Sharma',
    student_roll: '22CS082',
    advisor_id: 'adv-01',
    academic_year: '2025-2026',
    semester: 'Semester 6',
    event_name: 'Women in Tech Leadership Summit',
    description: 'Keynote and panel discussion on AI leadership.',
    from_date: '2026-08-22',
    to_date: '2026-08-23',
    request_type: 'Individual',
    team_members: [],
    advisor_status: 'PENDING',
    od_final_status: 'PENDING',
    my_individual_proof_status: 'LOCKED',
    created_at: '2026-08-04'
  }
];

export const INITIAL_ONLINE_COURSES: OnlineCourse[] = [
  {
    id: 'crs-201',
    student_id: 'stu-101',
    student_name: 'Alex Morgan',
    student_roll: '22CS045',
    academic_year: '2025-2026',
    semester: 'Semester 6',
    platform: 'NPTEL',
    course_name: 'Deep Learning & Neural Networks',
    provider: 'IIT Kharagpur',
    start_date: '2026-01-15',
    end_date: '2026-04-15',
    duration: '12 weeks',
    status: 'In Progress',
    verified_by_advisor: false,
    created_at: '2026-01-10'
  },
  {
    id: 'crs-202',
    student_id: 'stu-101',
    student_name: 'Alex Morgan',
    student_roll: '22CS045',
    academic_year: '2025-2026',
    semester: 'Semester 6',
    platform: 'NPTEL',
    course_name: 'Data Structures and Algorithms in Python',
    provider: 'IIT Madras',
    start_date: '2025-08-01',
    end_date: '2025-10-30',
    duration: '8 weeks',
    status: 'Completed',
    cert_drive_link: 'https://drive.google.com/file/d/nptel_dsa_gold_cert/view',
    grade: 'Elite + Gold (92%)',
    verified_by_advisor: true,
    created_at: '2025-11-02'
  },
  {
    id: 'crs-203',
    student_id: 'stu-101',
    student_name: 'Alex Morgan',
    student_roll: '22CS045',
    academic_year: '2025-2026',
    semester: 'Semester 6',
    platform: 'Coursera',
    course_name: 'AWS Cloud Architecture Practitioner',
    provider: 'Amazon Web Services',
    start_date: '2026-05-01',
    end_date: '2026-06-15',
    duration: '24 hours',
    status: 'Completed',
    cert_drive_link: 'https://drive.google.com/file/d/coursera_aws_cert_alex/view',
    verified_by_advisor: false,
    created_at: '2026-06-16'
  },
  {
    id: 'crs-204',
    student_id: 'stu-101',
    student_name: 'Alex Morgan',
    student_roll: '22CS045',
    academic_year: '2025-2026',
    semester: 'Semester 6',
    platform: 'Udemy',
    course_name: 'Full Stack Web Development Bootcamp',
    provider: 'Udemy - Angela Yu',
    start_date: '2026-07-01',
    end_date: '2026-08-30',
    duration: '65 hours',
    status: 'Enrolled',
    verified_by_advisor: false,
    created_at: '2026-07-02'
  },
  {
    id: 'crs-205',
    student_id: 'stu-102',
    student_name: 'Priya Sharma',
    student_roll: '22CS082',
    academic_year: '2025-2026',
    semester: 'Semester 6',
    platform: 'Coursera',
    course_name: 'Machine Learning Specialization',
    provider: 'DeepLearning.AI',
    start_date: '2026-02-01',
    end_date: '2026-05-10',
    duration: '40 hours',
    status: 'Completed',
    cert_drive_link: 'https://drive.google.com/file/d/priya_ml_cert/view',
    verified_by_advisor: true,
    created_at: '2026-05-12'
  }
];
