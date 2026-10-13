/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { CreateModal } from './components/modals/CreateModal';
import { ProjectDetailModal } from './components/modals/ProjectDetailModal';
import { EditWidgetsModal } from './components/modals/EditWidgetsModal';

import { DashboardSection } from './components/sections/DashboardSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { PortfoliosSection } from './components/sections/PortfoliosSection';
import { NotesSection } from './components/sections/NotesSection';
import { TemplatesSection } from './components/sections/TemplatesSection';
import { TeamsSection } from './components/sections/TeamsSection';
import { WorkloadSection } from './components/sections/WorkloadSection';
import { MyTasksSection } from './components/sections/MyTasksSection';
import { CalendarSection } from './components/sections/CalendarSection';
import { NotificationsSection } from './components/sections/NotificationsSection';
import { UsersSection } from './components/sections/UsersSection';
import { TrashSection } from './components/sections/TrashSection';
import { ProfileSection } from './components/sections/ProfileSection';

const MainContent: React.FC = () => {
  const { activeSection, sidebarCollapsed } = useCRM();

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'proyectos':
        return <ProjectsSection />;
      case 'portafolios':
        return <PortfoliosSection />;
      case 'notas':
        return <NotesSection />;
      case 'plantillas':
        return <TemplatesSection />;
      case 'equipos':
        return <TeamsSection />;
      case 'carga_trabajo':
        return <WorkloadSection />;
      case 'mis_tareas':
        return <MyTasksSection />;
      case 'calendario':
        return <CalendarSection />;
      case 'notificaciones':
        return <NotificationsSection />;
      case 'usuarios':
        return <UsersSection />;
      case 'papelera':
        return <TrashSection />;
      case 'perfil':
        return <ProfileSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-zinc-900 flex flex-col selection:bg-zinc-900 selection:text-white">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Top Utility Bar */}
      <TopBar />

      {/* Viewport Content */}
      <main
        className={`flex-1 p-6 md:p-8 max-w-7xl w-full transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {renderActiveSection()}
      </main>

      {/* Modals & Dialogs */}
      <GlobalSearchModal />
      <CreateModal />
      <ProjectDetailModal />
      <EditWidgetsModal />
    </div>
  );
};

export default function App() {
  return (
    <CRMProvider>
      <MainContent />
    </CRMProvider>
  );
}
