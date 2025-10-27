
import React from 'react';
import { MenuIcon } from './icons';
import type { ViewType } from '../types';


interface HeaderProps {
  currentView: ViewType;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onMenuClick }) => {
  const title = currentView.charAt(0).toUpperCase() + currentView.slice(1);

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-20">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="md:hidden mr-4 p-2 rounded-md text-slate-600 hover:bg-slate-100">
            <MenuIcon className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-slate-600 font-medium hidden sm:block">Welcome, Admin!</span>
        <img className="w-10 h-10 rounded-full" src="https://picsum.photos/seed/admin/100" alt="Admin avatar" />
      </div>
    </header>
  );
};
