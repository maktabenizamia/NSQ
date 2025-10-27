import type { Student, Teacher, Course, Event } from '../types';

export const students: Omit<Student, 'attendance'>[] = [
  { id: 1, name: 'Alice Johnson', age: 16, grade: 10, class: 'A', performance: 'Excellent', avatar: 'https://picsum.photos/seed/alice/100', address: '123 Maple St', emergencyContactName: 'John Johnson', emergencyContactPhone: '555-1234' },
  { id: 2, name: 'Bob Williams', age: 17, grade: 11, class: 'B', performance: 'Good', avatar: 'https://picsum.photos/seed/bob/100', address: '456 Oak Ave', emergencyContactName: 'Mary Williams', emergencyContactPhone: '555-5678' },
  { id: 3, name: 'Charlie Brown', age: 15, grade: 9, class: 'C', performance: 'Good', avatar: 'https://picsum.photos/seed/charlie/100', address: '789 Pine Ln', emergencyContactName: 'James Brown', emergencyContactPhone: '555-8765' },
  { id: 4, name: 'Diana Miller', age: 18, grade: 12, class: 'A', performance: 'Average', avatar: 'https://picsum.photos/seed/diana/100', address: '101 Elm Ct', emergencyContactName: 'Susan Miller', emergencyContactPhone: '555-4321' },
  { id: 5, name: 'Ethan Davis', age: 16, grade: 10, class: 'B', performance: 'Poor', avatar: 'https://picsum.photos/seed/ethan/100', address: '212 Birch Rd', emergencyContactName: 'Robert Davis', emergencyContactPhone: '555-3456' },
  { id: 6, name: 'Fiona Garcia', age: 17, grade: 11, class: 'C', performance: 'Excellent', avatar: 'https://picsum.photos/seed/fiona/100', address: '333 Cedar Blvd', emergencyContactName: 'Patricia Garcia', emergencyContactPhone: '555-6543' },
];

export const teachers: Teacher[] = [
  { id: 1, name: 'Mr. Smith', subject: 'Mathematics', experience: 15, email: 'smith@zenith.edu', avatar: 'https://picsum.photos/seed/smith/100' },
  { id: 2, name: 'Ms. Jones', subject: 'Physics', experience: 12, email: 'jones@zenith.edu', avatar: 'https://picsum.photos/seed/jones/100' },
  { id: 3, name: 'Dr. Rodriguez', subject: 'Chemistry', experience: 20, email: 'rodriguez@zenith.edu', avatar: 'https://picsum.photos/seed/rodriguez/100' },
  { id: 4, name: 'Mrs. Wilson', subject: 'English', experience: 8, email: 'wilson@zenith.edu', avatar: 'https://picsum.photos/seed/wilson/100' },
];

export const courses: Course[] = [
  { id: 1, title: 'Algebra II', teacherId: 1, department: 'Math', credits: 4 },
  { id: 2, title: 'Quantum Mechanics', teacherId: 2, department: 'Science', credits: 5 },
  { id: 3, title: 'Organic Chemistry', teacherId: 3, department: 'Science', credits: 5 },
  { id: 4, title: 'Shakespearean Literature', teacherId: 4, department: 'Arts', credits: 3 },
  { id: 5, title: 'Calculus I', teacherId: 1, department: 'Math', credits: 4 },
];

const currentYear = new Date().getFullYear();
const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

export const events: Event[] = [
  { id: 1, title: 'Mid-term Exams', date: `${currentYear}-${currentMonth}-10`, type: 'Exam' },
  { id: 2, title: 'Science Fair', date: `${currentYear}-${currentMonth}-15`, type: 'Activity' },
  { id: 3, title: 'Parent-Teacher Meeting', date: `${currentYear}-${currentMonth}-22`, type: 'Meeting' },
  { id: 4, title: 'Winter Break', date: `${currentYear}-12-24`, type: 'Holiday' },
  { id: 5, title: 'Final Exams', date: `${currentYear}-12-15`, type: 'Exam' },
];