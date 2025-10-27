
import React, { useState, useMemo } from 'react';
import type { Student, Course, Enrollment } from '../types';
import { generateStudentReport } from '../services/geminiService';
import { SparklesIcon, CloseIcon } from './icons';

interface StudentManagementProps {
  students: Student[];
  // FIX: Correctly type the setStudents prop to match the state in App.tsx.
  setStudents: React.Dispatch<React.SetStateAction<Omit<Student, 'attendance'>[]>>;
  courses: Course[];
  enrollments: Enrollment[];
}

const StudentModal: React.FC<{
    student: Partial<Student> | null;
    onClose: () => void;
    onSave: (student: Student) => void;
    courses: Course[];
    enrollments: Enrollment[];
}> = ({ student, onClose, onSave, courses, enrollments }) => {
    const [formData, setFormData] = useState<Partial<Student>>(student || {});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'age' || name === 'grade' || name === 'attendance' ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Student);
    };

    if (!student) return null;
    
    const isNewStudent = !student.id;
    const enrolledCourses = student.id
        ? enrollments
            .filter(e => e.studentId === student.id)
            .map(e => courses.find(c => c.id === e.courseId)?.title)
            .filter(Boolean)
        : [];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{isNewStudent ? 'Student Admission Form' : 'Edit Student'}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Personal Details</h3>
                    <div>
                        <label className="block text-sm font-medium text-slate-600">Full Name</label>
                        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-600">Address</label>
                        <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Emergency Contact Name</label>
                            <input type="text" name="emergencyContactName" value={formData.emergencyContactName || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Emergency Contact Phone</label>
                            <input type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" required />
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 pt-4">Academic Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Age</label>
                            <input type="number" name="age" value={formData.age || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Grade</label>
                            <input type="number" name="grade" value={formData.grade || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600">Performance</label>
                        <select name="performance" value={formData.performance || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" required>
                            <option value="">Select Performance</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Average">Average</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </div>

                    {!isNewStudent && (
                         <div className="pt-4">
                            <h3 className="text-lg font-medium text-slate-700 mb-2">Enrolled Courses</h3>
                            {enrolledCourses.length > 0 ? (
                                <ul className="space-y-2 bg-slate-50 p-3 rounded-md">
                                    {enrolledCourses.map(courseTitle => (
                                        <li key={courseTitle} className="text-sm text-slate-600">{courseTitle}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-md">Not enrolled in any courses.</p>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">Save Student</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ReportModal: React.FC<{
    report: string;
    studentName: string;
    onClose: () => void;
    isLoading: boolean;
}> = ({ report, studentName, onClose, isLoading }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg m-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800">Report for {studentName}</h2>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="bg-slate-50 p-4 rounded-md min-h-[200px] whitespace-pre-wrap font-mono text-sm">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-slate-500 animate-pulse">Generating report...</p>
                    </div>
                ) : report}
            </div>
             <div className="flex justify-end pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">Close</button>
            </div>
        </div>
    </div>
);

export const StudentManagement: React.FC<StudentManagementProps> = ({ students, setStudents, courses, enrollments }) => {
  const [selectedStudent, setSelectedStudent] = useState<Partial<Student> | null>(null);
  const [report, setReport] = useState<{ content: string; studentName: string; isLoading: boolean } | null>(null);
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const handleSave = (studentToSave: Student) => {
    // FIX: Use functional updates for setStudents and ensure the object saved to state
    // does not contain the 'attendance' property, matching the state type in App.tsx.
    const { attendance, ...studentData } = studentToSave;
    if (studentToSave.id) {
      setStudents(prevStudents =>
        prevStudents.map(s => (s.id === studentToSave.id ? studentData : s))
      );
    } else {
      const newStudent = { ...studentData, id: Date.now(), avatar: `https://picsum.photos/seed/${Date.now()}/100`, class: 'A' };
      setStudents(prevStudents => [...prevStudents, newStudent]);
    }
    setSelectedStudent(null);
  };

  const handleDelete = (studentId: number) => {
    // FIX: Use functional update for setStudents to avoid using stale derived data.
    if(window.confirm('Are you sure you want to delete this student?')) {
      setStudents(prevStudents => prevStudents.filter(s => s.id !== studentId));
    }
  };
  
  const handleGenerateReport = async (student: Student) => {
    setReport({ content: '', studentName: student.name, isLoading: true });
    const generatedReport = await generateStudentReport(student);
    setReport({ content: generatedReport, studentName: student.name, isLoading: false });
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Average': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const uniqueGrades = useMemo(() => {
    // FIX: Filter out null/undefined/NaN grades before sorting to prevent type errors.
    // The previous implementation had a type inference issue. Using `reduce`
    // with a strongly-typed Set accumulator ensures only valid numbers are
    // collected, making the sorting operation type-safe.
    const grades = students.reduce((acc, s) => {
      if (typeof s.grade === 'number' && !isNaN(s.grade)) {
        acc.add(s.grade);
      }
      return acc;
    }, new Set<number>());

    return [...grades].sort((a, b) => a - b);
  }, [students]);

  const filteredAndSortedStudents = useMemo(() => {
    const performanceOrder: Record<Student['performance'], number> = { 'Excellent': 4, 'Good': 3, 'Average': 2, 'Poor': 1 };

    return [...students]
      .filter(student => {
        if (filterGrade === 'all') return true;
        return student.grade === parseInt(filterGrade, 10);
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'attendance':
            return b.attendance - a.attendance;
          case 'performance':
            return performanceOrder[b.performance] - performanceOrder[a.performance];
          case 'name':
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [students, filterGrade, sortBy]);

  return (
    <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
             <div className="flex items-center gap-4 w-full sm:w-auto">
                 <div>
                    <label htmlFor="grade-filter" className="sr-only">Filter by Grade</label>
                    <select
                        id="grade-filter"
                        value={filterGrade}
                        onChange={(e) => setFilterGrade(e.target.value)}
                        className="block w-full sm:w-auto border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                    >
                        <option value="all">All Grades</option>
                        {uniqueGrades.map(grade => (
                            <option key={grade} value={grade}>Grade {grade}</option>
                        ))}
                    </select>
                </div>
                <div>
                     <label htmlFor="sort-by" className="sr-only">Sort by</label>
                    <select
                        id="sort-by"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="block w-full sm:w-auto border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                    >
                        <option value="name">Sort by Name (A-Z)</option>
                        <option value="attendance">Sort by Attendance (High-Low)</option>
                        <option value="performance">Sort by Performance (Best-Worst)</option>
                    </select>
                </div>
            </div>
            <button onClick={() => setSelectedStudent({})} className="w-full sm:w-auto px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-semibold">
                Add New Student
            </button>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Grade</th>
                        <th scope="col" className="px-6 py-3">Attendance</th>
                        <th scope="col" className="px-6 py-3">Performance</th>
                        <th scope="col" className="px-6 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAndSortedStudents.map(student => (
                        <tr key={student.id} className="bg-white border-b hover:bg-slate-50">
                            <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap flex items-center">
                                <img className="w-10 h-10 rounded-full mr-3" src={student.avatar} alt={`${student.name} avatar`} />
                                {student.name}
                            </th>
                            <td className="px-6 py-4">{student.grade}</td>
                            <td className="px-6 py-4">{student.attendance}%</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${getPerformanceColor(student.performance)}`}>
                                    {student.performance}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center space-x-2">
                                <button onClick={() => handleGenerateReport(student)} className="font-medium text-indigo-600 hover:text-indigo-800 inline-flex items-center">
                                    <SparklesIcon className="w-4 h-4 mr-1"/> Report
                                </button>
                                <button onClick={() => setSelectedStudent(student)} className="font-medium text-amber-600 hover:text-amber-800">Edit</button>
                                <button onClick={() => handleDelete(student.id)} className="font-medium text-red-600 hover:text-red-800">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {selectedStudent && <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} onSave={handleSave} courses={courses} enrollments={enrollments} />}
        {report && <ReportModal report={report.content} studentName={report.studentName} onClose={() => setReport(null)} isLoading={report.isLoading} />}
    </div>
  );
};
