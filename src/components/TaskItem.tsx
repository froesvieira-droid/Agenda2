import React from 'react';
import { CheckCircle2, Circle, Trash2, Calendar as CalendarIcon, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { Task, Category } from '../types';

interface TaskItemProps {
  task: Task;
  category?: Category;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, category, onToggle, onDelete }) => {
  const categoryColor = category?.color || '#94a3b8';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group flex items-center gap-4 p-4 bg-white rounded-2xl border transition-all duration-200 ${
        task.completed ? 'border-slate-100 opacity-60' : 'border-slate-200 hover:border-indigo-200 hover:shadow-sm'
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 transition-colors ${
          task.completed ? 'text-indigo-600' : 'text-slate-300 hover:text-indigo-400'
        }`}
      >
        {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
      </button>

      <div className="flex-1 min-w-0">
        <h3 className={`text-base font-medium truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
          {task.title}
        </h3>
        <div className="flex flex-wrap items-center gap-3 mt-1">
          {category && (
            <span 
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
              style={{ 
                backgroundColor: `${categoryColor}15`, 
                color: categoryColor,
                borderColor: `${categoryColor}30`
              }}
            >
              {category.name}
            </span>
          )}
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <CalendarIcon size={12} />
            <span>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
          </div>
          {task.reminderTime && (
            <div className="flex items-center gap-1 text-indigo-400 text-[11px] font-medium">
              <Bell size={12} />
              <span>{new Date(task.reminderTime).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
};
