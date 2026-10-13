import React from 'react';
import { X, Eye, EyeOff, ArrowUp, ArrowDown, RotateCcw, Check } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const EditWidgetsModal: React.FC = () => {
  const { 
    editWidgetsOpen, 
    setEditWidgetsOpen, 
    widgets, 
    updateWidgetConfig, 
    resetWidgets 
  } = useCRM();

  if (!editWidgetsOpen) return null;

  const toggleWidget = (id: string) => {
    const updated = widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w);
    updateWidgetConfig(updated);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newWidgets = [...widgets];
    const temp = newWidgets[index - 1];
    newWidgets[index - 1] = newWidgets[index];
    newWidgets[index] = temp;
    updateWidgetConfig(newWidgets.map((w, idx) => ({ ...w, order: idx + 1 })));
  };

  const moveDown = (index: number) => {
    if (index === widgets.length - 1) return;
    const newWidgets = [...widgets];
    const temp = newWidgets[index + 1];
    newWidgets[index + 1] = newWidgets[index];
    newWidgets[index] = temp;
    updateWidgetConfig(newWidgets.map((w, idx) => ({ ...w, order: idx + 1 })));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-zinc-200/80 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Personalizar Widgets del Dashboard</h3>
            <p className="text-xs text-zinc-400">Activa, desactiva o reordena los bloques a tu gusto</p>
          </div>
          <button
            onClick={() => setEditWidgetsOpen(false)}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-2 max-h-[60vh] overflow-y-auto">
          {widgets.map((widget, index) => (
            <div
              key={widget.id}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                widget.visible 
                  ? 'bg-zinc-50 border-zinc-200/80 text-zinc-900' 
                  : 'bg-zinc-100/40 border-dashed border-zinc-200 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleWidget(widget.id)}
                  className={`p-1.5 rounded-xl border transition-colors ${
                    widget.visible 
                      ? 'bg-zinc-900 border-zinc-900 text-white' 
                      : 'bg-white border-zinc-300 text-zinc-400'
                  }`}
                  title={widget.visible ? 'Ocultar widget' : 'Mostrar widget'}
                >
                  {widget.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <span className="text-xs font-semibold">{widget.title}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={index === 0}
                  onClick={() => moveUp(index)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-white disabled:opacity-30 disabled:pointer-events-none"
                  title="Mover arriba"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={index === widgets.length - 1}
                  onClick={() => moveDown(index)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-white disabled:opacity-30 disabled:pointer-events-none"
                  title="Mover abajo"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
          <button
            onClick={resetWidgets}
            className="flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-800"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restablecer por defecto
          </button>

          <button
            onClick={() => setEditWidgetsOpen(false)}
            className="px-4 py-2 text-xs font-semibold bg-zinc-900 text-white hover:bg-black rounded-xl transition-all shadow-sm"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
