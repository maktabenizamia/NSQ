import React, { useState, useMemo, useEffect } from 'react';
import type { Student, Course, Enrollment, AttendanceRecord } from '../types';

interface AttendanceManagementProps {
    students: Student[];
    courses: Course[];
    enrollments: Enrollment[];
    attendanceRecords: AttendanceRecord[];
    setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
    initialContext: { courseId: number } | null;
}

const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
}

export const AttendanceManagement: React.FC<AttendanceManagementProps> = ({ students, courses, enrollments, attendanceRecords, setAttendanceRecords, initialContext }) => {
    const [selectedCourseId, setSelectedCourseId] = useState<string>(initialContext?.courseId.toString() || '');
    const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));

    useEffect(() => {
        if(initialContext?.courseId) {
            setSelectedCourseId(initialContext.courseId.toString());
        }
    }, [initialContext]);

    const studentsInCourse = useMemo(() => {
        if (!selectedCourseId) return [];
        const courseIdNum = parseInt(selectedCourseId, 10);
        const studentIds = enrollments
            .filter(e => e.courseId === courseIdNum)
            .map(e => e.studentId);
        
        return students.filter(s => studentIds.includes(s.id));
    }, [selectedCourseId, enrollments, students]);

    const handleMarkAttendance = (studentId: number, status: AttendanceRecord['status']) => {
        if (!selectedCourseId) return;
        const courseId = parseInt(selectedCourseId, 10);
        
        // Find if a record already exists for this specific student, course, and date.
        const existingRecordIndex = attendanceRecords.findIndex(
            r => r.studentId === studentId && r.courseId === courseId && r.date === selectedDate
        );

        if (existingRecordIndex > -1) {
            // If a record exists, update its status.
            const updatedRecords = [...attendanceRecords];
            updatedRecords[existingRecordIndex].status = status;
            setAttendanceRecords(updatedRecords);
        } else {
            // Otherwise, create a new record, ensuring it's associated with the correct student ID.
            setAttendanceRecords([...attendanceRecords, { studentId, courseId, date: selectedDate, status }]);
        }
    };

    const getStudentStatus = (studentId: number): AttendanceRecord['status'] | null => {
        if (!selectedCourseId) return null;
        const courseId = parseInt(selectedCourseId, 10);
        const record = attendanceRecords.find(r => 
            r.studentId === studentId && r.courseId === courseId && r.date === selectedDate
        );
        return record ? record.status : null;
    };

    const getStatusButtonStyle = (status: AttendanceRecord['status'], studentStatus: AttendanceRecord['status'] | null) => {
        const baseStyle = 'px-3 py-1 text-xs font-semibold rounded-full transition-colors';
        if (status === studentStatus) {
            switch(status) {
                case 'Present': return `${baseStyle} bg-green-500 text-white`;
                case 'Absent': return `${baseStyle} bg-red-500 text-white`;
                case 'Late': return `${baseStyle} bg-yellow-500 text-white`;
            }
        }
        return `${baseStyle} bg-slate-200 text-slate-700 hover:bg-slate-300`;
    }

    return (
        <div className="p-4 md:p-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Take Attendance</h2>
                
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div>
                        <label htmlFor="course-select" className="block text-sm font-medium text-slate-600 mb-1">Course</label>
                        <select
                            id="course-select"
                            value={selectedCourseId}
                            onChange={e => setSelectedCourseId(e.target.value)}
                            className="block w-full sm:w-64 border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500"
                        >
                            <option value="">Select a course</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date-select" className="block text-sm font-medium text-slate-600 mb-1">Date</label>
                        <input
                            type="date"
                            id="date-select"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            className="block w-full sm:w-auto border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                    </div>
                </div>

                {/* Student List */}
                <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Student Name</th>
                                <th scope="col" className="px-6 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCourseId ? (
                                studentsInCourse.length > 0 ? (
                                    studentsInCourse.map(student => {
                                        const status = getStudentStatus(student.id);
                                        return (
                                            <tr key={student.id} className="bg-white border-b hover:bg-slate-50">
                                                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap flex items-center">
                                                    <img className="w-10 h-10 rounded-full mr-3" src={student.avatar} alt={`${student.name} avatar`} />
                                                    {student.name}
                                                </th>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <button className={getStatusButtonStyle('Present', status)} onClick={() => handleMarkAttendance(student.id, 'Present')}>Present</button>
                                                        <button className={getStatusButtonStyle('Absent', status)} onClick={() => handleMarkAttendance(student.id, 'Absent')}>Absent</button>
                                                        <button className={getStatusButtonStyle('Late', status)} onClick={() => handleMarkAttendance(student.id, 'Late')}>Late</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="text-center py-8 text-slate-500">No students enrolled in this course.</td>
                                    </tr>
                                )
                            ) : (
                                <tr>
                                    <td colSpan={2} className="text-center py-8 text-slate-500">Please select a course to view students.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};