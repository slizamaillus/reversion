import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Kanban, 
  List, 
  CalendarRange, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Users, 
  ArrowRight,
  MoreVertical,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Project, ProjectStatus, HealthStatus, Priority } from '../../types/crm';

export const ProjectsSection: React.FC = () => {
  const { 
    projects, 
    portfolios, 
    setSelectedProjectId, 
    setCreateModalOpen, 
    setCreateModalType,
    updateProject 
  } = useCRM();

  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'timeline'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPortfolio, setSelectedPortfolio] = useState('all');
  const [selectedHealth, setSelectedHealth] = useState('all');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPort = selectedPortfolio === 'all' || p.portfolioId === selectedPortfolio;
    const matchesHealth = selectedHealth === 'all' || p.health === selectedHealth;
    return matchesSearch && matchesPort && matchesHealth;
  });

  const kanbanColumns: { id: ProjectStatus; title: string; color: string }[] = [
    { id: 'planificacion', title: 'Planificación', color: 'border-zinc-200' },
    { id: 'en_progreso', title: 'En Progreso', color: 'border-sky-200' },
    { id: 'revision', title: 'En Revisión', color: 'border-purple-200' },
    { id: 'completado', title: 'Completado', color: 'border-emerald-200' },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: ProjectStatus) => {
    e.preventDefault();
    const projId = e.dataTransfer.getData('text/plain');
    if (projId) {
      updateProject(projId, { status });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Proyectos & Tableros
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Supervisa el ciclo de vida, porcentajes de avance y asignaciones de equipo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Switcher */}
          <div className="flex items-center p-1 bg-zinc-100 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'kanban' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Lista
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'timeline' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              Cronograma
            </button>
          </div>

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

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200/80">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filtrar por proyecto, cliente o categoría..."
            className="w-full text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedPortfolio}
            onChange={e => setSelectedPortfolio(e.target.value)}
            className="text-xs font-medium py-1.5 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 focus:outline-none"
          >
            <option value="all">Todos los Portafolios</option>
            {portfolios.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={selectedHealth}
            onChange={e => setSelectedHealth(e.target.value)}
            className="text-xs font-medium py-1.5 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 focus:outline-none"
          >
            <option value="all">Cualquier Estado de Salud</option>
            <option value="saludable">Saludable</option>
            <option value="atencion">Atención Requerida</option>
            <option value="critico">Crítico / En Riesgo</option>
          </select>
        </div>
      </div>

      {/* VIEW: 4-COLUMN KANBAN */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map(col => {
            const colProjects = filteredProjects.filter(p => p.status === col.id);

            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, col.id)}
                className="bg-zinc-100/60 p-4 rounded-3xl border border-zinc-200/70 min-h-[500px] flex flex-col space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200/70">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900">{col.title}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-zinc-600 border border-zinc-200 shadow-2xs font-mono">
                      {colProjects.length}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setCreateModalType('proyecto');
                      setCreateModalOpen(true);
                    }}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colProjects.map(proj => (
                    <div
                      key={proj.id}
                      draggable
                      onDragStart={e => e.dataTransfer.setData('text/plain', proj.id)}
                      onClick={() => setSelectedProjectId(proj.id)}
                      className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-zinc-300 transition-all cursor-pointer space-y-3 text-left group"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 truncate max-w-[120px]">
                          {proj.client}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          proj.health === 'saludable' ? 'bg-emerald-50 text-emerald-700' :
                          proj.health === 'atencion' ? 'bg-amber-50 text-amber-700' :
                          'bg-rose-50 text-rose-700'
                        }`}>
                          {proj.health}
                        </span>
                      </div>

                      {/* Title & Desc */}
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900 leading-snug group-hover:text-indigo-600 transition-colors">
                          {proj.name}
                        </h4>
                        <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>

                      {/* Progress Bar & Percentage */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-zinc-400 font-medium">Avance</span>
                          <span className="font-mono font-bold text-zinc-900">{proj.progress}%</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-zinc-900 h-full rounded-full transition-all duration-300"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Footer: Date & Leader */}
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[10px] text-zinc-400">
                        <span className="font-mono">{proj.targetDate}</span>
                        <div className="flex items-center gap-1.5">
                          <img
                            src={proj.leaderAvatar}
                            alt={proj.leaderName}
                            className="w-5 h-5 rounded-full bg-zinc-100"
                            title={proj.leaderName}
                          />
                          <span className="text-zinc-700 font-medium truncate max-w-[70px]">
                            {proj.leaderName?.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {colProjects.length === 0 && (
                    <div className="h-32 border border-dashed border-zinc-200 rounded-2xl flex items-center justify-center text-xs text-zinc-400">
                      Arrastra proyectos aquí
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: LIST (High-density tabular) */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Proyecto & Cliente</th>
                  <th className="py-3 px-4">Portafolio</th>
                  <th className="py-3 px-4">Avance</th>
                  <th className="py-3 px-4">Salud</th>
                  <th className="py-3 px-4">Presupuesto</th>
                  <th className="py-3 px-4">Fecha Límite</th>
                  <th className="py-3 px-4">Líder</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {filteredProjects.map(proj => (
                  <tr
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className="hover:bg-zinc-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-zinc-900 max-w-[200px]">
                      <div className="truncate">{proj.name}</div>
                      <div className="text-[11px] text-zinc-400 font-normal">{proj.client}</div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-600">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-[10px] font-medium">
                        {proj.portfolioName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-zinc-900 h-full rounded-full" 
                            style={{ width: `${proj.progress}%` }} 
                          />
                        </div>
                        <span className="font-mono font-bold text-zinc-900">{proj.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        proj.health === 'saludable' ? 'bg-emerald-50 text-emerald-700' :
                        proj.health === 'atencion' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {proj.health}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-700">
                      ${proj.spent.toLocaleString()} / ${proj.budget.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-500">
                      {proj.targetDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <img src={proj.leaderAvatar} alt={proj.leaderName} className="w-5 h-5 rounded-full" />
                        <span className="text-zinc-800 font-medium truncate max-w-[80px]">
                          {proj.leaderName?.split(' ')[0]}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800">
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: TIMELINE / GANTT */}
      {viewMode === 'timeline' && (
        <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-900">Cronograma Visual de Proyectos</h3>
            <span className="text-xs text-zinc-400">Escala de entrega Q3 - Q4 2026</span>
          </div>

          <div className="space-y-4 pt-2">
            {filteredProjects.map(proj => (
              <div 
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-300 cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900">{proj.name}</span>
                    <span className="text-[10px] text-zinc-400">({proj.client})</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-800">{proj.progress}%</span>
                </div>

                <div className="relative w-full bg-zinc-200 h-4 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>Inicio: {proj.startDate}</span>
                  <span>Meta: {proj.targetDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
