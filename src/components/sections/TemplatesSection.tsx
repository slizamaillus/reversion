import React, { useState } from 'react';
import { 
  FileCode, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  Layers,
  Plus
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Template } from '../../types/crm';

export const TemplatesSection: React.FC = () => {
  const { templates, useTemplate } = useCRM();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(templates[0] || null);
  const [customName, setCustomName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUse = (tpl: Template) => {
    useTemplate(tpl, customName.trim() || undefined);
    setCopiedId(tpl.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Catálogo de Plantillas
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Metodologías operativas probadas con tareas, estimaciones y fases predeterminadas.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 bg-zinc-100 px-3.5 py-2 rounded-xl">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Generación instantánea en 1 click</span>
        </div>
      </div>

      {/* Main Grid: Template Cards + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates list (2 cols) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {templates.map(tpl => {
            const isSelected = selectedTemplate?.id === tpl.id;
            const totalHours = tpl.defaultTasks.reduce((acc, t) => acc + t.estimatedHours, 0);

            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected 
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-md ring-2 ring-zinc-900/10' 
                    : 'bg-white text-zinc-900 border-zinc-200/80 hover:border-zinc-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      {tpl.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-mono opacity-80">
                      <Clock className="w-3 h-3" />
                      <span>{tpl.estimatedDays} días</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold tracking-tight leading-snug">
                    {tpl.name}
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    {tpl.description}
                  </p>
                </div>

                <div className={`pt-3 border-t flex items-center justify-between text-xs ${
                  isSelected ? 'border-zinc-800' : 'border-zinc-100'
                }`}>
                  <span className="font-mono text-[11px] opacity-80">
                    {tpl.defaultTasks.length} tareas ({totalHours}h)
                  </span>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleUse(tpl);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                      isSelected 
                        ? 'bg-white text-zinc-900 hover:bg-zinc-100 shadow-sm' 
                        : 'bg-zinc-900 text-white hover:bg-black'
                    }`}
                  >
                    {copiedId === tpl.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Usar Plantilla</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Preview Panel (1 col) */}
        {selectedTemplate && (
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                Vista Previa del Flujo
              </span>
              <h3 className="text-lg font-bold text-zinc-900 mt-2">
                {selectedTemplate.name}
              </h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                {selectedTemplate.description}
              </p>
            </div>

            {/* Config before launch */}
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-2">
              <label className="block text-xs font-bold text-zinc-700">
                Nombre para tu nuevo proyecto:
              </label>
              <input
                type="text"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder={`Ej: ${selectedTemplate.name} - Cliente Q4`}
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-900"
              />
            </div>

            {/* Preconfigured tasks list */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Tareas Preconfiguradas ({selectedTemplate.defaultTasks.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedTemplate.defaultTasks.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-xs flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[10px] text-zinc-400">0{idx + 1}</span>
                      <span className="font-medium text-zinc-800 truncate">{t.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 shrink-0 font-medium">
                      {t.estimatedHours}h
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch CTA */}
            <button
              onClick={() => handleUse(selectedTemplate)}
              className="w-full py-3 rounded-2xl bg-zinc-900 text-white hover:bg-black font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              <span>Instanciar y Abrir en Tablero</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
