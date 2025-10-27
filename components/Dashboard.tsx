
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Student, Teacher, Course, Event } from '../types';
import { StudentsIcon, TeachersIcon, CoursesIcon, EventsIcon } from './icons';

interface DashboardProps {
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  events: Event[];
}

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: number | string, color: string }> = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ students, teachers, courses, events }) => {
  const performanceData = [
    { name: 'Excellent', count: students.filter(s => s.performance === 'Excellent').length },
    { name: 'Good', count: students.filter(s => s.performance === 'Good').length },
    { name: 'Average', count: students.filter(s => s.performance === 'Average').length },
    { name: 'Poor', count: students.filter(s => s.performance === 'Poor').length },
  ];
  
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).slice(0, 5);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<StudentsIcon className="w-6 h-6 text-white" />} title="Total Students" value={students.length} color="bg-sky-500" />
        <StatCard icon={<TeachersIcon className="w-6 h-6 text-white" />} title="Total Teachers" value={teachers.length} color="bg-emerald-500" />
        <StatCard icon={<CoursesIcon className="w-6 h-6 text-white" />} title="Total Courses" value={courses.length} color="bg-amber-500" />
        <StatCard icon={<EventsIcon className="w-6 h-6 text-white" />} title="Upcoming Events" value={upcomingEvents.length} color="bg-indigo-500" />
      </div>

      {/* Charts and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Student Performance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#38bdf8" name="Number of Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Upcoming Events</h3>
          <ul className="space-y-4">
            {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
              <li key={event.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-lg">
                  <EventsIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-700">{event.title}</p>
                  <p className="text-sm text-slate-500">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </li>
            ))
            ) : (
                <p className="text-slate-500">No upcoming events.</p>
            )
            }
          </ul>
        </div>
      </div>
    </div>
  );
};
