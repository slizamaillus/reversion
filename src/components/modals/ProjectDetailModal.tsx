import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  DollarSign, 
  Users, 
  Trash2, 
  Plus, 
  AlertTriangle, 
  Check, 
  FolderKanban, 
  ExternalLink,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { ProjectStatus, HealthStatus, Priority } from '../../types/crm';

export const ProjectDetailModal: React.FC = () => {
  const { 
    selectedProjectId, 
    setSelectedProjectId, 
    projects, 
    updateProject, 
    deleteProject, 
    tasks, 
    updateTask, 
    addTask,
    teamMembers,
    portfolios,
    profile
  } = useCRM();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingTask, setAddingTask] = useState(false);

  if (!selectedProjectId) return null;

  const project = projects.find(p => p.id === selectedProjectId);
  if (!project) return null;

  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const completedTasks = projectTasks.filter(t => t.completed || t.status === 'completado');

  const handleProgressChange = (newVal: number) => {
    updateProject(project.id, { progress: newVal });
  };

  const handleSyncProgressWithTasks = () => {
    if (projectTasks.length === 0) return;
    const computed = Math.round((completedTasks.length / projectTasks.length) * 100);
    updateProject(project.id, { progress: computed });
  };

  const handleCreateInlineTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle,
      projectId: project.id,
      projectName: project.name,
      assigneeId: profile.id,
      assigneeName: profile.name,
      assigneeAvatar: profile.avatar,
      status: 'por_hacer',
      priority: 'media',
      dueDate: project.targetDate,
      estimatedHours: 6,
      loggedHours: 0,
      completed: false,
      subtasks: [],
      tags: ['Sprint'],
    });
    setNewTaskTitle('');
    setAddingTask(false);
  };

  const handleDelete = () => {
    if (window.confirm(`¿Mover el proyecto "${project.name}" a la papelera?`)) {
      deleteProject(project.id);
      setSelectedProjectId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-zinc-200/80 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-zinc-100 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                {project.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                {project.portfolioName || 'Portafolio'}
              </span>
              <span className="text-xs text-zinc-400">Cliente: <strong className="text-zinc-700 font-semibold">{project.client}</strong></span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight leading-snug">
              {project.name}
            </h2>
          </div>

          <button
            onClick={() => setSelectedProjectId(null)}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Avance Controller Card */}
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                  Estado de Avance del Proyecto
                </span>
                <p className="text-sm font-semibold text-zinc-900 mt-0.5">
                  {project.progress === 100 ? 'Proyecto Finalizado' : `${project.progress}% completado del objetivo`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSyncProgressWithTasks}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition-colors flex items-center gap-1 shadow-2xs"
                  title="Calcular avance según las tareas finalizadas"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
                  Sincronizar con Tareas ({completedTasks.length}/{projectTasks.length})
                </button>
                <span className="text-2xl font-black font-mono text-zinc-900">
                  {project.progress}%
                </span>
              </div>
            </div>

            {/* Slider */}
            <div>
              <input
                type="range"
                min="0"
                max="100"
                value={project.progress}
                onChange={e => handleProgressChange(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
              />
              <div className="flex justify-between text-[11px] text-zinc-400 font-mono mt-1">
                <span>0% Planificación</span>
                <span>50% Desarrollo</span>
                <span>100% Entregado</span>
              </div>
            </div>

            {/* Controls Bar for Status, Health and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-200/60">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 block mb-1">Estado Operativo</label>
                <select
                  value={project.status}
                  onChange={e => updateProject(project.id, { status: e.target.value as ProjectStatus })}
                  className="w-full text-xs font-medium py-1.5 px-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-800 focus:outline-none focus:border-zinc-900"
                >
                  <option value="planificacion">Planificación</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="revision">En Revisión</option>
                  <option value="completado">Completado</option>
                  <option value="pausado">Pausado</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 block mb-1">Semáforo de Salud</label>
                <select
                  value={project.health}
                  onChange={e => updateProject(project.id, { health: e.target.value as HealthStatus })}
                  className="w-full text-xs font-medium py-1.5 px-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-800 focus:outline-none focus:border-zinc-900"
                >
                  <option value="saludable">🟢 Saludable (A tiempo)</option>
                  <option value="atencion">🟡 Requiere Atención</option>
                  <option value="critico">🔴 Crítico / Riesgo</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 block mb-1">Prioridad</label>
                <select
                  value={project.priority}
                  onChange={e => updateProject(project.id, { priority: e.target.value as Priority })}
                  className="w-full text-xs font-medium py-1.5 px-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-800 focus:outline-none focus:border-zinc-900"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Descripción y Objetivos
            </h3>
            <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100">
              {project.description}
            </p>
          </div>

          {/* Metrics 3-Col: Budget, Dates, Team */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Presupuesto */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Presupuesto</span>
              </div>
              <div className="text-base font-extrabold font-mono text-zinc-900">
                ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
              </div>
              <div className="w-full bg-zinc-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.round((project.spent / (project.budget || 1)) * 100))}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-400 font-mono mt-1 block">
                {Math.round((project.spent / (project.budget || 1)) * 100)}% ejecutado
              </span>
            </div>

            {/* Cronograma Fechas */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Cronograma</span>
              </div>
              <div className="text-xs text-zinc-700 space-y-1">
                <div>Inicio: <span className="font-semibold text-zinc-900">{project.startDate}</span></div>
                <div>Límite: <span className="font-semibold text-zinc-900">{project.targetDate}</span></div>
              </div>
            </div>

            {/* Líder y Equipo */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Liderazgo</span>
              </div>
              <div className="flex items-center gap-2.5">
                <img 
                  src={project.leaderAvatar || profile.avatar} 
                  alt={project.leaderName} 
                  className="w-8 h-8 rounded-full bg-white border border-zinc-200"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-900 truncate">{project.leaderName || profile.name}</p>
                  <p className="text-[11px] text-zinc-400">Project Lead</p>
                </div>
              </div>
            </div>
          </div>

          {/* Checklist / Tareas de este proyecto */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Tareas y Entregables ({completedTasks.length}/{projectTasks.length})
              </h3>
              <button
                onClick={() => setAddingTask(true)}
                className="text-xs font-semibold text-zinc-900 hover:text-black flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir Tarea
              </button>
            </div>

            {addingTask && (
              <form onSubmit={handleCreateInlineTask} className="p-3 bg-zinc-100/70 rounded-2xl flex items-center gap-2">
                <input
                  type="text"
                  autoFocus
                  required
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="Nueva tarea para este proyecto..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-900"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold bg-zinc-900 text-white rounded-xl hover:bg-black"
                >
                  Añadir
                </button>
                <button
                  type="button"
                  onClick={() => setAddingTask(false)}
                  className="px-2 py-1.5 text-xs text-zinc-500 hover:text-zinc-800"
                >
                  Cancelar
                </button>
              </form>
            )}

            <div className="space-y-2">
              {projectTasks.length === 0 ? (
                <div className="p-4 text-center text-xs text-zinc-400 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                  No hay tareas registradas en este proyecto. Haz click en "+ Añadir Tarea".
                </div>
              ) : (
                projectTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-zinc-200/70 hover:border-zinc-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => updateTask(task.id, { completed: !task.completed })}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                          task.completed ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300 hover:border-zinc-500 bg-white'
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                      <span className={`text-xs font-medium truncate ${task.completed ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                        {task.dueDate}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        task.status === 'completado' ? 'bg-emerald-50 text-emerald-700' :
                        task.status === 'en_progreso' ? 'bg-indigo-50 text-indigo-700' :
                        'bg-zinc-100 text-zinc-600'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Mover a Papelera
          </button>

          <button
            onClick={() => setSelectedProjectId(null)}
            className="px-5 py-2 text-xs font-semibold bg-zinc-900 text-white hover:bg-black rounded-xl transition-all shadow-sm"
          >
            Listo y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
