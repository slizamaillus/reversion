import React, { useState } from 'react';
import { 
  Plus, 
  FolderKanban, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Briefcase, 
  ArrowRight, 
  Trash2, 
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Portfolio, HealthStatus } from '../../types/crm';

export const PortfoliosSection: React.FC = () => {
  const { 
    portfolios, 
    projects, 
    deletePortfolio, 
    setCreateModalOpen, 
    setCreateModalType,
    setSelectedProjectId,
    updatePortfolio
  } = useCRM();

  const [expandedPortfolio, setExpandedPortfolio] = useState<string | null>(portfolios[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedPortfolio(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Portafolios Estratégicos
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Agrupación macro de iniciativas de negocio, presupuestos consolidados y ROI.
          </p>
        </div>

        <button
          onClick={() => {
            setCreateModalType('portafolio');
            setCreateModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white hover:bg-black transition-all shadow-sm active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Nuevo Portafolio
        </button>
      </div>

      {/* Portfolios Grid / Cards */}
      <div className="space-y-4">
        {portfolios.map(port => {
          const portProjects = projects.filter(p => p.portfolioId === port.id);
          const portAvgProgress = portProjects.length > 0 
            ? Math.round(portProjects.reduce((acc, p) => acc + p.progress, 0) / portProjects.length)
            : 0;
          const isExpanded = expandedPortfolio === port.id;
          const spentPct = port.targetBudget > 0 ? Math.round((port.spentBudget / port.targetBudget) * 100) : 0;

          return (
            <div
              key={port.id}
              className="bg-white rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden transition-all"
            >
              {/* Card Summary Header */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                      style={{ backgroundColor: port.color || '#E0E7FF' }}
                    >
                      <FolderKanban className="w-6 h-6 text-zinc-800" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          port.health === 'saludable' ? 'bg-emerald-50 text-emerald-700' :
                          port.health === 'atencion' ? 'bg-amber-50 text-amber-700' :
                          'bg-rose-50 text-rose-700'
                        }`}>
                          {port.health.toUpperCase()}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {portProjects.length} proyectos activos
                        </span>
                        <span className="text-xs text-zinc-400">· Líder: <strong className="text-zinc-700 font-semibold">{port.ownerName}</strong></span>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                        {port.name}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
                        {port.description}
                      </p>
                    </div>
                  </div>

                  {/* Right metrics */}
                  <div className="flex items-center gap-6 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-100">
                    {/* Avance */}
                    <div className="w-36">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-zinc-400 font-medium">Avance</span>
                        <span className="font-mono font-bold text-zinc-900">{portAvgProgress}%</span>
                      </div>
                      <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-zinc-900 h-full rounded-full transition-all duration-500"
                          style={{ width: `${portAvgProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Presupuesto */}
                    <div className="text-right">
                      <div className="text-[11px] text-zinc-400 font-medium">Presupuesto Ejecutado</div>
                      <div className="text-xs font-bold font-mono text-zinc-900">
                        ${port.spentBudget.toLocaleString()} / ${port.targetBudget.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">({spentPct}%)</span>
                    </div>

                    {/* Expand Button */}
                    <button
                      onClick={() => toggleExpand(port.id)}
                      className="p-2 rounded-xl bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
                      title={isExpanded ? 'Ocultar proyectos' : 'Ver proyectos'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Strategic Objective Strip */}
                <div className="mt-4 p-3 bg-zinc-50 rounded-2xl border border-zinc-100/80 flex items-center justify-between text-xs text-zinc-600">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-800 shrink-0">🎯 Objetivo Estratégico:</span>
                    <span className="truncate">{port.strategicObjective}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-zinc-400 text-[11px] font-mono">
                    <span>{port.startDate} — {port.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Accordion: Child Projects */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-zinc-100 bg-zinc-50/40 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
                    <span>Proyectos dentro de {port.name}</span>
                    <button
                      onClick={() => deletePortfolio(port.id)}
                      className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold text-[11px]"
                    >
                      <Trash2 className="w-3 h-3" /> Mover Portafolio a Papelera
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {portProjects.length === 0 ? (
                      <div className="col-span-full py-8 text-center text-xs text-zinc-400 bg-white rounded-2xl border border-dashed border-zinc-200">
                        No hay proyectos vinculados aún. Crea uno o asígnalo a este portafolio.
                      </div>
                    ) : (
                      portProjects.map(proj => (
                        <div
                          key={proj.id}
                          onClick={() => setSelectedProjectId(proj.id)}
                          className="p-4 rounded-2xl bg-white border border-zinc-200/70 hover:border-zinc-300 hover:shadow-xs cursor-pointer transition-all space-y-2 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 truncate max-w-[120px]">
                              {proj.client}
                            </span>
                            <span className="font-mono text-xs font-bold text-zinc-900">{proj.progress}%</span>
                          </div>

                          <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">
                            {proj.name}
                          </h4>

                          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-indigo-600 h-full rounded-full"
                              style={{ width: `${proj.progress}%` }}
                            />
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-zinc-400 pt-1">
                            <span>Límite: {proj.targetDate}</span>
                            <span className="text-zinc-700 font-semibold flex items-center gap-0.5">
                              Detalles <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
