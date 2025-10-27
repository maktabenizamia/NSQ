import React, { useState } from 'react';
import type { Course, Teacher, Student, Enrollment } from '../types';
import { CloseIcon } from './icons';

interface CourseManagementProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  teachers: Teacher[];
  students: Student[];
  enrollments: Enrollment[];
  setEnrollments: React.Dispatch<React.SetStateAction<Enrollment[]>>;
  onTakeAttendance: (courseId: number) => void;
}

const CourseModal: React.FC<{
    course: Partial<Course> | null;
    teachers: Teacher[];
    onClose: () => void;
    onSave: (course: Course) => void;
}> = ({ course, teachers, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Course>>(course || {});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'teacherId' || name === 'credits' ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Course);
    };

    if (!course) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{course.id ? 'Edit Course' : 'Add New Course'}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-600">Course Title</label>
                        <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Department</label>
                            <input type="text" name="department" value={formData.department || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Credits</label>
                            <input type="number" name="credits" value={formData.credits || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600">Assign Teacher</label>
                        <select name="teacherId" value={formData.teacherId || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" required>
                            <option value="">Select a teacher</option>
                            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                     <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">Save Course</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EnrollmentModal: React.FC<{
    course: Course;
    students: Student[];
    enrollments: Enrollment[];
    onClose: () => void;
    onEnroll: (studentId: number, courseId: number) => void;
    onUnenroll: (studentId: number, courseId: number) => void;
}> = ({ course, students, enrollments, onClose, onEnroll, onUnenroll }) => {
    const [selectedStudent, setSelectedStudent] = useState<string>('');

    const enrolledStudentIds = enrollments
        .filter(e => e.courseId === course.id)
        .map(e => e.studentId);
    
    const enrolledStudents = students.filter(s => enrolledStudentIds.includes(s.id));
    const availableStudents = students.filter(s => !enrolledStudentIds.includes(s.id));

    const handleEnroll = () => {
        if (selectedStudent) {
            onEnroll(parseInt(selectedStudent, 10), course.id);
            setSelectedStudent('');
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg m-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Manage Enrollment</h2>
                        <p className="text-slate-600">{course.title}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Enroll New Student */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">Enroll New Student</h3>
                    <div className="flex gap-2">
                        <select 
                            value={selectedStudent} 
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            className="flex-grow mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500"
                        >
                            <option value="">Select a student...</option>
                            {availableStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <button onClick={handleEnroll} disabled={!selectedStudent} className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:bg-slate-400">Enroll</button>
                    </div>
                </div>

                {/* Enrolled Students List */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">Currently Enrolled ({enrolledStudents.length})</h3>
                    <div className="bg-slate-50 p-3 rounded-md max-h-60 overflow-y-auto">
                        {enrolledStudents.length > 0 ? (
                            <ul className="space-y-2">
                                {enrolledStudents.map(student => (
                                    <li key={student.id} className="flex justify-between items-center bg-white p-2 rounded">
                                        <span className="text-slate-800">{student.name}</span>
                                        <button onClick={() => onUnenroll(student.id, course.id)} className="font-medium text-red-600 hover:text-red-800 text-sm">Unenroll</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-500 text-center py-4">No students enrolled.</p>
                        )}
                    </div>
                </div>
                 <div className="flex justify-end pt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Done</button>
                </div>
            </div>
        </div>
    );
};

export const CourseManagement: React.FC<CourseManagementProps> = ({ courses, setCourses, teachers, students, enrollments, setEnrollments, onTakeAttendance }) => {
  const [editingEnrollment, setEditingEnrollment] = useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Partial<Course> | null>(null);

  const getTeacherName = (teacherId: number) => {
    return teachers.find(t => t.id === teacherId)?.name || 'N/A';
  };

  const handleEnroll = (studentId: number, courseId: number) => {
    const isAlreadyEnrolled = enrollments.some(e => e.studentId === studentId && e.courseId === courseId);
    if (!isAlreadyEnrolled) {
      setEnrollments([...enrollments, { studentId, courseId }]);
    }
  };

  const handleUnenroll = (studentId: number, courseId: number) => {
    setEnrollments(enrollments.filter(e => !(e.studentId === studentId && e.courseId === courseId)));
  };

  const handleSaveCourse = (courseToSave: Course) => {
    if (courseToSave.id) {
        setCourses(courses.map(c => c.id === courseToSave.id ? courseToSave : c));
    } else {
        const newCourse = { ...courseToSave, id: Date.now() };
        setCourses([...courses, newCourse]);
    }
    setSelectedCourse(null);
  };

  const handleDeleteCourse = (courseId: number) => {
      if (window.confirm('Are you sure you want to delete this course? This will also unenroll all students.')) {
        setCourses(courses.filter(c => c.id !== courseId));
        // Also remove enrollments associated with this course
        setEnrollments(enrollments.filter(e => e.courseId !== courseId));
      }
  };

  return (
    <div className="p-4 md:p-6">
        <div className="flex justify-end mb-4">
             <button onClick={() => setSelectedCourse({})} className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-semibold">
                Add New Course
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => {
                const enrolledCount = enrollments.filter(e => e.courseId === course.id).length;
                return (
                    <div key={course.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between transition-shadow hover:shadow-lg">
                        <div>
                            <div className="flex justify-between items-start">
                                 <h3 className="text-xl font-bold text-slate-800">{course.title}</h3>
                                 <span className="bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{course.department}</span>
                            </div>
                            <p className="text-slate-500 mt-2">Taught by: <span className="font-medium text-slate-600">{getTeacherName(course.teacherId)}</span></p>
                            <p className="text-sm text-slate-500 mt-1">Credits: <span className="font-bold text-slate-700">{course.credits}</span></p>
                            <p className="text-sm text-slate-500">Enrolled Students: <span className="font-bold text-slate-700">{enrolledCount}</span></p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2">
                             <button onClick={() => onTakeAttendance(course.id)} className="px-3 py-1.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm font-semibold">
                                Take Attendance
                            </button>
                            <button onClick={() => setEditingEnrollment(course)} className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-semibold">
                                Manage Enrollment
                            </button>
                            <div className="w-full border-t mt-2 pt-2 flex justify-end gap-2">
                                <button onClick={() => setSelectedCourse(course)} className="font-medium text-amber-600 hover:text-amber-800 text-sm">Edit</button>
                                <button onClick={() => handleDeleteCourse(course.id)} className="font-medium text-red-600 hover:text-red-800 text-sm">Delete</button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
        {editingEnrollment && (
            <EnrollmentModal 
                course={editingEnrollment}
                students={students}
                enrollments={enrollments}
                onClose={() => setEditingEnrollment(null)}
                onEnroll={handleEnroll}
                onUnenroll={handleUnenroll}
            />
        )}
        {selectedCourse && (
            <CourseModal
                course={selectedCourse}
                teachers={teachers}
                onClose={() => setSelectedCourse(null)}
                onSave={handleSaveCourse}
            />
        )}
    </div>
  );
};
