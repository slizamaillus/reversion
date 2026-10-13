import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Shield, 
  Bell, 
  RotateCcw, 
  Save, 
  Check,
  Award
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const ProfileSection: React.FC = () => {
  const { profile, updateProfile, resetAllDataToDefault, tasks, projects } = useCRM();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [role, setRole] = useState(profile.role);
  const [bio, setBio] = useState(profile.bio);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);
  const [capacity, setCapacity] = useState(profile.weeklyCapacity);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [notifProgress, setNotifProgress] = useState(profile.notificationsEnabled.projectProgress);
  const [notifOverload, setNotifOverload] = useState(profile.notificationsEnabled.overloadAlerts);
  const [notifAssigned, setNotifAssigned] = useState(profile.notificationsEnabled.taskAssigned);
  const [notifDigest, setNotifDigest] = useState(profile.notificationsEnabled.dailyDigest);

  const myProjects = projects.filter(p => p.leaderId === profile.id || p.teamIds.includes(profile.id));
  const myCompletedTasks = tasks.filter(t => t.assigneeId === profile.id && t.completed);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      role,
      bio,
      phone,
      location,
      weeklyCapacity: Number(capacity),
      notificationsEnabled: {
        projectProgress: notifProgress,
        overloadAlerts: notifOverload,
        taskAssigned: notifAssigned,
        dailyDigest: notifDigest,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetData = () => {
    if (window.confirm('¿Deseas restaurar todos los datos iniciales de demostración? Se reestablecerán proyectos, tareas y notas originales.')) {
      resetAllDataToDefault();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Perfil de Usuario & Preferencias
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configuración personal, asignación de horas de trabajo y notificaciones.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors"
          title="Restaura la base de datos de muestra"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restaurar Datos Iniciales
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <img 
            src={profile.avatar} 
            alt={profile.name} 
            className="w-24 h-24 rounded-3xl border-2 border-indigo-100 shadow-sm bg-white"
          />
          <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 border-2 border-white rounded-full" />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">{profile.name}</h3>
              <p className="text-xs text-zinc-400 font-medium">{profile.role} · {profile.department}</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 self-center sm:self-auto">
              Lead Admin & PM
            </span>
          </div>

          <p className="text-xs text-zinc-600 pt-2 leading-relaxed max-w-xl">
            {profile.bio}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3 text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {profile.timezone}</span>
          </div>
        </div>
      </div>

      {/* Metrics Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 text-center">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Proyectos Liderados</span>
          <div className="text-2xl font-black font-mono text-zinc-900 mt-1">{myProjects.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 text-center">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tareas Finalizadas</span>
          <div className="text-2xl font-black font-mono text-emerald-600 mt-1">{myCompletedTasks.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 text-center">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Capacidad Semanal</span>
          <div className="text-2xl font-black font-mono text-zinc-900 mt-1">{profile.weeklyCapacity}h</div>
        </div>
      </div>

      {/* Form Settings */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 space-y-6">
        <h3 className="text-sm font-bold text-zinc-900 pb-2 border-b border-zinc-100">
          Información Personal & Parámetros
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">Nombre Completo</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">Cargo / Rol</label>
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">Teléfono</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">Ubicación</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">Capacidad Semanal (Horas)</label>
            <input
              type="number"
              value={capacity}
              onChange={e => setCapacity(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Biografía Profesional</label>
          <textarea
            rows={2}
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-900 resize-none"
          />
        </div>

        {/* Notifications Checkboxes */}
        <div className="pt-4 border-t border-zinc-100 space-y-3">
          <h4 className="text-xs font-bold text-zinc-700">Preferencias de Alertas & Notificaciones</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-100 cursor-pointer">
              <input
                type="checkbox"
                checked={notifProgress}
                onChange={e => setNotifProgress(e.target.checked)}
                className="w-4 h-4 accent-zinc-900 rounded"
              />
              <span className="font-medium text-zinc-800">Alertas de actualización de avance de proyectos</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-100 cursor-pointer">
              <input
                type="checkbox"
                checked={notifOverload}
                onChange={e => setNotifOverload(e.target.checked)}
                className="w-4 h-4 accent-zinc-900 rounded"
              />
              <span className="font-medium text-zinc-800">Avisos de sobrecarga de horas de equipo</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-100 cursor-pointer">
              <input
                type="checkbox"
                checked={notifAssigned}
                onChange={e => setNotifAssigned(e.target.checked)}
                className="w-4 h-4 accent-zinc-900 rounded"
              />
              <span className="font-medium text-zinc-800">Notificarme cuando se me asigne una nueva tarea</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-100 cursor-pointer">
              <input
                type="checkbox"
                checked={notifDigest}
                onChange={e => setNotifDigest(e.target.checked)}
                className="w-4 h-4 accent-zinc-900 rounded"
              />
              <span className="font-medium text-zinc-800">Resumen matutino de entregas del día</span>
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 flex items-center justify-end gap-3">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
              <Check className="w-4 h-4" /> Cambios guardados correctamente
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold bg-zinc-900 text-white hover:bg-black rounded-xl transition-all shadow-sm active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            Guardar Preferencias
          </button>
        </div>
      </form>
    </div>
  );
};
