import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StudentManagement } from './components/StudentManagement';
import { TeacherManagement } from './components/TeacherManagement';
import { CourseManagement } from './components/CourseManagement';
import { EventCalendar } from './components/EventCalendar';
import { AttendanceManagement } from './components/AttendanceManagement';
import { students as initialStudentsData, teachers as initialTeachers, courses as initialCourses, events as initialEvents } from './data/mockData';
import type { ViewType, Enrollment, AttendanceRecord, Student, Event, Teacher } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [attendanceContext, setAttendanceContext] = useState<{ courseId: number } | null>(null);

  const [students, setStudents] = useState<Omit<Student, 'attendance'>[]>(initialStudentsData);
  
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const saved = window.localStorage.getItem('zenith-teachers');
      return saved ? JSON.parse(saved) : initialTeachers;
    } catch (error) {
      console.error("Could not load teachers", error);
      return initialTeachers;
    }
  });

  const [courses, setCourses] = useState(() => {
    try {
      const saved = window.localStorage.getItem('zenith-courses');
      return saved ? JSON.parse(saved) : initialCourses;
    } catch (error) {
      console.error("Could not load courses", error);
      return initialCourses;
    }
  });
  
  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const saved = window.localStorage.getItem('zenith-events');
      return saved ? JSON.parse(saved) : initialEvents;
    } catch (error) {
      console.error("Could not load events", error);
      return initialEvents;
    }
  });
  
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    try {
      const saved = window.localStorage.getItem('zenith-enrollments');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Could not load enrollments", error);
      return [];
    }
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = window.localStorage.getItem('zenith-attendance');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Could not load attendance records", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('zenith-teachers', JSON.stringify(teachers));
    } catch (error) {
      console.error("Could not save teachers", error);
    }
  }, [teachers]);

  useEffect(() => {
    try {
      window.localStorage.setItem('zenith-courses', JSON.stringify(courses));
    } catch (error) {
      console.error("Could not save courses", error);
    }
  }, [courses]);

  useEffect(() => {
    try {
      window.localStorage.setItem('zenith-enrollments', JSON.stringify(enrollments));
    } catch (error) {
      console.error("Could not save enrollments", error);
    }
  }, [enrollments]);

  // Persists all attendance records, including the crucial studentId for each, to localStorage.
  useEffect(() => {
    try {
      window.localStorage.setItem('zenith-attendance', JSON.stringify(attendanceRecords));
    } catch (error) {
      console.error("Could not save attendance records", error);
    }
  }, [attendanceRecords]);

  useEffect(() => {
    try {
      window.localStorage.setItem('zenith-events', JSON.stringify(events));
    } catch (error) {
      console.error("Could not save events", error);
    }
  }, [events]);

  const studentsWithCalculatedAttendance = useMemo((): Student[] => {
    return students.map(student => {
      const studentRecords = attendanceRecords.filter(r => r.studentId === student.id);
      if (studentRecords.length === 0) {
        return { ...student, attendance: 100 };
      }
      const presentCount = studentRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
      const percentage = Math.round((presentCount / studentRecords.length) * 100);
      return { ...student, attendance: percentage };
    });
  }, [students, attendanceRecords]);

  const handleTakeAttendance = (courseId: number) => {
    setAttendanceContext({ courseId });
    setCurrentView('attendance');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard students={studentsWithCalculatedAttendance} teachers={teachers} courses={courses} events={events} />;
      case 'students':
        return <StudentManagement students={studentsWithCalculatedAttendance} setStudents={setStudents} courses={courses} enrollments={enrollments} />;
      case 'teachers':
        return <TeacherManagement teachers={teachers} setTeachers={setTeachers} />;
      case 'courses':
        const handleSetEnrollments = (newEnrollments:  React.SetStateAction<Enrollment[]>) => {
            setEnrollments(prevEnrollments => {
                const updatedEnrollments = typeof newEnrollments === 'function' ? newEnrollments(prevEnrollments) : newEnrollments;
                // when a course is deleted, remove its enrollments
                const activeCourseIds = new Set(courses.map(c => c.id));
                return updatedEnrollments.filter(e => activeCourseIds.has(e.courseId));
            });
        };
        return <CourseManagement courses={courses} setCourses={setCourses} teachers={teachers} students={studentsWithCalculatedAttendance} enrollments={enrollments} setEnrollments={handleSetEnrollments} onTakeAttendance={handleTakeAttendance} />;
      case 'attendance':
        return <AttendanceManagement students={studentsWithCalculatedAttendance} courses={courses} enrollments={enrollments} attendanceRecords={attendanceRecords} setAttendanceRecords={setAttendanceRecords} initialContext={attendanceContext} />;
      case 'events':
        return <EventCalendar events={events} setEvents={setEvents} />;
      default:
        return <Dashboard students={studentsWithCalculatedAttendance} teachers={teachers} courses={courses} events={events}/>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar currentView={currentView} setView={setCurrentView} isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Header currentView={currentView} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
