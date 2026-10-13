import React, { useState } from 'react';
import { 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  User, 
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Task } from '../../types/crm';

export const WorkloadSection: React.FC = () => {
  const { teamMembers, tasks, updateTask, updateTeamMember } = useCRM();
  const [rebalanceTask, setRebalanceTask] = useState<Task | null>(null);
  const [targetMemberId, setTargetMemberId] = useState('');

  const overloadedCount = teamMembers.filter(m => m.assignedHours > m.weeklyCapacity).length;
  const balancedCount = teamMembers.filter(m => m.assignedHours <= m.weeklyCapacity && m.assignedHours >= 30).length;
  const availableCount = teamMembers.filter(m => m.assignedHours < 30).length;

  const handleRebalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rebalanceTask || !targetMemberId) return;

    const oldAssigneeId = rebalanceTask.assigneeId;
    const targetMember = teamMembers.find(m => m.id === targetMemberId);
    if (!targetMember) return;

    // Update task
    updateTask(rebalanceTask.id, {
      assigneeId: targetMember.id,
      assigneeName: targetMember.name,
      assigneeAvatar: targetMember.avatar,
    });

    // Update old member hours
    const taskHours = rebalanceTask.estimatedHours || 6;
    const oldMember = teamMembers.find(m => m.id === oldAssigneeId);
    if (oldMember) {
      updateTeamMember(oldAssigneeId, { assignedHours: Math.max(0, oldMember.assignedHours - taskHours) });
    }
    // Update new member hours
    updateTeamMember(targetMemberId, { assignedHours: targetMember.assignedHours + taskHours });

    setRebalanceTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Carga de Trabajo & Capacidad
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Balanceo de horas comprometidas frente a la capacidad nominal semanal (40h).
          </p>
        </div>

        {/* Quick Capacity Status Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{availableCount} Disponibles</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>{balancedCount} Balanceados</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>{overloadedCount} Sobrecargados</span>
          </div>
        </div>
      </div>

      {/* Rebalance Modal if open */}
      {rebalanceTask && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="text-xs">
            <span className="font-bold text-amber-900">Rebalancear Tarea: </span>
            <span className="text-amber-800">"{rebalanceTask.title}" ({rebalanceTask.estimatedHours}h)</span>
            <span className="text-amber-700 block sm:inline sm:ml-2">Asignada actualmente a {rebalanceTask.assigneeName}</span>
          </div>

          <form onSubmit={handleRebalance} className="flex items-center gap-2">
            <select
              value={targetMemberId}
              onChange={e => setTargetMemberId(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl bg-white border border-amber-300 text-zinc-900 font-medium"
            >
              <option value="">Selecciona nuevo asignado...</option>
              {teamMembers
                .filter(m => m.id !== rebalanceTask.assigneeId)
                .map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.assignedHours}h asignadas)
                  </option>
                ))}
            </select>
            <button
              type="submit"
              disabled={!targetMemberId}
              className="px-3 py-1.5 text-xs font-bold bg-zinc-900 text-white rounded-xl hover:bg-black disabled:opacity-50"
            >
              Transferir
            </button>
            <button
              type="button"
              onClick={() => setRebalanceTask(null)}
              className="px-2 py-1.5 text-xs text-zinc-600 hover:text-zinc-900"
            >
              Cancelar
            </button>
          </form>
        </div>
      )}

      {/* Members Workload List */}
      <div className="space-y-4">
        {teamMembers.map(member => {
          const percentage = Math.round((member.assignedHours / member.weeklyCapacity) * 100);
          const isOver = member.assignedHours > member.weeklyCapacity;
          const memberTasks = tasks.filter(t => t.assigneeId === member.id && !t.completed);

          return (
            <div
              key={member.id}
              className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4"
            >
              {/* Member Row Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-10 h-10 rounded-2xl bg-zinc-100 border border-zinc-200" 
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-zinc-900">{member.name}</h3>
                      <span className="text-[10px] font-semibold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
                        {member.department}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">{member.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-zinc-900">
                      {member.assignedHours}h <span className="text-zinc-400 font-normal">/ {member.weeklyCapacity}h</span>
                    </div>
                    <span className={`text-[10px] font-bold ${
                      isOver ? 'text-rose-600' : percentage > 80 ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {percentage}% de ocupación
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl ${
                    isOver ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    percentage > 85 ? 'bg-amber-50 text-amber-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    {isOver ? 'SOBRECARGA' : percentage > 85 ? 'ALTO' : 'ÓPTIMO'}
                  </span>
                </div>
              </div>

              {/* Workload Progress Gauge */}
              <div className="space-y-1">
                <div className="w-full bg-zinc-100 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? 'bg-rose-500' : percentage > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>
              </div>

              {/* Assigned Tasks accordion/strip */}
              <div className="pt-2 border-t border-zinc-100">
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-2 font-medium">
                  <span>Tareas asignadas en curso ({memberTasks.length})</span>
                  <span className="text-[11px] text-zinc-400">Haz click en "Transferir" para balancear</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {memberTasks.length === 0 ? (
                    <div className="text-xs text-zinc-400 py-2">
                      Sin tareas abiertas actualmente.
                    </div>
                  ) : (
                    memberTasks.map(task => (
                      <div
                        key={task.id}
                        className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-xs flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-900 truncate">{task.title}</p>
                          <p className="text-[10px] text-zinc-400 font-mono">{task.estimatedHours}h · {task.projectName}</p>
                        </div>

                        <button
                          onClick={() => setRebalanceTask(task)}
                          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-white shrink-0"
                          title="Reasignar a otro miembro"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
