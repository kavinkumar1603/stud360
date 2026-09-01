'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AcademicYear,
  Advisor,
  AdvisorStatus,
  ODRequest,
  ODRequestType,
  ProofStatus,
  Semester,
  Student,
  UserRole,
  Deadline,
  Class,
  LeaveApplication,
  LeaveType,
  ScholarType
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
  classes: Class[];
  odRequests: ODRequest[];
  deadlines: Deadline[];
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  addClass: (name: string) => Promise<void>;
  removeClass: (id: string) => Promise<void>;
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
  addStudent: (data: Omit<Student, 'id' | 'advisor_id'>) => Promise<void>;
  addDeadline: (data: { title: string; description?: string; due_date: string }) => Promise<void>;
  deleteODRequest: (id: string) => Promise<void>;
  deleteDeadline: (id: string) => Promise<void>;
  leaveApplications: LeaveApplication[];
  addLeaveApplication: (data: { leave_type: LeaveType; scholar_type: ScholarType; semester: Semester; from_date?: string; to_date?: string; on_date?: string; no_of_days: number; purpose: string }) => Promise<void>;
  advisorReviewLeave: (id: string, status: AdvisorStatus) => Promise<void>;
  tutorReviewLeave: (id: string, status: AdvisorStatus) => Promise<void>;
  deleteLeaveApplication: (id: string) => Promise<void>;
  toggleRepresentativeStatus: (studentId: string, isRep: boolean) => Promise<void>;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const API_URL = '/api';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [academicYear, setAcademicYear] = useState<AcademicYear>('2026-2027');
  const [semester, setSemester] = useState<Semester>('Semester 5');

  const [students, setStudents] = useState<Student[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  // Use empty objects casted to the types to prevent null pointer exceptions before data loads
  const [currentStudent, setCurrentStudent] = useState<Student>({} as Student);
  const [currentAdvisor, setCurrentAdvisor] = useState<Advisor>({} as Advisor);

  const [odRequests, setOdRequests] = useState<ODRequest[]>([]);
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Fetch data from Node.js backend on mount and poll for dynamic updates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          setIsInitializing(false);
          return;
        }

        const response = await fetch(`${API_URL}/data`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('userRole');
            window.location.href = '/';
            return;
          }
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        if (data.students) setStudents(data.students);
        if (data.advisors) setAdvisors(data.advisors);
        if (data.classes) setClasses(data.classes);
        
        if (data.leaveApplications) {
          setLeaveApplications(data.leaveApplications);
        }

        if (data.odRequests) {
          const mapped = data.odRequests.map((od: any) => ({
            ...od,
            academic_year: od.academic_year === '2024-2025' ? '2026-2027' : od.academic_year
          }));
          setOdRequests(mapped);
        }
        if (data.deadlines) setDeadlines(data.deadlines);
        
        let storedUserId = sessionStorage.getItem('userId');
        let storedUserRole = sessionStorage.getItem('userRole');

        // Fallback for older sessions: decode the JWT token directly
        if (token && (!storedUserId || !storedUserRole)) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            storedUserId = payload.id;
            storedUserRole = payload.role;
            sessionStorage.setItem('userId', payload.id);
            sessionStorage.setItem('userRole', payload.role);
          } catch (e) {
            console.error('An error occurred');
          }
        }

        if (storedUserId && storedUserRole) {
          setRole(storedUserRole as any);
          if (storedUserRole === 'STUDENT') {
            const found = data.students?.find((s: Student) => s.id === storedUserId);
            if (found) setCurrentStudent(found);
          } else {
            const found = data.advisors?.find((a: Advisor) => a.id === storedUserId);
            if (found) setCurrentAdvisor(found);
          }
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.warn('Failed to fetch initial data, check backend connection');
      } finally {
        setIsInitializing(false);
      }
    };
    fetchData();
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
    addToast('Reset data is disabled while using backend.', 'info');
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
      academic_year: academicYear === '2026-2027' ? '2024-2025' : academicYear,
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

    try {
      const res = await fetch(`${API_URL}/od-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
        body: JSON.stringify(newRequest)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(`Failed to save: ${errData.error || res.statusText}`);
      }
      const inserted = await res.json();
      
      // Map it back for the frontend state
      if (inserted.academic_year === '2024-2025') {
        inserted.academic_year = '2026-2027';
      }
      
      setOdRequests((prev) => [inserted, ...prev]);
      addToast('Sent to your advisor for approval', 'success');
    } catch (error: any) {
      addToast(error.message || 'Error saving OD request', 'error');
      console.error('An error occurred');
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

    try {
      const res = await fetch(`${API_URL}/od-requests/${odId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      if (updated.academic_year === '2024-2025') {
        updated.academic_year = '2026-2027';
      }
      setOdRequests(prev => prev.map(r => r.id === odId ? updated : r));
      addToast('Proof submitted — Awaiting verification', 'success');
    } catch (error) {
      addToast('Error submitting proof', 'error');
      console.error('An error occurred');
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

    try {
      const res = await fetch(`${API_URL}/od-requests/${odId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      if (updated.academic_year === '2024-2025') {
        updated.academic_year = '2026-2027';
      }
      setOdRequests(prev => prev.map(r => r.id === odId ? updated : r));
      addToast(status === 'APPROVED' ? 'OD Request Approved successfully' : 'OD Request Rejected', status === 'APPROVED' ? 'success' : 'info');
    } catch (error) {
      addToast('Error reviewing OD request', 'error');
      console.error('An error occurred');
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

    try {
      const res = await fetch(`${API_URL}/od-requests/${odId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      if (updated.academic_year === '2024-2025') {
        updated.academic_year = '2026-2027';
      }
      setOdRequests(prev => prev.map(r => r.id === odId ? updated : r));
      addToast(newStatus === 'VERIFIED' ? 'Proof verified and marked complete' : 'Proof rejected — student requested to resubmit', newStatus === 'VERIFIED' ? 'success' : 'info');
    } catch (error) {
      console.error('An error occurred');
    }
  };

  const addStudent = async (data: Omit<Student, 'id' | 'advisor_id'>) => {
    if (!currentAdvisor?.id) return;
    
    const newStudent = {
      ...data,
      advisor_id: currentAdvisor.id
    };

    try {
      const res = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
        body: JSON.stringify(newStudent)
      });
      if (!res.ok) throw new Error('Failed to save');
      const inserted = await res.json();
      setStudents((prev) => [...prev, inserted]);
      addToast('Student added successfully', 'success');
    } catch (error) {
      addToast('Error adding student', 'error');
      console.error('An error occurred');
    }
  };const addDeadline = async (data: { title: string; description?: string; due_date: string }) => {
    if (!currentAdvisor?.id) return;
    
    const newDeadline = {
      ...data,
      advisor_id: currentAdvisor.id
    };

    try {
      const res = await fetch(`${API_URL}/deadlines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
        body: JSON.stringify(newDeadline)
      });
      if (!res.ok) throw new Error('Failed to save');
      const inserted = await res.json();
      setDeadlines((prev) => [...prev, inserted].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()));
      addToast('Deadline added successfully', 'success');
    } catch (error) {
      addToast('Error adding deadline', 'error');
      console.error('An error occurred');
    }
  };

  const deleteDeadline = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/deadlines/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      setDeadlines((prev) => prev.filter(d => d.id !== id));
      addToast('Deadline deleted', 'info');
    } catch (error) {
      addToast('Error deleting deadline', 'error');
      console.error('An error occurred');
    }
  };

  const deleteODRequest = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/od-requests/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      });
      if (!res.ok) {
        if (res.status === 404) {
          // Fallback: If backend is outdated and returns 404, delete directly from Supabase
          const { supabase } = await import('../utils/supabase');
          const { error } = await supabase.from('od_requests').delete().eq('id', id);
          if (error) throw error;
        } else {
          const errText = await res.text().catch(() => '');
          throw new Error(`Failed to delete OD request (Status: ${res.status}). Details: ${errText}`);
        }
      }
      setOdRequests((prev) => prev.filter(od => od.id !== id));
      addToast('OD request deleted successfully', 'info');
    } catch (error) {
      addToast('Error deleting OD request', 'error');
      console.error('An error occurred');
    }
  };

  const addClass = async (name: string) => {
    if (!currentAdvisor?.id) return;

    try {
      const res = await fetch(`${API_URL}/classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
        body: JSON.stringify({ name, advisor_id: currentAdvisor.id })
      });
      if (!res.ok) throw new Error('Failed to save');
      const inserted = await res.json();
      setClasses(prev => [...prev, inserted]);
      addToast('Class created successfully', 'success');
    } catch (error) {
      addToast('Error creating class', 'error');
      console.error('An error occurred');
    }
  };

  const removeClass = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/classes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      setClasses(prev => prev.filter(c => c.id !== id));
      
      // Update local students state to unassign them from the deleted class
      setStudents(prev => prev.map(s => s.class_id === id ? { ...s, class_id: undefined } : s));
      
      addToast('Class removed successfully', 'info');
    } catch (error) {
      addToast('Error removing class', 'error');
      console.error('An error occurred');
    }
  };

  const addLeaveApplication = async (data: { leave_type: LeaveType; scholar_type: ScholarType; semester: Semester; from_date?: string; to_date?: string; on_date?: string; no_of_days: number; purpose: string }) => {
    if (!currentStudent?.id) return;
    
    const newLeave = {
      student_id: currentStudent.id,
      student_name: currentStudent.name,
      student_roll: currentStudent.roll_no,
      advisor_id: currentStudent.advisor_id,
      tutor_id: currentStudent.tutor_id || null,
      ...data,
      tutor_status: 'PENDING',
      advisor_status: 'PENDING'
    };

    try {
      const res = await fetch(`${API_URL}/leave-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
        body: JSON.stringify(newLeave)
      });
      
      let inserted;
      if (!res.ok) {
        if (res.status === 404) {
          // Fallback: If backend is outdated and returns 404, insert directly to Supabase
          const { supabase } = await import('../utils/supabase');
          const { data: insertedData, error } = await supabase.from('leave_applications').insert(newLeave).select().single();
          if (error) throw error;
          inserted = insertedData;
        } else {
          throw new Error('Failed to save');
        }
      } else {
        inserted = await res.json();
      }
      
      setLeaveApplications(prev => [inserted, ...prev]);
      addToast('Leave application sent to your advisor', 'success');
    } catch (error) {
      addToast('Error saving leave application', 'error');
      console.error('An error occurred');
    }
  };

  const advisorReviewLeave = async (id: string, status: AdvisorStatus) => {
    try {
      const res = await fetch(`${API_URL}/leave-applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
        body: JSON.stringify({ advisor_status: status })
      });
      
      let updated;
      if (!res.ok) {
        if (res.status === 404) {
          const { supabase } = await import('../utils/supabase');
          const { data: updatedData, error } = await supabase.from('leave_applications').update({ advisor_status: status }).eq('id', id).select().single();
          if (error) throw error;
          updated = updatedData;
        } else {
          throw new Error('Failed to update');
        }
      } else {
        updated = await res.json();
      }
      
      setLeaveApplications(prev => prev.map(l => l.id === id ? updated : l));
      addToast(`Leave Application ${status}`, 'success');
    } catch (error) {
      addToast('Error updating leave application', 'error');
      console.error('An error occurred');
    }
  };

  const tutorReviewLeave = async (id: string, status: AdvisorStatus) => {
    try {
      const res = await fetch(`${API_URL}/leave-applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
        body: JSON.stringify({ tutor_status: status })
      });
      
      let updated;
      if (!res.ok) {
        if (res.status === 404) {
          const { supabase } = await import('../utils/supabase');
          const { data: updatedData, error } = await supabase.from('leave_applications').update({ tutor_status: status }).eq('id', id).select().single();
          if (error) throw error;
          updated = updatedData;
        } else {
          throw new Error('Failed to update');
        }
      } else {
        updated = await res.json();
      }
      
      setLeaveApplications(prev => prev.map(l => l.id === id ? updated : l));
      addToast(`Tutor Leave Approval ${status}`, 'success');
    } catch (error) {
      addToast('Error updating leave application tutor status', 'error');
      console.error('An error occurred');
    }
  };

  const deleteLeaveApplication = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/leave-applications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          // Fallback: If backend is outdated and returns 404, delete directly from Supabase
          const { supabase } = await import('../utils/supabase');
          const { error } = await supabase.from('leave_applications').delete().eq('id', id);
          if (error) throw error;
        } else {
          throw new Error('Failed to delete');
        }
      }
      
      setLeaveApplications(prev => prev.filter(l => l.id !== id));
      addToast('Leave application deleted', 'info');
    } catch (error) {
      addToast('Error deleting leave application', 'error');
      console.error('An error occurred');
    }
  };

  const toggleRepresentativeStatus = async (studentId: string, isRep: boolean) => {
    try {
      const res = await fetch(`${API_URL}/students/${studentId}/representative`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({ is_representative: isRep })
      });
      if (res.ok) {
        setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, is_representative: isRep } : s)));
        addToast(`Student is ${isRep ? 'now' : 'no longer'} a Class Representative`);
      } else if (res.status === 404) {
        // Fallback: If backend is outdated/not deployed, update directly via Supabase
        const { supabase } = await import('../utils/supabase');
        const { error } = await supabase.from('students').update({ is_representative: isRep }).eq('id', studentId);
        if (error) {
           if (error.message?.includes('column "is_representative" of relation "students" does not exist')) {
             addToast('Database schema error: Please run the SQL migration to add is_representative column.', 'error');
           } else {
             throw error;
           }
        } else {
           setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, is_representative: isRep } : s)));
           addToast(`Student is ${isRep ? 'now' : 'no longer'} a Class Representative`);
        }
      } else {
        addToast('Failed to update representative status', 'error');
      }
    } catch (error) {
      console.error(error);
      addToast('Failed to connect to server or update database', 'error');
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
        classes,
        odRequests,
        deadlines,
        toasts,
        addToast,
        removeToast,
        addClass,
        removeClass,
        addODRequest,
        updateODRequestProof,
        advisorReviewOD,
        advisorVerifyProof,
        addStudent,
        addDeadline,
        deleteODRequest,
        deleteDeadline,
        leaveApplications,
        addLeaveApplication,
        advisorReviewLeave,
        tutorReviewLeave,
        deleteLeaveApplication,
        toggleRepresentativeStatus,
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
