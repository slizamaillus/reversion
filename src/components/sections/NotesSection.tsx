import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Pin, 
  PinOff, 
  Trash2, 
  Tag, 
  StickyNote, 
  Palette,
  Check
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Note } from '../../types/crm';

export const NotesSection: React.FC = () => {
  const { 
    notes, 
    addNote, 
    updateNote, 
    deleteNote, 
    profile,
    setCreateModalOpen,
    setCreateModalType
  } = useCRM();

  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeNoteEdit, setActiveNoteEdit] = useState<string | null>(null);

  // Collect all unique tags
  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
                          n.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag === 'all' || n.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const pastelColors = [
    { label: 'Azul', hex: '#E0F2FE' },
    { label: 'Menta', hex: '#DCFCE7' },
    { label: 'Lavanda', hex: '#F3E8FF' },
    { label: 'Miel', hex: '#FEF3C7' },
    { label: 'Coral', hex: '#FFE4E6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Notas & Documentación Rápida
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Pizarra de acuerdos, minutas de proyectos, ideas y checklists operacionales.
          </p>
        </div>

        <button
          onClick={() => {
            setCreateModalType('nota');
            setCreateModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white hover:bg-black transition-all shadow-sm active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Nueva Nota
        </button>
      </div>

      {/* Toolbar: Search and Tag Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200/80">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar en notas por texto o concepto..."
            className="w-full text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
              selectedTag === 'all' 
                ? 'bg-zinc-900 text-white shadow-2xs' 
                : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Todas ({notes.length})
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                selectedTag === tag 
                  ? 'bg-zinc-900 text-white shadow-2xs' 
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNotes.map(note => {
          const isEditing = activeNoteEdit === note.id;

          return (
            <div
              key={note.id}
              className="p-5 rounded-3xl border border-zinc-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative group"
              style={{ backgroundColor: note.color || '#E0F2FE' }}
            >
              {/* Card Top */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-zinc-900 leading-snug">
                    {note.title}
                  </h3>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => updateNote(note.id, { pinned: !note.pinned })}
                      className={`p-1.5 rounded-lg transition-colors ${
                        note.pinned ? 'text-zinc-900 bg-white/70 shadow-2xs' : 'text-zinc-400 hover:text-zinc-800'
                      }`}
                      title={note.pinned ? 'Desfijar' : 'Fijar nota'}
                    >
                      {note.pinned ? <Pin className="w-3.5 h-3.5 fill-current" /> : <Pin className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 transition-colors"
                      title="Mover a papelera"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs text-zinc-700 whitespace-pre-line leading-relaxed">
                  {note.content}
                </p>
              </div>

              {/* Card Bottom: Tags and Color Selector */}
              <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-1 flex-wrap">
                  {note.tags.map(t => (
                    <span 
                      key={t}
                      className="text-[10px] font-semibold bg-white/80 text-zinc-800 px-2 py-0.5 rounded-md shadow-2xs"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Color swatches */}
                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  {pastelColors.map(c => (
                    <button
                      key={c.hex}
                      onClick={() => updateNote(note.id, { color: c.hex })}
                      className={`w-3.5 h-3.5 rounded-full border border-black/10 transition-transform ${
                        note.color === c.hex ? 'scale-125 ring-1 ring-zinc-800' : ''
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {filteredNotes.length === 0 && (
          <div className="col-span-full py-16 text-center text-zinc-400 text-xs bg-white rounded-3xl border border-dashed border-zinc-200">
            No se encontraron notas con el criterio de búsqueda.
          </div>
        )}
      </div>
    </div>
  );
};
