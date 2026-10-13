import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Briefcase 
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const CalendarSection: React.FC = () => {
  const { tasks, projects, setSelectedProjectId, setCreateModalOpen, setCreateModalType } = useCRM();

  // Current view month (October 2026 as per time context)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 is October

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Calendar math
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Monday = 0

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const leadingBlanks = Array.from({ length: firstDayIndex }, (_, i) => i);

  // Group events by day in current month
  const getEventsForDay = (day: number) => {
    const formattedDay = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTasks = tasks.filter(t => t.dueDate === formattedDay);
    const dayProjects = projects.filter(p => p.targetDate === formattedDay);
    return { dayTasks, dayProjects };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Calendario de Hitos & Entregas
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Sincronización mensual de fechas límite, entregables y cierres de sprint.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month navigator */}
          <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-xl">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-zinc-900 px-3 min-w-[120px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setCreateModalType('tarea');
              setCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white hover:bg-black transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Agendar Tarea
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-zinc-400 uppercase tracking-wider pb-4 border-b border-zinc-100">
          <div>Lun</div>
          <div>Mar</div>
          <div>Mié</div>
          <div>Jue</div>
          <div>Vie</div>
          <div>Sáb</div>
          <div>Dom</div>
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 gap-2 pt-3">
          {/* Blanks */}
          {leadingBlanks.map(b => (
            <div key={`blank-${b}`} className="min-h-[110px] bg-zinc-50/40 rounded-2xl p-2 opacity-30" />
          ))}

          {/* Actual days */}
          {daysArray.map(day => {
            const { dayTasks, dayProjects } = getEventsForDay(day);
            const isToday = day === 12 && currentMonth === 9 && currentYear === 2026;

            return (
              <div
                key={day}
                className={`min-h-[115px] rounded-2xl p-2 border transition-all flex flex-col justify-between ${
                  isToday 
                    ? 'border-indigo-300 bg-indigo-50/30 ring-2 ring-indigo-500/20' 
                    : 'border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                    isToday ? 'bg-zinc-900 text-white' : 'text-zinc-700'
                  }`}>
                    {day}
                  </span>
                  {(dayTasks.length > 0 || dayProjects.length > 0) && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  )}
                </div>

                {/* Events list */}
                <div className="space-y-1 flex-1 overflow-y-auto max-h-[80px]">
                  {dayProjects.map(proj => (
                    <div
                      key={proj.id}
                      onClick={() => setSelectedProjectId(proj.id)}
                      className="p-1 px-1.5 rounded-lg bg-sky-100/80 text-sky-900 text-[10px] font-bold truncate cursor-pointer hover:bg-sky-200 transition-colors"
                      title={`Entrega Proyecto: ${proj.name}`}
                    >
                      🚀 {proj.name}
                    </div>
                  ))}

                  {dayTasks.map(task => (
                    <div
                      key={task.id}
                      className="p-1 px-1.5 rounded-lg bg-emerald-100/80 text-emerald-900 text-[10px] font-medium truncate cursor-pointer hover:bg-emerald-200 transition-colors"
                      title={`Tarea: ${task.title}`}
                    >
                      ✓ {task.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
