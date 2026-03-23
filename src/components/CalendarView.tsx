import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task, Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarViewProps {
  tasks: Task[];
  categories: Category[];
  onToggleTask: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, categories, onToggleTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  // Padding for previous month
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Days of current month
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const getTasksForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.dueDate === dateStr);
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-900">
          {monthNames[month]} <span className="text-slate-400 font-medium">{year}</span>
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-600"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-xs font-bold text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
          >
            Hoje
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-600"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-100">
        {weekDays.map(day => (
          <div key={day} className="py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-[minmax(100px,auto)]">
        {days.map((day, idx) => {
          const dayTasks = day ? getTasksForDay(day) : [];
          const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

          return (
            <div 
              key={idx} 
              className={`p-2 border-r border-b border-slate-50 min-h-[100px] transition-colors ${
                day ? 'bg-white' : 'bg-slate-50/30'
              } ${idx % 7 === 6 ? 'border-r-0' : ''}`}
            >
              {day && (
                <>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}>
                      {day}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayTasks.map(task => {
                      const category = categories.find(c => c.id === task.categoryId);
                      const color = category?.color || '#94a3b8';
                      return (
                        <button
                          key={task.id}
                          onClick={() => onToggleTask(task.id)}
                          className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate transition-all border ${
                            task.completed 
                              ? 'bg-slate-50 text-slate-400 border-slate-100 line-through' 
                              : 'border-transparent hover:brightness-95'
                          }`}
                          style={{ 
                            backgroundColor: !task.completed ? `${color}15` : undefined,
                            color: !task.completed ? color : undefined,
                            borderColor: !task.completed ? `${color}30` : undefined
                          }}
                          title={task.title}
                        >
                          {task.title}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
