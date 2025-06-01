
import React, { useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import { ProductManagement } from '@/components/admin/ProductManagement';
import { CategoryManagement } from '@/components/admin/CategoryManagement';
import { OrderManagement } from '@/components/admin/OrderManagement';
import { SalesAnalytics } from '@/components/admin/SalesAnalytics';
import { UserManagement } from '@/components/admin/UserManagement';
import { MediaManagement } from '@/components/admin/MediaManagement';
import { PageContentManagement } from '@/components/admin/PageContentManagement';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminAuth } from '@/components/admin/AdminAuth';

export type AdminSection = 
  | 'dashboard' 
  | 'products' 
  | 'categories' 
  | 'orders' 
  | 'analytics' 
  | 'users' 
  | 'media' 
  | 'pages' 
  | 'settings';

const Admin = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isAuthenticated) {
    return <AdminAuth onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'analytics':
        return <SalesAnalytics />;
      case 'users':
        return <UserManagement />;
      case 'media':
        return <MediaManagement />;
      case 'pages':
        return <PageContentManagement />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className={`min-h-screen flex w-full ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <Header
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onLogout={() => setIsAuthenticated(false)}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          
          <main className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Admin;
