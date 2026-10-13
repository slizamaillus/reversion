import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Project, 
  Portfolio, 
  Task, 
  Note, 
  Template, 
  TeamMember, 
  TeamSquad, 
  NotificationItem, 
  TrashItem, 
  UserProfile, 
  WidgetConfig,
  KanbanColumn
} from '../types/crm';
import { 
  initialProjects, 
  initialPortfolios, 
  initialTasks, 
  initialNotes, 
  initialTemplates, 
  initialTeamMembers, 
  initialSquads, 
  initialNotifications, 
  initialTrash, 
  initialWidgets, 
  initialProfile 
} from '../data/initialData';

export type SectionKey = 
  | 'dashboard' 
  | 'notas' 
  | 'portafolios' 
  | 'proyectos' 
  | 'plantillas' 
  | 'equipos' 
  | 'carga_trabajo' 
  | 'mis_tareas' 
  | 'calendario' 
  | 'notificaciones' 
  | 'usuarios' 
  | 'papelera' 
  | 'perfil';

interface CRMContextType {
  activeSection: SectionKey;
  setActiveSection: (sec: SectionKey) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (c: boolean | ((prev: boolean) => boolean)) => void;

  // Data
  projects: Project[];
  portfolios: Portfolio[];
  tasks: Task[];
  notes: Note[];
  templates: Template[];
  teamMembers: TeamMember[];
  squads: TeamSquad[];
  notifications: NotificationItem[];
  trash: TrashItem[];
  widgets: WidgetConfig[];
  profile: UserProfile;

  // Modals & Controls
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  createModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  createModalType: 'proyecto' | 'tarea' | 'nota' | 'usuario' | 'portafolio';
  setCreateModalType: (t: 'proyecto' | 'tarea' | 'nota' | 'usuario' | 'portafolio') => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  editWidgetsOpen: boolean;
  setEditWidgetsOpen: (open: boolean) => void;

  // CRUD actions
  addProject: (p: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addPortfolio: (p: Omit<Portfolio, 'id' | 'createdAt'>) => void;
  updatePortfolio: (id: string, updates: Partial<Portfolio>) => void;
  deletePortfolio: (id: string) => void;

  addTask: (t: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  moveTaskStatus: (taskId: string, newStatus: KanbanColumn) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteTask: (id: string) => void;

  addNote: (n: Omit<Note, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  useTemplate: (tpl: Template, customName?: string) => void;

  addTeamMember: (m: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;
  addNotification: (n: Omit<NotificationItem, 'id' | 'timestamp'>) => void;

  restoreTrashItem: (trashId: string) => void;
  deleteTrashItemPermanently: (trashId: string) => void;
  emptyTrash: () => void;

  updateWidgetConfig: (widgets: WidgetConfig[]) => void;
  resetWidgets: () => void;

  updateProfile: (updates: Partial<UserProfile>) => void;
  resetAllDataToDefault: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<SectionKey>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Modals state
  const [searchOpen, setSearchOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState<'proyecto' | 'tarea' | 'nota' | 'usuario' | 'portafolio'>('proyecto');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [editWidgetsOpen, setEditWidgetsOpen] = useState(false);

  // Entities with localStorage persistence
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('flujo_crm_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => {
    const saved = localStorage.getItem('flujo_crm_portfolios');
    return saved ? JSON.parse(saved) : initialPortfolios;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('flujo_crm_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('flujo_crm_notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });

  const [templates] = useState<Template[]>(initialTemplates);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('flujo_crm_members');
    return saved ? JSON.parse(saved) : initialTeamMembers;
  });

  const [squads, setSquads] = useState<TeamSquad[]>(() => {
    const saved = localStorage.getItem('flujo_crm_squads');
    return saved ? JSON.parse(saved) : initialSquads;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('flujo_crm_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [trash, setTrash] = useState<TrashItem[]>(() => {
    const saved = localStorage.getItem('flujo_crm_trash');
    return saved ? JSON.parse(saved) : initialTrash;
  });

  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    const saved = localStorage.getItem('flujo_crm_widgets');
    return saved ? JSON.parse(saved) : initialWidgets;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('flujo_crm_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('flujo_crm_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('flujo_crm_portfolios', JSON.stringify(portfolios));
  }, [portfolios]);

  useEffect(() => {
    localStorage.setItem('flujo_crm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('flujo_crm_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('flujo_crm_members', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('flujo_crm_squads', JSON.stringify(squads));
  }, [squads]);

  useEffect(() => {
    localStorage.setItem('flujo_crm_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('flujo_crm_trash', JSON.stringify(trash));
  }, [trash]);

  useEffect(() => {
    localStorage.setItem('flujo_crm_widgets', JSON.stringify(widgets));
  }, [widgets]);

  useEffect(() => {
    localStorage.setItem('flujo_crm_profile', JSON.stringify(profile));
  }, [profile]);

  // Recalculate member hours and project task stats
  const syncDerivedStats = () => {
    // Sync project task counters
    setProjects(prevProjects =>
      prevProjects.map(proj => {
        const projectTasks = tasks.filter(t => t.projectId === proj.id);
        const completed = projectTasks.filter(t => t.completed || t.status === 'completado').length;
        return {
          ...proj,
          tasksCount: projectTasks.length,
          completedTasksCount: completed,
        };
      })
    );
  };

  useEffect(() => {
    syncDerivedStats();
  }, [tasks.length]);

  // Actions
  const addProject = (p: Omit<Project, 'id' | 'createdAt'>) => {
    const id = `proj-${Date.now()}`;
    const newProject: Project = {
      ...p,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      tasksCount: 0,
      completedTasksCount: 0,
    };
    setProjects(prev => [newProject, ...prev]);
    addNotification({
      title: 'Nuevo Proyecto Creado',
      message: `Se inició el proyecto "${newProject.name}" con avance inicial de ${newProject.progress}%.`,
      type: 'avance',
      read: false,
      projectId: id,
      actorName: profile.name,
    });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          if (updates.progress !== undefined && updates.progress !== p.progress) {
            addNotification({
              title: 'Avance de Proyecto Actualizado',
              message: `El proyecto "${p.name}" actualizó su avance al ${updates.progress}%.`,
              type: 'avance',
              read: false,
              projectId: id,
              actorName: profile.name,
            });
          }
          return updated;
        }
        return p;
      })
    );
  };

  const deleteProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    setProjects(prev => prev.filter(p => p.id !== id));
    setTrash(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        type: 'proyecto',
        title: project.name,
        deletedAt: new Date().toLocaleString('es-CL'),
        data: project,
      },
      ...prev,
    ]);
  };

  const addPortfolio = (p: Omit<Portfolio, 'id' | 'createdAt'>) => {
    const id = `port-${Date.now()}`;
    const newPort: Portfolio = {
      ...p,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPortfolios(prev => [newPort, ...prev]);
  };

  const updatePortfolio = (id: string, updates: Partial<Portfolio>) => {
    setPortfolios(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePortfolio = (id: string) => {
    const port = portfolios.find(p => p.id === id);
    if (!port) return;
    setPortfolios(prev => prev.filter(p => p.id !== id));
    setTrash(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        type: 'portafolio',
        title: port.name,
        deletedAt: new Date().toLocaleString('es-CL'),
        data: port,
      },
      ...prev,
    ]);
  };

  const addTask = (t: Omit<Task, 'id' | 'createdAt'>) => {
    const id = `tsk-${Date.now()}`;
    const newTask: Task = {
      ...t,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks(prev => [newTask, ...prev]);

    // Update member assigned hours
    if (newTask.assigneeId) {
      setTeamMembers(prev =>
        prev.map(m =>
          m.id === newTask.assigneeId
            ? { ...m, assignedHours: m.assignedHours + (newTask.estimatedHours || 4) }
            : m
        )
      );
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const completed = updates.status === 'completado' ? true : updates.completed ?? t.completed;
          return { ...t, ...updates, completed };
        }
        return t;
      })
    );
  };

  const moveTaskStatus = (taskId: string, newStatus: KanbanColumn) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const completed = newStatus === 'completado';
          return { ...t, status: newStatus, completed };
        }
        return t;
      })
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map(s =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    setTasks(prev => prev.filter(t => t.id !== id));
    setTrash(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        type: 'tarea',
        title: task.title,
        deletedAt: new Date().toLocaleString('es-CL'),
        data: task,
      },
      ...prev,
    ]);
  };

  const addNote = (n: Omit<Note, 'id' | 'updatedAt'>) => {
    const newNote: Note = {
      ...n,
      id: `note-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      )
    );
  };

  const deleteNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    setNotes(prev => prev.filter(n => n.id !== id));
    setTrash(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        type: 'nota',
        title: note.title,
        deletedAt: new Date().toLocaleString('es-CL'),
        data: note,
      },
      ...prev,
    ]);
  };

  const useTemplate = (tpl: Template, customName?: string) => {
    const projId = `proj-${Date.now()}`;
    const defaultPortfolio = portfolios[0] || initialPortfolios[0];
    const newProj: Project = {
      id: projId,
      name: customName || `Proyecto: ${tpl.name}`,
      description: tpl.description,
      portfolioId: defaultPortfolio.id,
      portfolioName: defaultPortfolio.name,
      client: 'Cliente Estratégico',
      leaderId: profile.id,
      leaderName: profile.name,
      leaderAvatar: profile.avatar,
      teamIds: [profile.id],
      status: 'planificacion',
      health: 'saludable',
      priority: 'alta',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: new Date(Date.now() + tpl.estimatedDays * 86400000).toISOString().split('T')[0],
      budget: 20000,
      spent: 0,
      category: tpl.category,
      color: tpl.color,
      tasksCount: tpl.defaultTasks.length,
      completedTasksCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const newTasks: Task[] = tpl.defaultTasks.map((t, idx) => ({
      id: `tsk-${Date.now()}-${idx}`,
      title: t.title,
      projectId: projId,
      projectName: newProj.name,
      assigneeId: profile.id,
      assigneeName: profile.name,
      assigneeAvatar: profile.avatar,
      status: 'por_hacer',
      priority: t.priority,
      dueDate: new Date(Date.now() + (idx + 2) * 86400000 * 3).toISOString().split('T')[0],
      estimatedHours: t.estimatedHours,
      loggedHours: 0,
      completed: false,
      subtasks: [],
      tags: [tpl.category.split(' ')[0]],
      createdAt: new Date().toISOString().split('T')[0],
    }));

    setProjects(prev => [newProj, ...prev]);
    setTasks(prev => [...newTasks, ...prev]);
    addNotification({
      title: 'Plantilla Instanciada con Éxito',
      message: `Se creó el proyecto "${newProj.name}" con ${newTasks.length} tareas preconfiguradas.`,
      type: 'sistema',
      read: false,
      projectId: projId,
      actorName: profile.name,
    });
    setActiveSection('proyectos');
  };

  const addTeamMember = (m: Omit<TeamMember, 'id'>) => {
    const id = `usr-${Date.now()}`;
    const newMember: TeamMember = {
      ...m,
      id,
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (n: Omit<NotificationItem, 'id' | 'timestamp'>) => {
    const newNotif: NotificationItem = {
      ...n,
      id: `notif-${Date.now()}`,
      timestamp: 'Ahora',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const restoreTrashItem = (trashId: string) => {
    const item = trash.find(t => t.id === trashId);
    if (!item) return;

    if (item.type === 'proyecto') {
      setProjects(prev => [item.data, ...prev]);
    } else if (item.type === 'tarea') {
      setTasks(prev => [item.data, ...prev]);
    } else if (item.type === 'nota') {
      setNotes(prev => [item.data, ...prev]);
    } else if (item.type === 'portafolio') {
      setPortfolios(prev => [item.data, ...prev]);
    }

    setTrash(prev => prev.filter(t => t.id !== trashId));
    addNotification({
      title: 'Elemento Restaurado',
      message: `Se restauró "${item.title}" desde la papelera.`,
      type: 'sistema',
      read: false,
      actorName: profile.name,
    });
  };

  const deleteTrashItemPermanently = (trashId: string) => {
    setTrash(prev => prev.filter(t => t.id !== trashId));
  };

  const emptyTrash = () => {
    setTrash([]);
  };

  const updateWidgetConfig = (newWidgets: WidgetConfig[]) => {
    setWidgets(newWidgets);
  };

  const resetWidgets = () => {
    setWidgets(initialWidgets);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const resetAllDataToDefault = () => {
    localStorage.clear();
    setProjects(initialProjects);
    setPortfolios(initialPortfolios);
    setTasks(initialTasks);
    setNotes(initialNotes);
    setTeamMembers(initialTeamMembers);
    setSquads(initialSquads);
    setNotifications(initialNotifications);
    setTrash(initialTrash);
    setWidgets(initialWidgets);
    setProfile(initialProfile);
  };

  return (
    <CRMContext.Provider
      value={{
        activeSection,
        setActiveSection,
        sidebarCollapsed,
        setSidebarCollapsed,
        projects,
        portfolios,
        tasks,
        notes,
        templates,
        teamMembers,
        squads,
        notifications,
        trash,
        widgets,
        profile,
        searchOpen,
        setSearchOpen,
        createModalOpen,
        setCreateModalOpen,
        createModalType,
        setCreateModalType,
        selectedProjectId,
        setSelectedProjectId,
        editWidgetsOpen,
        setEditWidgetsOpen,
        addProject,
        updateProject,
        deleteProject,
        addPortfolio,
        updatePortfolio,
        deletePortfolio,
        addTask,
        updateTask,
        moveTaskStatus,
        toggleSubtask,
        deleteTask,
        addNote,
        updateNote,
        deleteNote,
        useTemplate,
        addTeamMember,
        updateTeamMember,
        markNotificationRead,
        markAllNotificationsRead,
        clearAllNotifications,
        addNotification,
        restoreTrashItem,
        deleteTrashItemPermanently,
        emptyTrash,
        updateWidgetConfig,
        resetWidgets,
        updateProfile,
        resetAllDataToDefault,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
