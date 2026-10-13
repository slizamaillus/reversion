import React, { useState } from 'react';
import { 
  Users2, 
  Plus, 
  Target, 
  ShieldCheck, 
  Briefcase, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { TeamSquad } from '../../types/crm';

export const TeamsSection: React.FC = () => {
  const { squads, teamMembers, projects, setSelectedProjectId } = useCRM();
  const [newSquadOpen, setNewSquadOpen] = useState(false);
  const [squadName, setSquadName] = useState('');
  const [squadDesc, setSquadDesc] = useState('');
  const [squadGoal, setSquadGoal] = useState('');
  const [squadFocus, setSquadFocus] = useState('');

  const handleCreateSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!squadName.trim()) return;
    // Context or local state
    setNewSquadOpen(false);
    setSquadName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Equipos & Escuadras
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Organización por células ágiles de trabajo, focos estratégicos y metas de impacto.
          </p>
        </div>

        <button
          onClick={() => setNewSquadOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white hover:bg-black transition-all shadow-sm active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Nueva Escuadra
        </button>
      </div>

      {/* Squads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {squads.map(squad => {
          const members = teamMembers.filter(m => squad.memberIds.includes(m.id));
          const totalHours = members.reduce((acc, m) => acc + m.assignedHours, 0);
          const totalCapacity = members.reduce((acc, m) => acc + m.weeklyCapacity, 0);
          const loadPct = totalCapacity > 0 ? Math.round((totalHours / totalCapacity) * 100) : 0;

          return (
            <div
              key={squad.id}
              className="bg-white rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-2xs"
                    style={{ backgroundColor: squad.color || '#E0F2FE' }}
                  >
                    <Users2 className="w-5 h-5 text-zinc-800" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    loadPct > 100 ? 'bg-rose-50 text-rose-700' :
                    loadPct > 80 ? 'bg-amber-50 text-amber-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    {loadPct}% capacidad
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                    {squad.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    {squad.description}
                  </p>
                </div>

                {/* Focus Area */}
                <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 text-xs space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Foco Principal</div>
                  <div className="font-semibold text-zinc-800">{squad.focusArea}</div>
                </div>

                {/* Goal */}
                <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/60 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                    <Target className="w-3.5 h-3.5" />
                    Meta Q4
                  </div>
                  <div className="font-medium text-zinc-900">{squad.currentQuarterGoal}</div>
                </div>
              </div>

              {/* Members */}
              <div className="pt-4 border-t border-zinc-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">
                    Líder: <strong className="text-zinc-800 font-semibold">{squad.leadName}</strong>
                  </span>
                  <span className="font-mono text-zinc-500 font-medium text-[11px]">
                    {totalHours}h / {totalCapacity}h
                  </span>
                </div>

                <div className="space-y-1.5">
                  {members.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-2 rounded-xl bg-zinc-50/70 border border-zinc-100 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full bg-white shrink-0" />
                        <span className="font-semibold text-zinc-900 truncate">{m.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                        {m.assignedHours}h
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
