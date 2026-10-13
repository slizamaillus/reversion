import React, { useState } from 'react';
import { X, Briefcase, CheckSquare, FolderPlus, StickyNote, UserPlus, Sparkles } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Priority, HealthStatus, ProjectStatus } from '../../types/crm';

export const CreateModal: React.FC = () => {
  const { 
    createModalOpen, 
    setCreateModalOpen, 
    createModalType, 
    setCreateModalType,
    projects,
    portfolios,
    teamMembers,
    addProject,
    addTask,
    addPortfolio,
    addNote,
    addTeamMember,
    profile
  } = useCRM();

  // Project form state
  const [projName, setProjName] = useState('');
  const [projClient, setProjClient] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projPortfolio, setProjPortfolio] = useState(portfolios[0]?.id || '');
  const [projLeader, setProjLeader] = useState(profile.id);
  const [projBudget, setProjBudget] = useState('25000');
  const [projTargetDate, setProjTargetDate] = useState('2026-12-15');
  const [projPriority, setProjPriority] = useState<Priority>('alta');
  const [projHealth, setProjHealth] = useState<HealthStatus>('saludable');
  const [projProgress, setProjProgress] = useState(15);
  const [projColor, setProjColor] = useState('#E0F2FE');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskProject, setTaskProject] = useState(projects[0]?.id || '');
  const [taskAssignee, setTaskAssignee] = useState(profile.id);
  const [taskPriority, setTaskPriority] = useState<Priority>('media');
  const [taskDueDate, setTaskDueDate] = useState('2026-10-25');
  const [taskHours, setTaskHours] = useState('8');
  const [taskTags, setTaskTags] = useState('Frontend, UI');

  // Portfolio form state
  const [portName, setPortName] = useState('');
  const [portDesc, setPortDesc] = useState('');
  const [portObjective, setPortObjective] = useState('');
  const [portBudget, setPortBudget] = useState('60000');
  const [portHealth, setPortHealth] = useState<HealthStatus>('saludable');

  // Note form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteColor, setNoteColor] = useState('#DCFCE7');
  const [noteTags, setNoteTags] = useState('Estrategia, Q4');
  const [notePinned, setNotePinned] = useState(false);

  // User form state
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('Senior UI/UX Designer');
  const [userDept, setUserDept] = useState('Diseño');
  const [userCapacity, setUserCapacity] = useState('40');
  const [userSkills, setUserSkills] = useState('Figma, Design Systems, React');

  if (!createModalOpen) return null;

  const pastelColors = [
    { label: 'Azul Celeste', hex: '#E0F2FE' },
    { label: 'Menta', hex: '#DCFCE7' },
    { label: 'Lavanda', hex: '#F3E8FF' },
    { label: 'Miel Ámbar', hex: '#FEF3C7' },
    { label: 'Coral Rosado', hex: '#FFE4E6' },
    { label: 'Índigo', hex: '#E0E7FF' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (createModalType === 'proyecto') {
      if (!projName.trim()) return;
      const selectedPort = portfolios.find(p => p.id === projPortfolio);
      const selectedLeader = teamMembers.find(m => m.id === projLeader);

      addProject({
        name: projName,
        description: projDesc || 'Sin descripción detallada.',
        portfolioId: projPortfolio || portfolios[0]?.id || 'port-1',
        portfolioName: selectedPort?.name || 'Portafolio General',
        client: projClient || 'Cliente Confidencial',
        leaderId: projLeader,
        leaderName: selectedLeader?.name || profile.name,
        leaderAvatar: selectedLeader?.avatar || profile.avatar,
        teamIds: [projLeader],
        status: 'en_progreso' as ProjectStatus,
        health: projHealth,
        priority: projPriority,
        progress: Number(projProgress) || 0,
        startDate: new Date().toISOString().split('T')[0],
        targetDate: projTargetDate || '2026-12-31',
        budget: Number(projBudget) || 20000,
        spent: 0,
        category: 'Desarrollo Digital',
        color: projColor,
      });
    } else if (createModalType === 'tarea') {
      if (!taskTitle.trim()) return;
      const selectedProj = projects.find(p => p.id === taskProject);
      const selectedAssignee = teamMembers.find(m => m.id === taskAssignee);

      addTask({
        title: taskTitle,
        description: taskDesc,
        projectId: taskProject || projects[0]?.id || 'proj-1',
        projectName: selectedProj?.name || 'Proyecto Principal',
        assigneeId: taskAssignee || profile.id,
        assigneeName: selectedAssignee?.name || profile.name,
        assigneeAvatar: selectedAssignee?.avatar || profile.avatar,
        status: 'por_hacer',
        priority: taskPriority,
        dueDate: taskDueDate || '2026-10-31',
        estimatedHours: Number(taskHours) || 8,
        loggedHours: 0,
        completed: false,
        subtasks: [
          { id: `sub-${Date.now()}-1`, title: 'Revisión inicial de requerimientos', completed: false }
        ],
        tags: taskTags.split(',').map(t => t.trim()).filter(Boolean),
      });
    } else if (createModalType === 'portafolio') {
      if (!portName.trim()) return;
      addPortfolio({
        name: portName,
        description: portDesc || 'Portafolio corporativo estratégico.',
        ownerId: profile.id,
        ownerName: profile.name,
        targetBudget: Number(portBudget) || 50000,
        spentBudget: 0,
        health: portHealth,
        color: '#E0E7FF',
        strategicObjective: portObjective || 'Lograr excelencia operacional en Q4.',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '2026-12-31',
      });
    } else if (createModalType === 'nota') {
      if (!noteTitle.trim()) return;
      addNote({
        title: noteTitle,
        content: noteContent || 'Contenido de la nota...',
        color: noteColor,
        tags: noteTags.split(',').map(t => t.trim()).filter(Boolean),
        pinned: notePinned,
        authorId: profile.id,
        authorName: profile.name,
      });
    } else if (createModalType === 'usuario') {
      if (!userName.trim() || !userEmail.trim()) return;
      addTeamMember({
        name: userName,
        email: userEmail,
        role: userRole,
        department: userDept,
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${userName.toLowerCase().replace(/\s/g, '')}&backgroundColor=e0f2fe`,
        weeklyCapacity: Number(userCapacity) || 40,
        assignedHours: 0,
        status: 'activo',
        skills: userSkills.split(',').map(s => s.trim()).filter(Boolean),
        projectsCount: 0,
      });
    }

    setCreateModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-zinc-200/80 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Type Tabs */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100/90 rounded-2xl overflow-x-auto max-w-[85%]">
            <button
              type="button"
              onClick={() => setCreateModalType('proyecto')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                createModalType === 'proyecto' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Proyecto
            </button>
            <button
              type="button"
              onClick={() => setCreateModalType('tarea')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                createModalType === 'tarea' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Tarea
            </button>
            <button
              type="button"
              onClick={() => setCreateModalType('portafolio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                createModalType === 'portafolio' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <FolderPlus className="w-3.5 h-3.5" />
              Portafolio
            </button>
            <button
              type="button"
              onClick={() => setCreateModalType('nota')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                createModalType === 'nota' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <StickyNote className="w-3.5 h-3.5" />
              Nota
            </button>
            <button
              type="button"
              onClick={() => setCreateModalType('usuario')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                createModalType === 'usuario' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Usuario
            </button>
          </div>

          <button
            onClick={() => setCreateModalOpen(false)}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* ================= PROYECTO ================= */}
          {createModalType === 'proyecto' && (
            <>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Nombre del Proyecto *</label>
                <input
                  type="text"
                  required
                  value={projName}
                  onChange={e => setProjName(e.target.value)}
                  placeholder="Ej: Rediseño App Móvil Clientes VIP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Cliente / Cuenta</label>
                  <input
                    type="text"
                    value={projClient}
                    onChange={e => setProjClient(e.target.value)}
                    placeholder="Ej: Banco Santander Tech"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Portafolio Asignado</label>
                  <select
                    value={projPortfolio}
                    onChange={e => setProjPortfolio(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900 bg-white"
                  >
                    {portfolios.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Descripción y Alcance</label>
                <textarea
                  rows={2}
                  value={projDesc}
                  onChange={e => setProjDesc(e.target.value)}
                  placeholder="Detalles clave, requerimientos y objetivo del proyecto..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Presupuesto (USD)</label>
                  <input
                    type="number"
                    value={projBudget}
                    onChange={e => setProjBudget(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Fecha Entrega</label>
                  <input
                    type="date"
                    value={projTargetDate}
                    onChange={e => setProjTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Líder Proyecto</label>
                  <select
                    value={projLeader}
                    onChange={e => setProjLeader(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900 bg-white"
                  >
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Prioridad</label>
                  <select
                    value={projPriority}
                    onChange={e => setProjPriority(e.target.value as Priority)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900 bg-white"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Salud Inicial</label>
                  <select
                    value={projHealth}
                    onChange={e => setProjHealth(e.target.value as HealthStatus)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900 bg-white"
                  >
                    <option value="saludable">Saludable (A tiempo)</option>
                    <option value="atencion">Requiere Atención</option>
                    <option value="critico">Crítico / En riesgo</option>
                  </select>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-zinc-700">Avance Inicial</span>
                  <span className="text-xs font-bold font-mono text-zinc-900">{projProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={projProgress}
                  onChange={e => setProjProgress(Number(e.target.value))}
                  className="w-full accent-zinc-900 cursor-pointer"
                />
              </div>

              {/* Pastel accent picker */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Acento Cromático Pastel</label>
                <div className="flex items-center gap-2">
                  {pastelColors.map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setProjColor(c.hex)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        projColor === c.hex ? 'border-zinc-900 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ================= TAREA ================= */}
          {createModalType === 'tarea' && (
            <>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Título de la Tarea *</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="Ej: Crear prototipo de flujo de checkout en Figma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Proyecto Relacionado</label>
                  <select
                    value={taskProject}
                    onChange={e => setTaskProject(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900 bg-white"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Asignado a</label>
                  <select
                    value={taskAssignee}
                    onChange={e => setTaskAssignee(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900 bg-white"
                  >
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Prioridad</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as Priority)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900 bg-white"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Fecha Límite</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Horas Estimadas</label>
                  <input
                    type="number"
                    value={taskHours}
                    onChange={e => setTaskHours(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Etiquetas (separadas por coma)</label>
                <input
                  type="text"
                  value={taskTags}
                  onChange={e => setTaskTags(e.target.value)}
                  placeholder="UI, Figma, Q4"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Instrucciones o notas adicionales</label>
                <textarea
                  rows={2}
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  placeholder="Detalles sobre entregables y criterios de aceptación..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900 resize-none"
                />
              </div>
            </>
          )}

          {/* ================= PORTAFOLIO ================= */}
          {createModalType === 'portafolio' && (
            <>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Nombre del Portafolio *</label>
                <input
                  type="text"
                  required
                  value={portName}
                  onChange={e => setPortName(e.target.value)}
                  placeholder="Ej: Innovación en Inteligencia Artificial 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Objetivo Estratégico</label>
                <input
                  type="text"
                  value={portObjective}
                  onChange={e => setPortObjective(e.target.value)}
                  placeholder="Ej: Posicionar a la empresa como referente tecnológico en Latam"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Presupuesto Objetivo ($)</label>
                  <input
                    type="number"
                    value={portBudget}
                    onChange={e => setPortBudget(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Estado de Salud</label>
                  <select
                    value={portHealth}
                    onChange={e => setPortHealth(e.target.value as HealthStatus)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900 bg-white"
                  >
                    <option value="saludable">Saludable</option>
                    <option value="atencion">Atención</option>
                    <option value="critico">Crítico</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Descripción</label>
                <textarea
                  rows={2}
                  value={portDesc}
                  onChange={e => setPortDesc(e.target.value)}
                  placeholder="Alcance y programas que abarca este portafolio..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900 resize-none"
                />
              </div>
            </>
          )}

          {/* ================= NOTA ================= */}
          {createModalType === 'nota' && (
            <>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Título de la Nota *</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  placeholder="Ej: Minuta reunión con líderes de producto"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Contenido</label>
                <textarea
                  rows={4}
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  placeholder="Escribe las ideas, acuerdos o tareas pendientes..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900 resize-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Etiquetas</label>
                  <input
                    type="text"
                    value={noteTags}
                    onChange={e => setNoteTags(e.target.value)}
                    placeholder="Ideas, Reunión, Estrategia"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Color Pastel</label>
                  <div className="flex items-center gap-2 mt-1">
                    {pastelColors.map(c => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setNoteColor(c.hex)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          noteColor === c.hex ? 'border-zinc-900 scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="notePinned"
                  checked={notePinned}
                  onChange={e => setNotePinned(e.target.checked)}
                  className="w-4 h-4 rounded text-zinc-900 accent-zinc-900 cursor-pointer"
                />
                <label htmlFor="notePinned" className="text-xs font-medium text-zinc-700 cursor-pointer">
                  Fijar esta nota al inicio de la pizarra
                </label>
              </div>
            </>
          )}

          {/* ================= USUARIO ================= */}
          {createModalType === 'usuario' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder="Ej: Andrea Gómez"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                    placeholder="andrea.gomez@illus.cl"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Rol en el Equipo</label>
                  <input
                    type="text"
                    value={userRole}
                    onChange={e => setUserRole(e.target.value)}
                    placeholder="Senior UI Designer"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Departamento</label>
                  <select
                    value={userDept}
                    onChange={e => setUserDept(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900 bg-white"
                  >
                    <option value="Diseño">Diseño</option>
                    <option value="Ingeniería">Ingeniería</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operaciones">Operaciones</option>
                    <option value="Calidad">Calidad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">Capacidad Semanal (Hrs)</label>
                  <input
                    type="number"
                    value={userCapacity}
                    onChange={e => setUserCapacity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Habilidades clave</label>
                <input
                  type="text"
                  value={userSkills}
                  onChange={e => setUserSkills(e.target.value)}
                  placeholder="Figma, React, QA, Scrum"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>
            </>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white hover:bg-black transition-all shadow-sm active:scale-[0.98]"
            >
              Guardar y Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
