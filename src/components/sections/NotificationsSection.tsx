import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Filter, 
  TrendingUp, 
  CheckSquare, 
  DollarSign, 
  AlertCircle,
  Sparkles 
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { NotificationItem } from '../../types/crm';

export const NotificationsSection: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    clearAllNotifications,
    setSelectedProjectId,
    setActiveSection
  } = useCRM();

  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'unread') return !n.read;
    if (filterType !== 'all') return n.type === filterType;
    return true;
  });

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'avance': return <TrendingUp className="w-4 h-4 text-sky-600" />;
      case 'tarea': return <CheckSquare className="w-4 h-4 text-emerald-600" />;
      case 'presupuesto': return <DollarSign className="w-4 h-4 text-purple-600" />;
      case 'sistema': return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default: return <Bell className="w-4 h-4 text-zinc-600" />;
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    markNotificationRead(item.id);
    if (item.projectId) {
      setSelectedProjectId(item.projectId);
    } else if (item.taskId) {
      setActiveSection('mis_tareas');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Centro de Notificaciones & Actividad
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Registro de avances, reajustes presupuestarios y cambios operativos en vivo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Marcar todas leídas
          </button>
          <button
            onClick={clearAllNotifications}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-zinc-100 text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpiar historial
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-zinc-200/80 overflow-x-auto">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
            filterType === 'all' ? 'bg-zinc-900 text-white shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Todas ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
            filterType === 'unread' ? 'bg-zinc-900 text-white shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          No leídas ({notifications.filter(n => !n.read).length})
        </button>
        <button
          onClick={() => setFilterType('avance')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
            filterType === 'avance' ? 'bg-zinc-900 text-white shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Avance de Proyecto
        </button>
        <button
          onClick={() => setFilterType('presupuesto')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
            filterType === 'presupuesto' ? 'bg-zinc-900 text-white shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Presupuesto
        </button>
        <button
          onClick={() => setFilterType('tarea')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
            filterType === 'tarea' ? 'bg-zinc-900 text-white shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Tareas
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map(item => (
          <div
            key={item.id}
            onClick={() => handleNotificationClick(item)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              item.read 
                ? 'bg-white border-zinc-200/70 hover:border-zinc-300' 
                : 'bg-indigo-50/40 border-indigo-100 hover:bg-indigo-50/70 shadow-xs'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center shrink-0 shadow-2xs">
              {getIconForType(item.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-zinc-900 leading-snug">
                    {item.title}
                  </h4>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  )}
                </div>
                <span className="text-[11px] text-zinc-400 font-mono shrink-0">
                  {item.timestamp}
                </span>
              </div>

              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                {item.message}
              </p>

              <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-400">
                <span>Por: <strong className="text-zinc-700 font-semibold">{item.actorName}</strong></span>
                {item.projectId && <span>· Clic para ver proyecto</span>}
              </div>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="py-16 text-center text-zinc-400 text-xs bg-white rounded-3xl border border-dashed border-zinc-200">
            No tienes notificaciones en este filtro.
          </div>
        )}
      </div>
    </div>
  );
};
