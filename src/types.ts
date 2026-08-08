export type UserRole = 'STUDENT' | 'ADVISOR';

export type AcademicYear = '2025-2026' | '2024-2025' | '2023-2024';
export type Semester =
  | 'Semester 1'
  | 'Semester 2'
  | 'Semester 3'
  | 'Semester 4'
  | 'Semester 5'
  | 'Semester 6'
  | 'Semester 7'
  | 'Semester 8';

export type ODRequestType = 'Individual' | 'Team';

export type AdvisorStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ODFinalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type ProofStatus = 'LOCKED' | 'OPEN' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';

export interface TeamMember {
  student_id: string;
  roll_no: string;
  name: string;
  individual_proof_status: ProofStatus;
  drive_link?: string;
  remarks?: string;
}

export interface ODRequest {
  id: string;
  student_id: string;
  student_name: string;
  student_roll: string;
  advisor_id: string;
  academic_year: AcademicYear;
  semester: Semester;
  event_name: string;
  description?: string;
  from_date: string;
  to_date: string;
  number_of_days?: number;
  request_type: ODRequestType;
  event_category?: string;
  location?: string;
  team_members: TeamMember[];
  advisor_status: AdvisorStatus;
  od_final_status: ODFinalStatus;
  my_proof_link?: string;
  my_proof_remarks?: string;
  my_individual_proof_status: ProofStatus;
  advisor_remarks?: string;
  created_at: string;
}

export type CoursePlatform = 'NPTEL' | 'Udemy' | 'Coursera' | 'Other';
export type CourseStatus = 'Enrolled' | 'In Progress' | 'Completed' | 'Dropped';

export interface OnlineCourse {
  id: string;
  student_id: string;
  student_name: string;
  student_roll: string;
  academic_year: AcademicYear;
  semester: Semester;
  platform: CoursePlatform;
  course_name: string;
  provider?: string;
  start_date: string;
  end_date: string;
  duration: string;
  status: CourseStatus;
  cert_drive_link?: string;
  certificate_url?: string;
  grade?: string;
  verified_by_advisor: boolean;
  created_at: string;
}

export interface Student {
  id: string;
  roll_no: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  section?: string;
  year?: string;
  semester: Semester;
  advisor_id: string;
  avatar?: string;
}

export interface Advisor {
  id: string;
  name: string;
  department: string;
  email: string;
  phone?: string;
  title: string;
  avatar?: string;
}

export interface StatusPillConfig {
  text: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  isTappable?: boolean;
}
