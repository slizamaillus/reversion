import React from 'react';
import { 
  Briefcase, 
  CheckSquare, 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  SlidersHorizontal, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  FolderKanban,
  StickyNote
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Project, Task, KanbanColumn } from '../../types/crm';

export const DashboardSection: React.FC = () => {
  const { 
    projects, 
    portfolios, 
    tasks, 
    teamMembers, 
    notes, 
    notifications, 
    widgets, 
    setEditWidgetsOpen, 
    setSelectedProjectId, 
    setActiveSection, 
    setCreateModalOpen, 
    setCreateModalType,
    updateTask,
    updateProject
  } = useCRM();

  // Metrics calculations
  const totalProjects = projects.length;
  const avgProgress = totalProjects > 0 
    ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects) 
    : 0;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed || t.status === 'completado').length;
  const pendingTasks = totalTasks - completedTasks;

  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const budgetExecution = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const criticalProjects = projects.filter(p => p.health === 'critico' || p.health === 'atencion');
  const pinnedNotes = notes.filter(n => n.pinned);

  // Widget visibility helper
  const isVisible = (id: string) => widgets.find(w => w.id === id)?.visible ?? true;

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Centro de Comando
            </span>
            <span className="text-xs text-zinc-400">Actualizado al instante</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Resumen General de Operaciones
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Monitoreo en tiempo real de avance, presupuesto, equipos y cumplimiento de hitos.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setEditWidgetsOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Personalizar
          </button>
          <button
            onClick={() => {
              setCreateModalType('proyecto');
              setCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white hover:bg-black transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Nuevo Proyecto
          </button>
        </div>
      </div>

      {/* WIDGET 1: Métricas Generales / KPIs */}
      {isVisible('w-kpis') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Avance Ponderado */}
          <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Avance Promedio</span>
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold font-mono text-zinc-900">{avgProgress}%</div>
              <div className="w-full bg-zinc-100 h-2 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-sky-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${avgProgress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-zinc-400 mt-2">
                <span>{totalProjects} proyectos activos</span>
                <span className="text-sky-600 font-semibold">Salud óptima</span>
              </div>
            </div>
          </div>

          {/* Card 2: Tareas Completadas */}
          <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Entregables & Tareas</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold font-mono text-zinc-900">
                {completedTasks} <span className="text-base font-normal text-zinc-400">/ {totalTasks}</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-zinc-400 mt-2">
                <span>{pendingTasks} tareas pendientes</span>
                <span className="text-emerald-600 font-semibold font-mono">
                  {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Presupuesto Ejecutado */}
          <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Presupuesto Global</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold font-mono text-zinc-900">
                ${totalSpent.toLocaleString()}
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-purple-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, budgetExecution)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-zinc-400 mt-2">
                <span>Meta: ${totalBudget.toLocaleString()}</span>
                <span className="text-purple-600 font-semibold font-mono">{budgetExecution}%</span>
              </div>
            </div>
          </div>

          {/* Card 4: Capacidad del Equipo */}
          <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Equipo Activo</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold font-mono text-zinc-900">
                {teamMembers.length} <span className="text-sm font-normal text-zinc-400">integrantes</span>
              </div>
              <div className="flex items-center -space-x-2 mt-3 overflow-hidden py-0.5">
                {teamMembers.slice(0, 5).map(m => (
                  <img 
                    key={m.id} 
                    src={m.avatar} 
                    alt={m.name} 
                    title={`${m.name} (${m.role})`}
                    className="w-7 h-7 rounded-full border-2 border-white bg-zinc-100" 
                  />
                ))}
              </div>
              <div className="flex justify-between items-center text-[11px] text-zinc-400 mt-2">
                <span>6 asignados a proyectos</span>
                <button 
                  onClick={() => setActiveSection('carga_trabajo')}
                  className="text-amber-700 font-semibold hover:underline"
                >
                  Ver Cargas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: 2 Columns (Portafolios + Proyectos Críticos) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* WIDGET 2: Portafolios Estratégicos (2 cols on lg) */}
        {isVisible('w-portfolios') && (
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900">Avance por Portafolio Estratégico</h3>
                <p className="text-xs text-zinc-400">Progreso acumulado y proyectos vinculados</p>
              </div>
              <button
                onClick={() => setActiveSection('portafolios')}
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
              >
                Ver Portafolios <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {portfolios.map(port => {
                const portProjects = projects.filter(p => p.portfolioId === port.id);
                const portAvg = portProjects.length > 0 
                  ? Math.round(portProjects.reduce((acc, p) => acc + p.progress, 0) / portProjects.length)
                  : 0;

                return (
                  <div
                    key={port.id}
                    onClick={() => setActiveSection('portafolios')}
                    className="p-4 rounded-2xl bg-zinc-50/70 border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div 
                          className="w-3 h-3 rounded-full shrink-0" 
                          style={{ backgroundColor: port.color || '#E0E7FF' }} 
                        />
                        <span className="text-xs font-bold text-zinc-900 truncate">{port.name}</span>
                        <span className="text-[11px] text-zinc-400 hidden sm:inline truncate">
                          ({portProjects.length} proyectos)
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          port.health === 'saludable' ? 'bg-emerald-50 text-emerald-700' :
                          port.health === 'atencion' ? 'bg-amber-50 text-amber-700' :
                          'bg-rose-50 text-rose-700'
                        }`}>
                          {port.health}
                        </span>
                        <span className="text-xs font-bold font-mono text-zinc-900">{portAvg}%</span>
                      </div>
                    </div>

                    <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 bg-zinc-900" 
                        style={{ width: `${portAvg}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono mt-2">
                      <span>Presupuesto: ${port.spentBudget.toLocaleString()} / ${port.targetBudget.toLocaleString()}</span>
                      <span>Líder: {port.ownerName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WIDGET 3: Proyectos Críticos & Requieren Atención */}
        {isVisible('w-projects-urgent') && (
          <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-bold text-zinc-900">Atención Requerida</h3>
              </div>
              <span className="text-[11px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                {criticalProjects.length} proyectos
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {criticalProjects.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-400 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                  ¡Excelente! Todos los proyectos están en estado saludable y a tiempo.
                </div>
              ) : (
                criticalProjects.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-300 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-zinc-900 leading-snug line-clamp-1">{proj.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        proj.health === 'critico' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {proj.health}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span>{proj.client}</span>
                      <span className="font-mono font-bold text-zinc-900">{proj.progress}% avance</span>
                    </div>

                    <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          proj.health === 'critico' ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
                      <span>Entrega: {proj.targetDate}</span>
                      <span className="font-semibold text-zinc-700">Ver detalle →</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* WIDGET 4: Tablero Rápido de Tareas Prioritarias */}
      {isVisible('w-kanban-quick') && (
        <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-zinc-900">Sprint Kanban: Tareas Prioritarias</h3>
              <p className="text-xs text-zinc-400">Cambia el estado de entrega directamente</p>
            </div>
            <button
              onClick={() => setActiveSection('proyectos')}
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
            >
              Ver Tablero Completo de Proyectos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
            {(['por_hacer', 'en_progreso', 'en_revision', 'completado'] as KanbanColumn[]).map(col => {
              const colTasks = tasks.filter(t => t.status === col);
              const colMeta: Record<KanbanColumn, { title: string; color: string; badge: string }> = {
                por_hacer: { title: 'Por Hacer', color: 'bg-zinc-100', badge: 'bg-zinc-200 text-zinc-700' },
                en_progreso: { title: 'En Progreso', color: 'bg-sky-50', badge: 'bg-sky-100 text-sky-800' },
                en_revision: { title: 'En Revisión', color: 'bg-purple-50', badge: 'bg-purple-100 text-purple-800' },
                completado: { title: 'Completado', color: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-800' },
              };
              const meta = colMeta[col];

              return (
                <div key={col} className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-zinc-200/60">
                    <span className="text-xs font-bold text-zinc-700">{meta.title}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${meta.badge}`}>
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {colTasks.slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        className="p-2.5 rounded-xl bg-white border border-zinc-200/70 hover:shadow-xs transition-all space-y-1.5 text-left"
                      >
                        <p className="text-xs font-semibold text-zinc-900 line-clamp-2 leading-snug">
                          {task.title}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-zinc-400">
                          <span className="truncate max-w-[90px]">{task.projectName}</span>
                          <span className="font-mono">{task.dueDate}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full ${
                            task.priority === 'urgente' ? 'bg-rose-50 text-rose-700' :
                            task.priority === 'alta' ? 'bg-amber-50 text-amber-700' :
                            'bg-zinc-100 text-zinc-600'
                          }`}>
                            {task.priority}
                          </span>
                          <select
                            value={task.status}
                            onChange={e => updateTask(task.id, { status: e.target.value as KanbanColumn })}
                            className="text-[10px] font-medium py-0.5 px-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700"
                          >
                            <option value="por_hacer">Por hacer</option>
                            <option value="en_progreso">En progreso</option>
                            <option value="en_revision">En revisión</option>
                            <option value="completado">Completado</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Row 3: Carga de Trabajo Peek & Notas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WIDGET 5: Resumen Carga Semanal */}
        {isVisible('w-workload') && (
          <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900">Capacidad Semanal del Equipo</h3>
                <p className="text-xs text-zinc-400">Límite recomendado: 40 hrs semanales</p>
              </div>
              <button
                onClick={() => setActiveSection('carga_trabajo')}
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-900"
              >
                Rebalancear →
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {teamMembers.slice(0, 4).map(member => {
                const percentage = Math.round((member.assignedHours / member.weeklyCapacity) * 100);
                const isOver = member.assignedHours > member.weeklyCapacity;

                return (
                  <div key={member.id} className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full bg-white" />
                        <div>
                          <span className="text-xs font-bold text-zinc-900">{member.name}</span>
                          <span className="text-[10px] text-zinc-400 ml-1.5">{member.role}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-bold font-mono ${isOver ? 'text-rose-600' : 'text-zinc-700'}`}>
                        {member.assignedHours}h / {member.weeklyCapacity}h ({percentage}%)
                      </span>
                    </div>

                    <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isOver ? 'bg-rose-500' : percentage > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WIDGET 7: Notas Rápidas & Acuerdos */}
        {isVisible('w-notes-pinned') && (
          <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900">Notas Rápidas & Acuerdos</h3>
                <p className="text-xs text-zinc-400">Minutas fijadas de proyectos clave</p>
              </div>
              <button
                onClick={() => setActiveSection('notas')}
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-900"
              >
                Ver Todas →
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {notes.slice(0, 2).map(note => (
                <div
                  key={note.id}
                  onClick={() => setActiveSection('notas')}
                  className="p-4 rounded-2xl border cursor-pointer hover:shadow-xs transition-all space-y-1.5"
                  style={{ backgroundColor: note.color || '#E0F2FE', borderColor: '#e4e4e7' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900">{note.title}</span>
                    <StickyNote className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <p className="text-xs text-zinc-700 line-clamp-2 leading-relaxed">
                    {note.content}
                  </p>
                  <div className="flex items-center gap-1 pt-1">
                    {note.tags.map(t => (
                      <span key={t} className="text-[10px] font-medium bg-white/80 px-2 py-0.5 rounded-md text-zinc-700">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
