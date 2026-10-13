import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  SlidersHorizontal, 
  FolderPlus, 
  Briefcase, 
  CheckSquare, 
  StickyNote, 
  UserPlus, 
  Check, 
  ArrowRight,
  Sparkles,
  Command
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const TopBar: React.FC = () => {
  const { 
    activeSection, 
    setActiveSection, 
    setSearchOpen, 
    setCreateModalOpen, 
    setCreateModalType,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    profile,
    sidebarCollapsed,
    setEditWidgetsOpen
  } = useCRM();

  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const createRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (createRef.current && !createRef.current.contains(e.target as Node)) {
        setCreateDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Section titles mapping
  const sectionTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard Ejecutivo', subtitle: 'Resumen integral de proyectos, métricas y avance' },
    mis_tareas: { title: 'Mis Tareas', subtitle: 'Organización personal, seguimiento de tiempo y entregables' },
    calendario: { title: 'Calendario de Hitos', subtitle: 'Fechas límite, sprints y entregas programadas' },
    portafolios: { title: 'Portafolios Estratégicos', subtitle: 'Agrupación macro de proyectos y presupuestos acumulados' },
    proyectos: { title: 'Proyectos & Tableros', subtitle: 'Kanban 4 columnas, lista de avance y cronograma' },
    plantillas: { title: 'Catálogo de Plantillas', subtitle: 'Metodologías preconfiguradas para iniciar en 1 click' },
    equipos: { title: 'Equipos & Escuadras', subtitle: 'Estructura organizativa, focos de trabajo y objetivos Q4' },
    carga_trabajo: { title: 'Carga de Trabajo', subtitle: 'Balanceo de capacidad semanal (40h) y horas comprometidas' },
    usuarios: { title: 'Directorio de Usuarios', subtitle: 'Miembros, roles, disponibilidad y asignaciones' },
    notas: { title: 'Notas & Documentación', subtitle: 'Acuerdos rápidos, notas pastel y minutas de proyectos' },
    notificaciones: { title: 'Centro de Notificaciones', subtitle: 'Registro cronológico de cambios de avance y alertas' },
    papelera: { title: 'Papelera de Reciclaje', subtitle: 'Elementos eliminados con opción de restauración' },
    perfil: { title: 'Perfil de Usuario', subtitle: 'Preferencias individuales, rol y configuración de cuenta' },
  };

  const currentMeta = sectionTitles[activeSection] || { title: 'Flujo CRM', subtitle: 'Gestión y Avance' };

  const handleOpenCreate = (type: 'proyecto' | 'tarea' | 'nota' | 'usuario' | 'portafolio') => {
    setCreateModalType(type);
    setCreateModalOpen(true);
    setCreateDropdownOpen(false);
  };

  return (
    <header className={`sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-6 flex items-center justify-between gap-4 transition-all duration-300 ${
      sidebarCollapsed ? 'ml-20' : 'ml-64'
    }`}>
      {/* Left: Breadcrumb / Section Header */}
      <div className="flex items-center gap-3 min-w-0">
        <div>
          <h1 className="text-base font-bold text-zinc-900 tracking-tight leading-tight truncate">
            {currentMeta.title}
          </h1>
          <p className="text-xs text-zinc-400 font-normal hidden sm:block truncate">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Center / Search bar trigger */}
      <div className="flex-1 max-w-md mx-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-full bg-zinc-100/80 hover:bg-zinc-100 border border-zinc-200/70 text-zinc-400 text-xs font-normal transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
            <span className="text-zinc-500 group-hover:text-zinc-800 transition-colors">
              Buscar proyectos, tareas, notas o miembros...
            </span>
          </div>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white border border-zinc-200 rounded text-zinc-400 shadow-2xs">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Customize Widgets Button (Only in Dashboard) */}
        {activeSection === 'dashboard' && (
          <button
            onClick={() => setEditWidgetsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200/60 transition-colors"
            title="Personalizar qué widgets mostrar y su orden"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden lg:inline">Editar Widgets</span>
          </button>
        )}

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-full text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
            title="Notificaciones y actividad"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-84 bg-white rounded-2xl shadow-xl border border-zinc-200/80 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-900">Notificaciones</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-semibold bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full">
                      {unreadCount} nuevas
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-zinc-500 hover:text-zinc-900 font-medium"
                  >
                    Marcar todas leídas
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-colors text-left ${
                      n.read ? 'bg-zinc-50/60 hover:bg-zinc-100/60' : 'bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-zinc-900 leading-snug">{n.title}</p>
                      <span className="text-[10px] text-zinc-400 shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-zinc-600 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setActiveSection('notificaciones');
                  setNotificationsOpen(false);
                }}
                className="w-full mt-2 pt-2 border-t border-zinc-100 text-center text-xs font-medium text-zinc-700 hover:text-zinc-900 flex items-center justify-center gap-1"
              >
                Ver todo el historial <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* High-Contrast Black CTA: "+ Nuevo" */}
        <div className="relative" ref={createRef}>
          <button
            onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 text-white hover:bg-black font-semibold text-xs shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nuevo</span>
          </button>

          {createDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-zinc-200/80 p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                onClick={() => handleOpenCreate('proyecto')}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-zinc-900">Proyecto</div>
                  <div className="text-[10px] text-zinc-400">Con Kanban y seguimiento</div>
                </div>
              </button>

              <button
                onClick={() => handleOpenCreate('tarea')}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <CheckSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-zinc-900">Tarea</div>
                  <div className="text-[10px] text-zinc-400">Asignar a un proyecto</div>
                </div>
              </button>

              <button
                onClick={() => handleOpenCreate('portafolio')}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FolderPlus className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-zinc-900">Portafolio</div>
                  <div className="text-[10px] text-zinc-400">Iniciativa estratégica macro</div>
                </div>
              </button>

              <button
                onClick={() => handleOpenCreate('nota')}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <StickyNote className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-zinc-900">Nota Rápida</div>
                  <div className="text-[10px] text-zinc-400">Minuta o idea en pastel</div>
                </div>
              </button>

              <button
                onClick={() => handleOpenCreate('usuario')}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors text-left border-t border-zinc-100 mt-1 pt-2"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <UserPlus className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-zinc-900">Invitar Miembro</div>
                  <div className="text-[10px] text-zinc-400">Sumar al equipo</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Profile Avatar Trigger */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 pl-1 rounded-full hover:ring-2 hover:ring-zinc-200 transition-all"
          >
            <img 
              src={profile.avatar} 
              alt={profile.name}
              className="w-8 h-8 rounded-full border border-indigo-200 bg-white" 
            />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-zinc-200/80 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2 border-b border-zinc-100">
                <p className="text-xs font-bold text-zinc-900 truncate">{profile.name}</p>
                <p className="text-[11px] text-zinc-400 truncate">{profile.email}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                  {profile.role}
                </span>
              </div>
              <button
                onClick={() => {
                  setActiveSection('perfil');
                  setProfileDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors mt-1"
              >
                Editar Perfil y Horario
              </button>
              <button
                onClick={() => {
                  setActiveSection('mis_tareas');
                  setProfileDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors"
              >
                Ver Mis Tareas Pendientes
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
