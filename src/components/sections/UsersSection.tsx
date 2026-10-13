import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Mail, 
  Briefcase, 
  Scale, 
  Shield, 
  Check, 
  Sparkles,
  UserPlus
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { TeamMember } from '../../types/crm';

export const UsersSection: React.FC = () => {
  const { 
    teamMembers, 
    updateTeamMember, 
    setCreateModalOpen, 
    setCreateModalType,
    setActiveSection 
  } = useCRM();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const departments = ['all', ...Array.from(new Set(teamMembers.map(m => m.department)))];

  const filteredMembers = teamMembers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                          m.email.toLowerCase().includes(search.toLowerCase()) ||
                          m.role.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'all' || m.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Directorio de Usuarios
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Gestión de roles organizacionales, asignaciones y capacidad del talento humano.
          </p>
        </div>

        <button
          onClick={() => {
            setCreateModalType('usuario');
            setCreateModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white hover:bg-black transition-all shadow-sm active:scale-[0.98]"
        >
          <UserPlus className="w-4 h-4" />
          Invitar Usuario
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200/80">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo o cargo..."
            className="w-full text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Departamento:</span>
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 focus:outline-none"
          >
            {departments.map(d => (
              <option key={d} value={d}>{d === 'all' ? 'Todos' : d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map(member => {
          const loadPct = Math.round((member.assignedHours / member.weeklyCapacity) * 100);
          const isOver = member.assignedHours > member.weeklyCapacity;

          return (
            <div
              key={member.id}
              className="bg-white rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 shadow-2xs" 
                    />
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900">{member.name}</h3>
                      <p className="text-xs text-zinc-400">{member.role}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    member.status === 'activo' ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600'
                  }`}>
                    {member.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-500 pt-2 border-t border-zinc-100">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{member.department}</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex items-center gap-1 flex-wrap mt-3">
                  {member.skills.map(s => (
                    <span key={s} className="text-[10px] font-medium bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Workload Progress Bar Footer */}
              <div className="pt-3 border-t border-zinc-100 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-medium">Carga Semanal</span>
                  <span className={`font-mono font-bold ${isOver ? 'text-rose-600' : 'text-zinc-900'}`}>
                    {member.assignedHours}h / {member.weeklyCapacity}h ({loadPct}%)
                  </span>
                </div>

                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      isOver ? 'bg-rose-500' : loadPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, loadPct)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
