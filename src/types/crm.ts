export type Priority = 'baja' | 'media' | 'alta' | 'urgente';
export type ProjectStatus = 'planificacion' | 'en_progreso' | 'revision' | 'completado' | 'pausado';
export type HealthStatus = 'saludable' | 'atencion' | 'critico';
export type KanbanColumn = 'por_hacer' | 'en_progreso' | 'en_revision' | 'completado';

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  projectName?: string;
  assigneeId: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  status: KanbanColumn;
  priority: Priority;
  dueDate: string;
  estimatedHours: number;
  loggedHours: number;
  completed: boolean;
  subtasks: { id: string; title: string; completed: boolean }[];
  tags: string[];
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  portfolioId: string;
  portfolioName?: string;
  client: string;
  leaderId: string;
  leaderName?: string;
  leaderAvatar?: string;
  teamIds: string[];
  status: ProjectStatus;
  health: HealthStatus;
  priority: Priority;
  progress: number; // 0 - 100%
  startDate: string;
  targetDate: string;
  budget: number; // USD / CLP
  spent: number;
  category: string;
  color: string; // Pastel accent
  tasksCount?: number;
  completedTasksCount?: number;
  createdAt: string;
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  targetBudget: number;
  spentBudget: number;
  health: HealthStatus;
  color: string;
  strategicObjective: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string; // Pastel bg
  tags: string[];
  pinned: boolean;
  authorId: string;
  authorName: string;
  relatedProjectId?: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedDays: number;
  defaultTasks: { title: string; priority: Priority; estimatedHours: number }[];
  color: string;
  recommendedRole: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  weeklyCapacity: number; // Default 40h
  assignedHours: number;
  status: 'activo' | 'ausente' | 'vacaciones';
  skills: string[];
  projectsCount: number;
}

export interface TeamSquad {
  id: string;
  name: string;
  description: string;
  leadId: string;
  leadName: string;
  memberIds: string[];
  color: string;
  focusArea: string;
  currentQuarterGoal: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'avance' | 'tarea' | 'presupuesto' | 'mencion' | 'sistema';
  read: boolean;
  timestamp: string;
  projectId?: string;
  taskId?: string;
  actorName: string;
  actorAvatar?: string;
}

export interface TrashItem {
  id: string;
  originalId: string;
  type: 'proyecto' | 'tarea' | 'nota' | 'portafolio';
  title: string;
  deletedAt: string;
  data: any;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  bio: string;
  phone: string;
  location: string;
  timezone: string;
  weeklyCapacity: number;
  notificationsEnabled: {
    projectProgress: boolean;
    overloadAlerts: boolean;
    taskAssigned: boolean;
    dailyDigest: boolean;
  };
  skills: string[];
}

export interface WidgetConfig {
  id: string;
  title: string;
  visible: boolean;
  order: number;
}
