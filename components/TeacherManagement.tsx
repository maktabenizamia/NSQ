
import React, { useState } from 'react';
import type { Teacher } from '../types';
import { CloseIcon } from './icons';

interface TeacherManagementProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
}

const TeacherModal: React.FC<{
    teacher: Partial<Teacher> | null;
    onClose: () => void;
    onSave: (teacher: Teacher) => void;
}> = ({ teacher, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Teacher>>(teacher || {});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'experience' ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Teacher);
    };

    if (!teacher) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{teacher.id ? 'Edit Teacher' : 'Add Teacher'}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600">Name</label>
                        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600">Subject</label>
                        <input type="text" name="subject" value={formData.subject || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-600">Email</label>
                        <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-600">Experience (Years)</label>
                        <input type="number" name="experience" value={formData.experience || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" required />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const TeacherManagement: React.FC<TeacherManagementProps> = ({ teachers, setTeachers }) => {
  const [selectedTeacher, setSelectedTeacher] = useState<Partial<Teacher> | null>(null);

  const handleSave = (teacherToSave: Teacher) => {
    if (teacherToSave.id) {
      setTeachers(teachers.map(t => t.id === teacherToSave.id ? teacherToSave : t));
    } else {
      const newTeacher = { ...teacherToSave, id: Date.now(), avatar: `https://picsum.photos/seed/${Date.now()}/100` };
      setTeachers([...teachers, newTeacher]);
    }
    setSelectedTeacher(null);
  };
  
  const handleDelete = (teacherId: number) => {
      if(window.confirm('Are you sure you want to delete this teacher?')) {
        setTeachers(teachers.filter(t => t.id !== teacherId));
      }
  };

  return (
    <div className="p-4 md:p-6">
        <div className="flex justify-end mb-4">
            <button onClick={() => setSelectedTeacher({})} className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-semibold">
                Add Teacher
            </button>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Subject</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Experience</th>
                        <th scope="col" className="px-6 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map(teacher => (
                        <tr key={teacher.id} className="bg-white border-b hover:bg-slate-50">
                            <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap flex items-center">
                                <img className="w-10 h-10 rounded-full mr-3" src={teacher.avatar} alt={`${teacher.name} avatar`} />
                                {teacher.name}
                            </th>
                            <td className="px-6 py-4">{teacher.subject}</td>
                            <td className="px-6 py-4">{teacher.email}</td>
                            <td className="px-6 py-4">{teacher.experience} years</td>
                            <td className="px-6 py-4 text-center space-x-2">
                                <button onClick={() => setSelectedTeacher(teacher)} className="font-medium text-amber-600 hover:text-amber-800">Edit</button>
                                <button onClick={() => handleDelete(teacher.id)} className="font-medium text-red-600 hover:text-red-800">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {selectedTeacher && <TeacherModal teacher={selectedTeacher} onClose={() => setSelectedTeacher(null)} onSave={handleSave} />}
    </div>
  );
};
