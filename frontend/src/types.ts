export type UserRole = 'STUDENT' | 'ADVISOR';

export type AcademicYear = string;
export type Semester = string;

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
  mentor_name?: string;
  mentor_designation?: string;
  student_contact?: string;
  team_members: TeamMember[];
  advisor_status: AdvisorStatus;
  od_final_status: ODFinalStatus;
  my_proof_link?: string;
  my_proof_remarks?: string;
  my_individual_proof_status: ProofStatus;
  advisor_remarks?: string;
  created_at: string;
}

export type LeaveType = 'Personal' | 'Medical';
export type ScholarType = 'Day Scholar' | 'Hosteller';

export interface LeaveApplication {
  id: string;
  student_id: string;
  student_name: string;
  student_roll: string;
  advisor_id: string;
  tutor_id?: string;
  leave_type: LeaveType;
  scholar_type: ScholarType;
  semester: Semester;
  from_date?: string;
  to_date?: string;
  on_date?: string;
  no_of_days: number;
  purpose: string;
  tutor_status?: AdvisorStatus;
  advisor_status: AdvisorStatus;
  is_informed?: boolean;
  created_at: string;
}

export interface Deadline {
  id: string;
  advisor_id: string;
  title: string;
  description?: string;
  due_date: string;
  created_at: string;
}

export interface Class {
  id: string;
  name: string;
  advisor_id: string;
  created_at?: string;
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
  tutor_id?: string;
  class_id?: string;
  is_representative?: boolean;
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
