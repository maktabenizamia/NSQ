import React, { useState } from 'react';
import type { Event } from '../types';
import { CloseIcon } from './icons';

interface EventCalendarProps {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}

const EventModal: React.FC<{
    onClose: () => void;
    onSave: (event: Omit<Event, 'id'>) => void;
}> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<Event['type']>('Activity');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date) {
            // Basic validation
            return;
        }
        onSave({ title, date, type });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Add New Event</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600">Event Title</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600">Date</label>
                        <input 
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)} 
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600">Event Type</label>
                        <select 
                            value={type}
                            onChange={(e) => setType(e.target.value as Event['type'])}
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500"
                            required
                        >
                            <option value="Activity">Activity</option>
                            <option value="Exam">Exam</option>
                            <option value="Meeting">Meeting</option>
                            <option value="Holiday">Holiday</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">Add Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const EventCalendar: React.FC<EventCalendarProps> = ({ events, setEvents }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getEventTypeColor = (type: Event['type']) => {
    switch(type) {
      case 'Exam': return 'border-red-500 bg-red-50';
      case 'Activity': return 'border-green-500 bg-green-50';
      case 'Meeting': return 'border-blue-500 bg-blue-50';
      case 'Holiday': return 'border-purple-500 bg-purple-50';
      default: return 'border-slate-500 bg-slate-50';
    }
  }
  
  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
        id: Date.now(), // Simple unique ID generation
        ...eventData
    };
    setEvents(prevEvents => [...prevEvents, newEvent]);
    setIsModalOpen(false);
  };

  // Simple sort by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="p-4 md:p-6">
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">School Events Calendar</h2>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-semibold"
                >
                    Add New Event
                </button>
            </div>
            <div className="space-y-4">
                {sortedEvents.map(event => (
                    <div key={event.id} className={`p-4 rounded-lg border-l-4 ${getEventTypeColor(event.type)}`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-bold text-slate-800">{event.title}</p>
                                <p className="text-sm text-slate-500">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <span className="text-sm font-semibold">{event.type}</span>
                        </div>
                    </div>
                ))}
                 {sortedEvents.length === 0 && (
                    <p className="text-center py-8 text-slate-500">There are no events scheduled.</p>
                )}
            </div>
        </div>
        {isModalOpen && <EventModal onClose={() => setIsModalOpen(false)} onSave={handleSaveEvent} />}
    </div>
  );
};