import React from 'react';
import { 
  Trash2, 
  RotateCcw, 
  AlertTriangle, 
  Briefcase, 
  CheckSquare, 
  StickyNote, 
  FolderKanban 
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { TrashItem } from '../../types/crm';

export const TrashSection: React.FC = () => {
  const { 
    trash, 
    restoreTrashItem, 
    deleteTrashItemPermanently, 
    emptyTrash 
  } = useCRM();

  const handleEmpty = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar toda la papelera? Esta acción no se puede deshacer.')) {
      emptyTrash();
    }
  };

  const getItemIcon = (type: TrashItem['type']) => {
    switch (type) {
      case 'proyecto': return <Briefcase className="w-4 h-4 text-sky-600" />;
      case 'tarea': return <CheckSquare className="w-4 h-4 text-emerald-600" />;
      case 'nota': return <StickyNote className="w-4 h-4 text-purple-600" />;
      case 'portafolio': return <FolderKanban className="w-4 h-4 text-amber-600" />;
      default: return <Trash2 className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Papelera de Reciclaje
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Recupera elementos eliminados accidentalmente o límpialos de forma definitiva.
          </p>
        </div>

        {trash.length > 0 && (
          <button
            onClick={handleEmpty}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Vaciar Papelera ({trash.length})
          </button>
        )}
      </div>

      {/* Trash List */}
      <div className="space-y-3">
        {trash.map(item => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                {getItemIcon(item.type)}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                    {item.type}
                  </span>
                  <h4 className="text-xs font-bold text-zinc-900 truncate">
                    {item.title}
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                  Eliminado el {item.deletedAt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => restoreTrashItem(item.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-900 text-white hover:bg-black transition-all shadow-2xs active:scale-[0.98]"
              >
                <RotateCcw className="w-3 h-3" />
                Restaurar
              </button>

              <button
                onClick={() => deleteTrashItemPermanently(item.id)}
                className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Eliminar permanentemente"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {trash.length === 0 && (
          <div className="py-20 text-center text-zinc-400 text-xs bg-white rounded-3xl border border-dashed border-zinc-200">
            <Trash2 className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            La papelera está vacía.
          </div>
        )}
      </div>
    </div>
  );
};
