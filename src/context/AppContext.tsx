'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
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
  UserRole,
  Deadline
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
  isInitializing: boolean;
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
  deadlines: Deadline[];
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
  addStudent: (data: Omit<Student, 'id' | 'advisor_id'>) => Promise<void>;
  toggleCourseVerify: (courseId: string, verified: boolean) => void;
  addDeadline: (data: { title: string; description?: string; due_date: string }) => Promise<void>;
  deleteDeadline: (id: string) => Promise<void>;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [academicYear, setAcademicYear] = useState<AcademicYear>('2024-2025');
  const [semester, setSemester] = useState<Semester>('Semester 6');

  const [students, setStudents] = useState<Student[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);

  // Use empty objects casted to the types to prevent null pointer exceptions before data loads
  const [currentStudent, setCurrentStudent] = useState<Student>({} as Student);
  const [currentAdvisor, setCurrentAdvisor] = useState<Advisor>({} as Advisor);

  const [odRequests, setOdRequests] = useState<ODRequest[]>([]);
  const [onlineCourses, setOnlineCourses] = useState<OnlineCourse[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Fetch data from Supabase on mount and poll for dynamic updates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: studentsData } = await supabase.from('students').select('*');
        const { data: advisorsData } = await supabase.from('advisors').select('*');
        const { data: odData } = await supabase.from('od_requests').select('*').order('created_at', { ascending: false });
        const { data: coursesData } = await supabase.from('online_courses').select('*').order('created_at', { ascending: false });
        const { data: deadlinesData } = await supabase.from('deadlines').select('*').order('due_date', { ascending: true });
        
        if (studentsData) setStudents(studentsData);
        if (advisorsData) setAdvisors(advisorsData);
        if (odData) setOdRequests(odData);
        if (coursesData) setOnlineCourses(coursesData);
        if (deadlinesData) setDeadlines(deadlinesData);
        
        let storedUserId = sessionStorage.getItem('userId');
        let storedUserRole = sessionStorage.getItem('userRole');

        // Fallback for older sessions: decode the JWT token directly
        const token = sessionStorage.getItem('token');
        if (token && (!storedUserId || !storedUserRole)) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            storedUserId = payload.id;
            storedUserRole = payload.role;
            sessionStorage.setItem('userId', payload.id);
            sessionStorage.setItem('userRole', payload.role);
          } catch (e) {
            console.error('Failed to decode token payload:', e);
          }
        }

        if (storedUserId && storedUserRole) {
          setRole(storedUserRole as any);
          if (storedUserRole === 'STUDENT') {
            const found = studentsData?.find((s) => s.id === storedUserId);
            if (found) setCurrentStudent(found);
          } else {
            const found = advisorsData?.find((a) => a.id === storedUserId);
            if (found) setCurrentAdvisor(found);
          }
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Error fetching data from Supabase:", err);
      } finally {
        setIsInitializing(false);
      }
    };
    fetchData();

    // Poll for dynamic updates every 10 seconds to keep dashboards in sync
    const intervalId = setInterval(async () => {
      try {
        const { data: odData } = await supabase.from('od_requests').select('*').order('created_at', { ascending: false });
        if (odData) {
          setOdRequests(prev => JSON.stringify(prev) !== JSON.stringify(odData) ? odData : prev);
        }
        
        const { data: coursesData } = await supabase.from('online_courses').select('*').order('created_at', { ascending: false });
        if (coursesData) {
          setOnlineCourses(prev => JSON.stringify(prev) !== JSON.stringify(coursesData) ? coursesData : prev);
        }
      } catch (err) {
        console.error("Error polling for updates:", err);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

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
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userRole');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

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
    addToast('Reset data is disabled while using Supabase.', 'info');
  };

  const addODRequest = async (data: {
    event_name: string;
    description?: string;
    from_date: string;
    to_date: string;
    request_type: ODRequestType;
    team_members: Array<{ student_id: string; roll_no: string; name: string }>;
  }) => {
    if (!currentStudent.id) return;
    
    const newRequest = {
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
      my_individual_proof_status: 'LOCKED'
    };

    const { data: inserted, error } = await supabase.from('od_requests').insert(newRequest).select().single();
    if (error) {
      addToast('Error saving OD request', 'error');
      console.error(error);
    } else if (inserted) {
      setOdRequests((prev) => [inserted, ...prev]);
      addToast('Sent to your advisor for approval', 'success');
    }
  };

  const updateODRequestProof = async (odId: string, driveLink: string, remarks?: string) => {
    const od = odRequests.find(r => r.id === odId);
    if (!od) return;
    
    let updates: any = {};
    if (od.student_id === currentStudent.id) {
      updates = { my_proof_link: driveLink, my_proof_remarks: remarks, my_individual_proof_status: 'SUBMITTED' };
    } else {
      const updatedMembers = od.team_members.map((m) => m.student_id === currentStudent.id ? { ...m, drive_link: driveLink, remarks, individual_proof_status: 'SUBMITTED' } : m);
      updates = { team_members: updatedMembers };
    }

    const { data: updated, error } = await supabase.from('od_requests').update(updates).eq('id', odId).select().single();
    if (!error && updated) {
      setOdRequests(prev => prev.map(r => r.id === odId ? updated : r));
      addToast('Proof submitted — Awaiting verification', 'success');
    } else {
      addToast('Error submitting proof', 'error');
    }
  };

  const advisorReviewOD = async (odId: string, status: AdvisorStatus, remarks?: string) => {
    const od = odRequests.find(r => r.id === odId);
    if (!od) return;

    const newFinalStatus = status === 'APPROVED' ? 'APPROVED' : 'REJECTED';
    const updatedMyProofStatus = newFinalStatus === 'APPROVED' ? (od.my_proof_link ? 'SUBMITTED' : 'OPEN') : 'LOCKED';
    const updatedTeamMembers = od.team_members.map((m) => ({
      ...m,
      individual_proof_status: (newFinalStatus === 'APPROVED' ? (m.drive_link ? 'SUBMITTED' : 'OPEN') : 'LOCKED') as ProofStatus
    }));

    const updates = {
      advisor_status: status,
      od_final_status: newFinalStatus,
      advisor_remarks: remarks,
      my_individual_proof_status: updatedMyProofStatus,
      team_members: updatedTeamMembers
    };

    const { data: updated, error } = await supabase.from('od_requests').update(updates).eq('id', odId).select().single();
    if (!error && updated) {
      setOdRequests(prev => prev.map(r => r.id === odId ? updated : r));
      addToast(status === 'APPROVED' ? 'OD Request Approved successfully' : 'OD Request Rejected', status === 'APPROVED' ? 'success' : 'info');
    } else {
      addToast('Error reviewing OD request', 'error');
    }
  };

  const advisorVerifyProof = async (odId: string, memberStudentId: string, newStatus: 'VERIFIED' | 'REJECTED') => {
    const od = odRequests.find(r => r.id === odId);
    if (!od) return;

    let updates: any = {};
    if (od.student_id === memberStudentId) {
      updates = { my_individual_proof_status: newStatus };
    } else {
      updates = { team_members: od.team_members.map(m => m.student_id === memberStudentId ? { ...m, individual_proof_status: newStatus } : m) };
    }

    const { data: updated, error } = await supabase.from('od_requests').update(updates).eq('id', odId).select().single();
    if (!error && updated) {
      setOdRequests(prev => prev.map(r => r.id === odId ? updated : r));
      addToast(newStatus === 'VERIFIED' ? 'Proof verified and marked complete' : 'Proof rejected — student requested to resubmit', newStatus === 'VERIFIED' ? 'success' : 'info');
    }
  };

  const addStudent = async (data: Omit<Student, 'id' | 'advisor_id'>) => {
    if (!currentAdvisor?.id) return;
    
    const newStudent = {
      ...data,
      advisor_id: currentAdvisor.id
    };

    const { data: inserted, error } = await supabase.from('students').insert(newStudent).select().single();
    
    if (error) {
      addToast('Error adding student', 'error');
      console.error(error);
    } else if (inserted) {
      setStudents((prev) => [...prev, inserted]);
      addToast('Student added successfully', 'success');
    }
  };

  const addOnlineCourse = async (
    data: Omit<OnlineCourse, 'id' | 'student_id' | 'student_name' | 'student_roll' | 'academic_year' | 'semester' | 'verified_by_advisor' | 'created_at'>
  ) => {
    if (!currentStudent.id) return;
    
    const newCourse = {
      ...data,
      student_id: currentStudent.id,
      student_name: currentStudent.name,
      student_roll: currentStudent.roll_no,
      academic_year: academicYear,
      semester: semester,
      verified_by_advisor: false
    };

    const { data: inserted, error } = await supabase.from('online_courses').insert(newCourse).select().single();
    if (!error && inserted) {
      setOnlineCourses(prev => [inserted, ...prev]);
      addToast('Course added', 'success');
    } else {
      addToast('Error saving course', 'error');
    }
  };

  const toggleCourseVerify = async (courseId: string, verified: boolean) => {
    const { data: updated, error } = await supabase.from('online_courses').update({ verified_by_advisor: verified }).eq('id', courseId).select().single();
    if (!error && updated) {
      setOnlineCourses(prev => prev.map(c => c.id === courseId ? updated : c));
      addToast(verified ? 'Course marked as Verified ✓' : 'Course verification removed', 'info');
    }
  };

  const addDeadline = async (data: { title: string; description?: string; due_date: string }) => {
    if (!currentAdvisor?.id) return;
    
    const newDeadline = {
      ...data,
      advisor_id: currentAdvisor.id
    };

    const { data: inserted, error } = await supabase.from('deadlines').insert(newDeadline).select().single();
    
    if (error) {
      addToast('Error adding deadline', 'error');
      console.error(error);
    } else if (inserted) {
      setDeadlines((prev) => [...prev, inserted].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()));
      addToast('Deadline added successfully', 'success');
    }
  };

  const deleteDeadline = async (id: string) => {
    const { error } = await supabase.from('deadlines').delete().eq('id', id);
    if (error) {
      addToast('Error deleting deadline', 'error');
      console.error(error);
    } else {
      setDeadlines((prev) => prev.filter(d => d.id !== id));
      addToast('Deadline deleted', 'info');
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isAuthenticated,
        isInitializing,
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
        deadlines,
        toasts,
        addToast,
        removeToast,
        addODRequest,
        updateODRequestProof,
        advisorReviewOD,
        advisorVerifyProof,
        addStudent,
        addOnlineCourse,
        toggleCourseVerify,
        addDeadline,
        deleteDeadline,
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
