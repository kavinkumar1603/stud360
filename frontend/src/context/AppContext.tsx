import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_OD_REQUESTS, INITIAL_ONLINE_COURSES, MOCK_ADVISORS, MOCK_STUDENTS } from '../data/mockData';
import {
  AcademicYear,
  Advisor,
  AdvisorStatus,
  ODRequest,
  ODRequestType,
  OnlineCourse,
  ProofStatus,
  Semester,
  Student,
  UserRole
} from '../types';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (userId: string, targetRole: UserRole) => void;
  logout: () => void;
  academicYear: AcademicYear;
  setAcademicYear: (ay: AcademicYear) => void;
  semester: Semester;
  setSemester: (sem: Semester) => void;
  currentStudent: Student;
  setCurrentStudent: (student: Student) => void;
  currentAdvisor: Advisor;
  setCurrentAdvisor: (advisor: Advisor) => void;
  students: Student[];
  advisors: Advisor[];
  odRequests: ODRequest[];
  onlineCourses: OnlineCourse[];
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  addODRequest: (data: {
    event_name: string;
    description?: string;
    from_date: string;
    to_date: string;
    request_type: ODRequestType;
    team_members: Array<{ student_id: string; roll_no: string; name: string }>;
  }) => void;
  updateODRequestProof: (odId: string, driveLink: string, remarks?: string) => Promise<void>;
  advisorReviewOD: (odId: string, status: AdvisorStatus, remarks?: string) => Promise<void>;
  advisorVerifyProof: (odId: string, memberStudentId: string, newStatus: 'VERIFIED' | 'REJECTED') => Promise<void>;
  addOnlineCourse: (data: Omit<OnlineCourse, 'id' | 'student_id' | 'student_name' | 'student_roll' | 'academic_year' | 'semester' | 'verified_by_advisor' | 'created_at'>) => void;
  toggleCourseVerify: (courseId: string, verified: boolean) => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('academic_is_auth');
    return saved !== null ? JSON.parse(saved) : true; // default logged in for seamless demo
  });
  const [academicYear, setAcademicYear] = useState<AcademicYear>('2025-2026');
  const [semester, setSemester] = useState<Semester>('Semester 6');

  const [students] = useState<Student[]>(MOCK_STUDENTS);
  const [advisors] = useState<Advisor[]>(MOCK_ADVISORS);

  const [currentStudent, setCurrentStudent] = useState<Student>(MOCK_STUDENTS[0]);
  const [currentAdvisor, setCurrentAdvisor] = useState<Advisor>(MOCK_ADVISORS[0]);

  useEffect(() => {
    localStorage.setItem('academic_is_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const login = (userId: string, targetRole: UserRole) => {
    setRole(targetRole);
    if (targetRole === 'STUDENT') {
      const found = students.find((s) => s.id === userId) || students[0];
      setCurrentStudent(found);
    } else {
      const found = advisors.find((a) => a.id === userId) || advisors[0];
      setCurrentAdvisor(found);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const [odRequests, setOdRequests] = useState<ODRequest[]>(() => {
    const saved = localStorage.getItem('academic_od_requests');
    return saved ? JSON.parse(saved) : INITIAL_OD_REQUESTS;
  });

  const [onlineCourses, setOnlineCourses] = useState<OnlineCourse[]>(() => {
    const saved = localStorage.getItem('academic_online_courses');
    return saved ? JSON.parse(saved) : INITIAL_ONLINE_COURSES;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem('academic_od_requests', JSON.stringify(odRequests));
  }, [odRequests]);

  useEffect(() => {
    localStorage.setItem('academic_online_courses', JSON.stringify(onlineCourses));
  }, [onlineCourses]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const resetToDefaultData = () => {
    setOdRequests(INITIAL_OD_REQUESTS);
    setOnlineCourses(INITIAL_ONLINE_COURSES);
    localStorage.removeItem('academic_od_requests');
    localStorage.removeItem('academic_online_courses');
    addToast('Demo data reset to initial default state', 'info');
  };

  // 2.3 Submit OD Request
  const addODRequest = (data: {
    event_name: string;
    description?: string;
    from_date: string;
    to_date: string;
    request_type: ODRequestType;
    team_members: Array<{ student_id: string; roll_no: string; name: string }>;
  }) => {
    const newRequest: ODRequest = {
      id: `od-${Date.now().toString().slice(-4)}`,
      student_id: currentStudent.id,
      student_name: currentStudent.name,
      student_roll: currentStudent.roll_no,
      advisor_id: currentStudent.advisor_id,
      academic_year: academicYear,
      semester: semester,
      event_name: data.event_name,
      description: data.description,
      from_date: data.from_date,
      to_date: data.to_date,
      request_type: data.request_type,
      team_members: data.team_members.map((m) => ({
        ...m,
        individual_proof_status: 'LOCKED'
      })),
      advisor_status: 'PENDING',
      od_final_status: 'PENDING',
      my_individual_proof_status: 'LOCKED',
      created_at: new Date().toISOString().split('T')[0]
    };

    setOdRequests((prev) => [newRequest, ...prev]);
    addToast('Sent to your advisor for approval', 'success');
  };

  // 2.5 Submit Proof (Student) with optimistic flip to SUBMITTED
  const updateODRequestProof = async (odId: string, driveLink: string, remarks?: string) => {
    setOdRequests((prev) =>
      prev.map((od) => {
        if (od.id !== odId) return od;

        // If I am the main requester
        if (od.student_id === currentStudent.id) {
          return {
            ...od,
            my_proof_link: driveLink,
            my_proof_remarks: remarks,
            my_individual_proof_status: 'SUBMITTED'
          };
        }

        // If I am a team member
        const isTeamMember = od.team_members.some((m) => m.student_id === currentStudent.id);
        if (isTeamMember) {
          return {
            ...od,
            team_members: od.team_members.map((m) =>
              m.student_id === currentStudent.id
                ? {
                    ...m,
                    drive_link: driveLink,
                    remarks: remarks,
                    individual_proof_status: 'SUBMITTED'
                  }
                : m
            )
          };
        }

        return od;
      })
    );
    addToast('Proof submitted — Awaiting verification', 'success');
  };

  // 3.5 Advisor Approve / Reject OD Request
  const advisorReviewOD = async (odId: string, status: AdvisorStatus, remarks?: string) => {
    setOdRequests((prev) =>
      prev.map((od) => {
        if (od.id !== odId) return od;

        // If advisor approves, check if final OD status unlocks proof upload or is auto-approved/pending
        const newAdvisorStatus = status;
        // In our academic flow: when advisor approves, od_final_status transitions to APPROVED (or PENDING if secondary level exists).
        // If advisor approves, let's set od_final_status to 'APPROVED' so proof unlocks immediately for testing!
        const newFinalStatus = status === 'APPROVED' ? 'APPROVED' : 'REJECTED';

        const updatedMyProofStatus: ProofStatus =
          newFinalStatus === 'APPROVED' ? (od.my_proof_link ? 'SUBMITTED' : 'OPEN') : 'LOCKED';

        const updatedTeamMembers = od.team_members.map((m) => ({
          ...m,
          individual_proof_status: (newFinalStatus === 'APPROVED'
            ? m.drive_link
              ? 'SUBMITTED'
              : 'OPEN'
            : 'LOCKED') as ProofStatus
        }));

        return {
          ...od,
          advisor_status: newAdvisorStatus,
          od_final_status: newFinalStatus,
          advisor_remarks: remarks,
          my_individual_proof_status: updatedMyProofStatus,
          team_members: updatedTeamMembers
        };
      })
    );

    if (status === 'APPROVED') {
      addToast('OD Request Approved successfully', 'success');
    } else {
      addToast('OD Request Rejected', 'info');
    }
  };

  // 3.5 Advisor Verify / Reject Individual Proof per-member
  const advisorVerifyProof = async (odId: string, memberStudentId: string, newStatus: 'VERIFIED' | 'REJECTED') => {
    setOdRequests((prev) =>
      prev.map((od) => {
        if (od.id !== odId) return od;

        // If it's the main student
        if (od.student_id === memberStudentId) {
          return {
            ...od,
            my_individual_proof_status: newStatus
          };
        }

        // If it's a team member
        return {
          ...od,
          team_members: od.team_members.map((m) =>
            m.student_id === memberStudentId
              ? {
                  ...m,
                  individual_proof_status: newStatus
                }
              : m
          )
        };
      })
    );

    if (newStatus === 'VERIFIED') {
      addToast('Proof verified and marked complete', 'success');
    } else {
      addToast('Proof rejected — student requested to resubmit', 'info');
    }
  };

  // 2.6 Add Online Course
  const addOnlineCourse = (
    data: Omit<
      OnlineCourse,
      'id' | 'student_id' | 'student_name' | 'student_roll' | 'academic_year' | 'semester' | 'verified_by_advisor' | 'created_at'
    >
  ) => {
    const newCourse: OnlineCourse = {
      ...data,
      id: `crs-${Date.now().toString().slice(-4)}`,
      student_id: currentStudent.id,
      student_name: currentStudent.name,
      student_roll: currentStudent.roll_no,
      academic_year: academicYear,
      semester: semester,
      verified_by_advisor: false,
      created_at: new Date().toISOString().split('T')[0]
    };

    setOnlineCourses((prev) => [newCourse, ...prev]);
    addToast('Course added', 'success');
  };

  // 3.6 Toggle Course Verification
  const toggleCourseVerify = (courseId: string, verified: boolean) => {
    setOnlineCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, verified_by_advisor: verified } : c))
    );
    addToast(verified ? 'Course marked as Verified ✓' : 'Course verification removed', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isAuthenticated,
        login,
        logout,
        academicYear,
        setAcademicYear,
        semester,
        setSemester,
        currentStudent,
        setCurrentStudent,
        currentAdvisor,
        setCurrentAdvisor,
        students,
        advisors,
        odRequests,
        onlineCourses,
        toasts,
        addToast,
        removeToast,
        addODRequest,
        updateODRequestProof,
        advisorReviewOD,
        advisorVerifyProof,
        addOnlineCourse,
        toggleCourseVerify,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
