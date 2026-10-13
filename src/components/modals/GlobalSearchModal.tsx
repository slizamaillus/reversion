import React, { useState, useEffect } from 'react';
import { Search, X, Briefcase, CheckSquare, StickyNote, UserCheck, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const GlobalSearchModal: React.FC = () => {
  const { 
    searchOpen, 
    setSearchOpen, 
    projects, 
    tasks, 
    notes, 
    teamMembers,
    setSelectedProjectId,
    setActiveSection
  } = useCRM();

  const [query, setQuery] = useState('');

  // Handle ESC and Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredProjects = q ? projects.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.client.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  ) : projects.slice(0, 3);

  const filteredTasks = q ? tasks.filter(t => 
    t.title.toLowerCase().includes(q) || 
    (t.description && t.description.toLowerCase().includes(q)) ||
    (t.projectName && t.projectName.toLowerCase().includes(q))
  ) : tasks.slice(0, 3);

  const filteredNotes = q ? notes.filter(n => 
    n.title.toLowerCase().includes(q) || 
    n.content.toLowerCase().includes(q) ||
    n.tags.some(tag => tag.toLowerCase().includes(q))
  ) : notes.slice(0, 2);

  const filteredMembers = q ? teamMembers.filter(m => 
    m.name.toLowerCase().includes(q) || 
    m.role.toLowerCase().includes(q) ||
    m.email.toLowerCase().includes(q)
  ) : teamMembers.slice(0, 2);

  const totalResults = filteredProjects.length + filteredTasks.length + filteredNotes.length + filteredMembers.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-zinc-200/80 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar proyectos, avance, tareas, notas o miembros..."
            className="w-full text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center text-[10px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md font-mono border border-zinc-200">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {totalResults === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs">
              No se encontraron coincidencias para "{query}".
            </div>
          ) : (
            <>
              {/* Proyectos */}
              {filteredProjects.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 px-2 flex items-center justify-between">
                    <span>Proyectos ({filteredProjects.length})</span>
                    <button 
                      onClick={() => { setActiveSection('proyectos'); setSearchOpen(false); }}
                      className="text-zinc-500 hover:text-zinc-900 font-semibold lowercase text-[11px]"
                    >
                      ver todos
                    </button>
                  </div>
                  <div className="space-y-1">
                    {filteredProjects.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200/60 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                            <Briefcase className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-zinc-900 truncate">{p.name}</p>
                            <p className="text-[11px] text-zinc-400 truncate">{p.client} · {p.portfolioName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-bold font-mono text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded-full">
                            {p.progress}%
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tareas */}
              {filteredTasks.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 px-2 flex items-center justify-between">
                    <span>Tareas ({filteredTasks.length})</span>
                    <button 
                      onClick={() => { setActiveSection('mis_tareas'); setSearchOpen(false); }}
                      className="text-zinc-500 hover:text-zinc-900 font-semibold lowercase text-[11px]"
                    >
                      ver todas
                    </button>
                  </div>
                  <div className="space-y-1">
                    {filteredTasks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setActiveSection('mis_tareas');
                          setSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200/60 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                            <CheckSquare className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-zinc-900 truncate">{t.title}</p>
                            <p className="text-[11px] text-zinc-400 truncate">{t.projectName} · Asignado a {t.assigneeName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            t.priority === 'urgente' ? 'bg-rose-50 text-rose-700' :
                            t.priority === 'alta' ? 'bg-amber-50 text-amber-700' : 'bg-zinc-100 text-zinc-600'
                          }`}>
                            {t.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notas */}
              {filteredNotes.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 px-2 flex items-center justify-between">
                    <span>Notas ({filteredNotes.length})</span>
                    <button 
                      onClick={() => { setActiveSection('notas'); setSearchOpen(false); }}
                      className="text-zinc-500 hover:text-zinc-900 font-semibold lowercase text-[11px]"
                    >
                      ver notas
                    </button>
                  </div>
                  <div className="space-y-1">
                    {filteredNotes.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setActiveSection('notas');
                          setSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200/60 cursor-pointer transition-all text-left"
                      >
                        <div className="flex items-center gap-2">
                          <StickyNote className="w-3.5 h-3.5 text-zinc-400" />
                          <p className="text-xs font-semibold text-zinc-900 truncate">{n.title}</p>
                        </div>
                        <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">{n.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Miembros */}
              {filteredMembers.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 px-2 flex items-center justify-between">
                    <span>Equipo & Usuarios ({filteredMembers.length})</span>
                    <button 
                      onClick={() => { setActiveSection('usuarios'); setSearchOpen(false); }}
                      className="text-zinc-500 hover:text-zinc-900 font-semibold lowercase text-[11px]"
                    >
                      ver directorio
                    </button>
                  </div>
                  <div className="space-y-1">
                    {filteredMembers.map(m => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setActiveSection('usuarios');
                          setSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200/60 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full bg-zinc-100" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-zinc-900 truncate">{m.name}</p>
                            <p className="text-[11px] text-zinc-400 truncate">{m.role} · {m.department}</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono font-medium text-zinc-500">
                          {m.assignedHours}h / {m.weeklyCapacity}h
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-50/70 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 px-4">
          <span>Navega con flechas y presiona Enter para seleccionar</span>
          <div className="flex items-center gap-1">
            <span>Flujo CRM Inteligente</span>
          </div>
        </div>
      </div>
    </div>
  );
};
