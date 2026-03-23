import React, { useState } from 'react';
import { Plus, X, Palette } from 'lucide-react';
import { Category } from '../types';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (name: string, color: string) => void;
  onDeleteCategory: (id: string) => void;
}

const PRESET_COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#64748b', // Slate
];

export const CategoryManager: React.FC<CategoryManagerProps> = ({ 
  categories, 
  onAddCategory, 
  onDeleteCategory 
}) => {
  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddCategory(newName.trim(), selectedColor);
    setNewName('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Categorias</h3>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <Plus size={14} /> Nova
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <div 
            key={cat.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium group transition-all"
            style={{ 
              backgroundColor: `${cat.color}10`, 
              color: cat.color,
              borderColor: `${cat.color}30`
            }}
          >
            <span>{cat.name}</span>
            {categories.length > 1 && (
              <button 
                onClick={() => onDeleteCategory(cat.id)}
                className="opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-opacity"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <input
              type="text"
              placeholder="Nome da categoria"
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
            
            <div className="flex items-center gap-2">
              <Palette size={14} className="text-slate-400" />
              <div className="flex flex-wrap gap-1.5">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-5 h-5 rounded-full border-2 transition-transform ${
                      selectedColor === color ? 'scale-110 border-slate-400' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-1">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Adicionar
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-2 text-slate-500 text-xs font-medium hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
