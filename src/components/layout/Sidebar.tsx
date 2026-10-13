import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  FolderKanban, 
  Briefcase, 
  FileCode, 
  Users2, 
  Scale, 
  UserCheck, 
  StickyNote, 
  Bell, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { useCRM, SectionKey } from '../../context/CRMContext';

interface NavItem {
  id: SectionKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { 
    activeSection, 
    setActiveSection, 
    sidebarCollapsed, 
    setSidebarCollapsed,
    tasks,
    notifications,
    trash,
    profile
  } = useCRM();

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const myPendingTasks = tasks.filter(t => !t.completed && t.assigneeId === profile.id).length;
  const trashCount = trash.length;

  const navGroups: { group: string; items: NavItem[] }[] = [
    {
      group: 'PRINCIPAL',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'mis_tareas', label: 'Mis Tareas', icon: CheckSquare, badge: myPendingTasks > 0 ? myPendingTasks : undefined, badgeColor: 'bg-indigo-50 text-indigo-700' },
        { id: 'calendario', label: 'Calendario', icon: Calendar },
      ],
    },
    {
      group: 'GESTIÓN & AVANCE',
      items: [
        { id: 'portafolios', label: 'Portafolios', icon: FolderKanban },
        { id: 'proyectos', label: 'Proyectos', icon: Briefcase },
        { id: 'plantillas', label: 'Plantillas', icon: FileCode },
      ],
    },
    {
      group: 'EQUIPO & CAPACIDAD',
      items: [
        { id: 'equipos', label: 'Equipos', icon: Users2 },
        { id: 'carga_trabajo', label: 'Carga de trabajo', icon: Scale },
        { id: 'usuarios', label: 'Usuarios', icon: UserCheck },
      ],
    },
    {
      group: 'PRODUCTIVIDAD',
      items: [
        { id: 'notas', label: 'Notas', icon: StickyNote },
        { id: 'notificaciones', label: 'Notificaciones', icon: Bell, badge: unreadNotifications > 0 ? unreadNotifications : undefined, badgeColor: 'bg-rose-50 text-rose-700' },
        { id: 'papelera', label: 'Papelera', icon: Trash2, badge: trashCount > 0 ? trashCount : undefined, badgeColor: 'bg-zinc-100 text-zinc-600' },
      ],
    },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col bg-white border-r border-zinc-200/80 transition-all duration-300 ease-in-out select-none ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-100">
        <div 
          onClick={() => setActiveSection('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Layers className="w-5 h-5 text-indigo-300" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-zinc-900 flex items-center gap-1.5">
                Flujo CRM
                <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full">v2.4</span>
              </span>
              <span className="text-xs text-zinc-400 font-medium truncate max-w-[130px]">
                Gestión de Proyectos
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          title={sidebarCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            {!sidebarCollapsed && (
              <div className="px-3 py-1 text-[11px] font-bold text-zinc-400 tracking-wider">
                {group.group}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive 
                      ? 'bg-zinc-900 text-white shadow-sm' 
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
                  } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                  
                  {!sidebarCollapsed && (
                    <span className="truncate flex-1 text-left">
                      {item.label}
                    </span>
                  )}

                  {!sidebarCollapsed && item.badge !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                      isActive ? 'bg-zinc-800 text-zinc-200' : item.badgeColor || 'bg-zinc-100 text-zinc-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {sidebarCollapsed && item.badge !== undefined && (
                    <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Profile Teaser */}
      <div className="p-3 border-t border-zinc-100 bg-zinc-50/50">
        <div 
          onClick={() => setActiveSection('perfil')}
          title="Ver perfil de usuario y ajustes"
          className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${
            activeSection === 'perfil'
              ? 'bg-zinc-900 text-white shadow-sm border border-zinc-900'
              : 'hover:bg-white hover:shadow-xs border border-transparent hover:border-zinc-200/60'
          } ${sidebarCollapsed ? 'justify-center p-1' : ''}`}
        >
          <img 
            src={profile.avatar} 
            alt={profile.name}
            className={`w-8 h-8 rounded-full border bg-white shrink-0 ${
              activeSection === 'perfil' ? 'border-zinc-700 ring-2 ring-indigo-400' : 'border-indigo-100'
            }`} 
          />
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold truncate ${
                activeSection === 'perfil' ? 'text-white' : 'text-zinc-900'
              }`}>{profile.name}</p>
              <p className={`text-[11px] truncate ${
                activeSection === 'perfil' ? 'text-zinc-300' : 'text-zinc-400'
              }`}>{profile.role}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
