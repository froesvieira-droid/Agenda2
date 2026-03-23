import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, ListChecks, CheckCircle, Circle, Search, Settings, Bell, BellOff } from 'lucide-react';
import { Task, FilterType, Category } from './types';
import { TaskForm } from './components/TaskForm';
import { TaskItem } from './components/TaskItem';
import { CategoryManager } from './components/CategoryManager';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Trabalho', color: '#6366f1' },
  { id: '2', name: 'Pessoal', color: '#10b981' },
  { id: '3', name: 'Saúde', color: '#ef4444' },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('agenda-tasks-v2');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('agenda-categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('agenda-tasks-v2', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('agenda-categories', JSON.stringify(categories));
  }, [categories]);

  // Notification Permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    setNotificationsEnabled(permission === 'granted');
  };

  // Reminder Checker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.reminderTime && !task.notified && !task.completed) {
          const reminderDate = new Date(task.reminderTime);
          if (now >= reminderDate) {
            // Trigger Notification
            if (notificationsEnabled) {
              new Notification('Lembrete de Tarefa', {
                body: task.title,
                icon: '/vite.svg'
              });
            } else {
              // Fallback alert if user hasn't enabled browser notifications
              console.log(`Lembrete: ${task.title}`);
            }
            
            // Mark as notified
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, notified: true } : t));
          }
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [tasks, notificationsEnabled]);

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'notified'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: Date.now(),
      notified: false,
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addCategory = (name: string, color: string) => {
    const newCat: Category = {
      id: crypto.randomUUID(),
      name,
      color
    };
    setCategories([...categories, newCat]);
  };

  const deleteCategory = (id: string) => {
    if (categories.length <= 1) return;
    setCategories(categories.filter(c => c.id !== id));
    // Reassign tasks to the first available category if their category was deleted
    const firstCatId = categories.find(c => c.id !== id)?.id || '';
    setTasks(tasks.map(t => t.categoryId === id ? { ...t, categoryId: firstCatId } : t));
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesFilter = 
          filter === 'all' ? true :
          filter === 'active' ? !task.completed :
          task.completed;
        
        const matchesCategory = categoryFilter === 'all' || task.categoryId === categoryFilter;
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesFilter && matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return b.createdAt - a.createdAt;
      });
  }, [tasks, filter, categoryFilter, searchQuery]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <ListChecks className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Agenda</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={requestNotificationPermission}
              className={`p-2 rounded-lg transition-colors ${notificationsEnabled ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}
              title={notificationsEnabled ? "Notificações ativadas" : "Ativar notificações"}
            >
              {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${showSettings ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              <Settings size={20} />
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-1">
                <CheckCircle size={16} className="text-emerald-500" />
                <span>{stats.completed}</span>
              </div>
              <div className="flex items-center gap-1">
                <Circle size={16} className="text-indigo-500" />
                <span>{stats.pending}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Olá! 👋</h2>
          <p className="text-slate-500 mt-1">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </p>
        </section>

        {/* Settings / Category Manager */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <CategoryManager 
                categories={categories}
                onAddCategory={addCategory}
                onDeleteCategory={deleteCategory}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task Form */}
        <TaskForm categories={categories} onAddTask={addTask} />

        {/* Filters and Search */}
        <section className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
              {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === f 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f === 'all' ? 'Todas' : f === 'active' ? 'Ativas' : 'Concluídas'}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar tarefas..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
                categoryFilter === 'all'
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              Todas Categorias
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-all whitespace-nowrap`}
                style={{
                  backgroundColor: categoryFilter === cat.id ? cat.color : 'white',
                  color: categoryFilter === cat.id ? 'white' : cat.color,
                  borderColor: categoryFilter === cat.id ? cat.color : `${cat.color}30`
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Task List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  category={categories.find(c => c.id === task.categoryId)}
                  onToggle={toggleTask} 
                  onDelete={deleteTask} 
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200"
              >
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LayoutGrid className="text-slate-300" size={32} />
                </div>
                <h3 className="text-slate-900 font-medium">Nenhuma tarefa encontrada</h3>
                <p className="text-slate-500 text-sm mt-1">
                  {searchQuery ? 'Tente mudar sua busca.' : 'Comece adicionando uma nova tarefa acima!'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer / Quick Stats */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 py-3 px-4 sm:hidden">
        <div className="max-w-3xl mx-auto flex justify-around items-center">
           <div className="flex flex-col items-center gap-1">
             <span className="text-xs font-bold text-slate-900">{stats.total}</span>
             <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Total</span>
           </div>
           <div className="flex flex-col items-center gap-1">
             <span className="text-xs font-bold text-emerald-600">{stats.completed}</span>
             <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Feitas</span>
           </div>
           <div className="flex flex-col items-center gap-1">
             <span className="text-xs font-bold text-indigo-600">{stats.pending}</span>
             <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Pendentes</span>
           </div>
        </div>
      </footer>
    </div>
  );
}
