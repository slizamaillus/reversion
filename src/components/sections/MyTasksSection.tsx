import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  Clock, 
  Check, 
  Trash2, 
  Filter, 
  Play, 
  Pause,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Task, Priority, KanbanColumn } from '../../types/crm';

export const MyTasksSection: React.FC = () => {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleSubtask, 
    profile, 
    projects,
    teamMembers,
    setSelectedProjectId
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'pendientes' | 'hoy' | 'completadas' | 'todas'>('pendientes');
  const [filterAssignee, setFilterAssignee] = useState<string>(profile.id);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickProject, setQuickProject] = useState(projects[0]?.id || '');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  // Filter logic
  const filteredTasks = tasks.filter(t => {
    const matchesAssignee = filterAssignee === 'all' || t.assigneeId === filterAssignee;
    if (!matchesAssignee) return false;

    if (activeTab === 'completadas') return t.completed || t.status === 'completado';
    if (activeTab === 'pendientes') return !t.completed && t.status !== 'completado';
    if (activeTab === 'hoy') return !t.completed && (t.priority === 'urgente' || t.priority === 'alta');
    return true;
  });

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const proj = projects.find(p => p.id === quickProject);
    const assignee = teamMembers.find(m => m.id === filterAssignee) || teamMembers.find(m => m.id === profile.id);

    addTask({
      title: quickTitle,
      projectId: quickProject || projects[0]?.id || 'proj-1',
      projectName: proj?.name || 'Proyecto Principal',
      assigneeId: assignee?.id || profile.id,
      assigneeName: assignee?.name || profile.name,
      assigneeAvatar: assignee?.avatar || profile.avatar,
      status: 'por_hacer',
      priority: 'media',
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      estimatedHours: 4,
      loggedHours: 0,
      completed: false,
      subtasks: [
        { id: `sub-${Date.now()}-1`, title: 'Revisión y checklist inicial', completed: false }
      ],
      tags: ['Prioridad'],
    });

    setQuickTitle('');
  };

  const handleIncrementTime = (task: Task) => {
    updateTask(task.id, { loggedHours: (task.loggedHours || 0) + 1 });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Mis Tareas & Entregables
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Gestión individual de prioridades, registro de tiempo y sub-tareas.
          </p>
        </div>

        {/* Member selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-400">Ver tareas de:</span>
          <select
            value={filterAssignee}
            onChange={e => setFilterAssignee(e.target.value)}
            className="text-xs font-semibold py-2 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800 focus:outline-none"
          >
            <option value={profile.id}>Mis tareas ({profile.name.split(' ')[0]})</option>
            <option value="all">Todo el equipo</option>
            {teamMembers.filter(m => m.id !== profile.id).map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs and Quick Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200/80">
        <div className="flex items-center p-1 bg-zinc-100 rounded-xl">
          <button
            onClick={() => setActiveTab('pendientes')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'pendientes' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setActiveTab('hoy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'hoy' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Prioridad Hoy
          </button>
          <button
            onClick={() => setActiveTab('completadas')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'completadas' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Completadas
          </button>
          <button
            onClick={() => setActiveTab('todas')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'todas' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Todas ({tasks.length})
          </button>
        </div>

        <span className="text-xs font-mono font-medium text-zinc-400">
          Mostrando {filteredTasks.length} tareas
        </span>
      </div>

      {/* Quick Add Bar */}
      <form onSubmit={handleQuickAdd} className="flex flex-col sm:flex-row items-center gap-2 bg-white p-3 rounded-2xl border border-zinc-200/80 shadow-2xs">
        <input
          type="text"
          value={quickTitle}
          onChange={e => setQuickTitle(e.target.value)}
          placeholder="+ Añadir tarea rápida..."
          className="flex-1 px-3.5 py-2 text-xs bg-zinc-50 rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-900 text-zinc-900"
        />

        <select
          value={quickProject}
          onChange={e => setQuickProject(e.target.value)}
          className="text-xs py-2 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 focus:outline-none max-w-[200px] truncate"
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <button
          type="submit"
          className="px-4 py-2 text-xs font-bold bg-zinc-900 text-white rounded-xl hover:bg-black transition-all shrink-0 active:scale-[0.98]"
        >
          Añadir Tarea
        </button>
      </form>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map(task => {
          const isExpanded = expandedTask === task.id;
          const completedSub = task.subtasks.filter(s => s.completed).length;

          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl bg-white border transition-all ${
                task.completed ? 'border-zinc-200/60 bg-zinc-50/50 opacity-80' : 'border-zinc-200/80 hover:border-zinc-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Checkbox and Title */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => updateTask(task.id, { completed: !task.completed })}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                      task.completed ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300 hover:border-zinc-500 bg-white'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="min-w-0">
                    <p className={`text-xs font-semibold leading-snug truncate ${task.completed ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                      <span 
                        onClick={() => setSelectedProjectId(task.projectId)}
                        className="hover:underline cursor-pointer font-medium text-zinc-600 truncate max-w-[140px]"
                      >
                        {task.projectName}
                      </span>
                      <span>·</span>
                      <span className="font-mono">{task.dueDate}</span>
                    </div>
                  </div>
                </div>

                {/* Right controls: time counter, priority, subtasks, delete */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Time tracking button */}
                  <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1 rounded-xl border border-zinc-200/60 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{task.loggedHours || 0}h / {task.estimatedHours}h</span>
                    <button
                      onClick={() => handleIncrementTime(task)}
                      className="text-[10px] font-bold text-zinc-700 hover:text-black px-1 rounded hover:bg-zinc-200"
                      title="Registrar +1 hora"
                    >
                      +1h
                    </button>
                  </div>

                  {/* Priority Badge */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    task.priority === 'urgente' ? 'bg-rose-50 text-rose-700' :
                    task.priority === 'alta' ? 'bg-amber-50 text-amber-700' :
                    'bg-zinc-100 text-zinc-600'
                  }`}>
                    {task.priority}
                  </span>

                  {/* Subtasks toggle */}
                  {task.subtasks.length > 0 && (
                    <button
                      onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                      className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-50"
                    >
                      <span>{completedSub}/{task.subtasks.length}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 rounded-lg text-zinc-300 hover:text-rose-600 transition-colors"
                    title="Mover a papelera"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subtasks Accordion */}
              {isExpanded && task.subtasks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-zinc-100 pl-8 space-y-2 bg-zinc-50/50 p-3 rounded-xl">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Lista de verificación
                  </div>
                  {task.subtasks.map(sub => (
                    <div key={sub.id} className="flex items-center gap-2.5 text-xs">
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => toggleSubtask(task.id, sub.id)}
                        className="w-3.5 h-3.5 rounded text-zinc-900 accent-zinc-900 cursor-pointer"
                      />
                      <span className={sub.completed ? 'line-through text-zinc-400' : 'text-zinc-700 font-medium'}>
                        {sub.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="py-16 text-center text-zinc-400 text-xs bg-white rounded-3xl border border-dashed border-zinc-200">
            No hay tareas en esta vista. ¡Buen trabajo!
          </div>
        )}
      </div>
    </div>
  );
};
