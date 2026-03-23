import React, { useState } from 'react';
import { Plus, Calendar, Tag, Bell } from 'lucide-react';
import { Category, Task } from '../types';

interface TaskFormProps {
  categories: Category[];
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt' | 'notified'>) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ categories, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [reminderTime, setReminderTime] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title,
      categoryId,
      dueDate,
      reminderTime: reminderTime || undefined,
    });

    setTitle('');
    setReminderTime('');
    setIsExpanded(false);
  };

  return (
    <div className="mb-8">
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 transition-all duration-200 focus-within:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="O que precisa ser feito hoje?"
              className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium placeholder:text-slate-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
            />
          </div>
          <button
            type="submit"
            disabled={!title.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 items-center animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Data</label>
              <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <Calendar size={16} />
                <input
                  type="date"
                  className="bg-transparent border-none p-0 text-sm focus:ring-0"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Categoria</label>
              <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <Tag size={16} />
                <select
                  className="bg-transparent border-none p-0 text-sm focus:ring-0 cursor-pointer"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Lembrete (Opcional)</label>
              <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <Bell size={16} />
                <input
                  type="datetime-local"
                  className="bg-transparent border-none p-0 text-sm focus:ring-0"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
            </div>
            
            <button 
              type="button"
              onClick={() => setIsExpanded(false)}
              className="ml-auto text-sm text-slate-400 hover:text-slate-600 self-end mb-2"
            >
              Cancelar
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
