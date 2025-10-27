import React from 'react';
import type { ViewType } from '../types';
import { DashboardIcon, StudentsIcon, TeachersIcon, CoursesIcon, EventsIcon, SchoolIcon, CloseIcon, AttendanceIcon } from './icons';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 rounded-lg text-slate-100 hover:bg-sky-600 transition-colors duration-200 ${isActive ? 'bg-sky-700 font-semibold' : ''}`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </a>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setIsOpen }) => {
  const handleSetView = (view: ViewType) => {
    setView(view);
    if (window.innerWidth < 768) { // md breakpoint
      setIsOpen(false);
    }
  };
    
  return (
    <>
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-sky-800 text-white transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-lg`}>
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center justify-between p-2 mb-6">
            <a href="#" onClick={() => handleSetView('dashboard')} className="flex items-center">
                <SchoolIcon className="w-8 h-8 mr-2 text-white" />
                <span className="self-center text-xl font-semibold whitespace-nowrap">Zenith School</span>
            </a>
            <button onClick={() => setIsOpen(false)} className="md:hidden p-1 rounded-md hover:bg-sky-700">
                <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <ul className="space-y-2 font-medium">
            <NavItem
              icon={<DashboardIcon className="w-6 h-6" />}
              label="Dashboard"
              isActive={currentView === 'dashboard'}
              onClick={() => handleSetView('dashboard')}
            />
            <NavItem
              icon={<StudentsIcon className="w-6 h-6" />}
              label="Students"
              isActive={currentView === 'students'}
              onClick={() => handleSetView('students')}
            />
            <NavItem
              icon={<TeachersIcon className="w-6 h-6" />}
              label="Teachers"
              isActive={currentView === 'teachers'}
              onClick={() => handleSetView('teachers')}
            />
            <NavItem
              icon={<CoursesIcon className="w-6 h-6" />}
              label="Courses"
              isActive={currentView === 'courses'}
              onClick={() => handleSetView('courses')}
            />
            <NavItem
              icon={<AttendanceIcon className="w-6 h-6" />}
              label="Attendance"
              isActive={currentView === 'attendance'}
              onClick={() => handleSetView('attendance')}
            />
            <NavItem
              icon={<EventsIcon className="w-6 h-6" />}
              label="Events"
              isActive={currentView === 'events'}
              onClick={() => handleSetView('events')}
            />
          </ul>
        </div>
      </aside>
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 z-30 md:hidden"></div>}
    </>
  );
};