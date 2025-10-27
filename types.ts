export interface Student {
  id: number;
  name: string;
  age: number;
  grade: number;
  class: string;
  attendance: number; // percentage
  performance: 'Excellent' | 'Good' | 'Average' | 'Poor';
  avatar: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface Teacher {
  id: number;
  name: string;
  subject: string;
  experience: number; // years
  email: string;
  avatar: string;
}

export interface Course {
  id: number;
  title: string;
  teacherId: number;
  department: string;
  credits: number;
}

export interface Event {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD format
  type: 'Holiday' | 'Exam' | 'Activity' | 'Meeting';
}

export interface Enrollment {
  studentId: number;
  courseId: number;
}

export interface AttendanceRecord {
    studentId: number; // Uniquely identifies the student for the record.
    courseId: number;
    date: string; // YYYY-MM-DD
    status: 'Present' | 'Absent' | 'Late';
}

export type ViewType = 'dashboard' | 'students' | 'teachers' | 'courses' | 'events' | 'attendance';