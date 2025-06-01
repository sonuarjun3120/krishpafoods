
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  BarChart3,
  Users,
  Image,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AdminSection } from '@/pages/Admin';

interface SidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  isCollapsed,
  onToggleCollapse
}) => {
  const menuItems = [
    { id: 'dashboard' as AdminSection, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'products' as AdminSection, icon: Package, label: 'Products' },
    { id: 'categories' as AdminSection, icon: FolderTree, label: 'Categories' },
    { id: 'orders' as AdminSection, icon: ShoppingCart, label: 'Orders' },
    { id: 'analytics' as AdminSection, icon: BarChart3, label: 'Analytics' },
    { id: 'users' as AdminSection, icon: Users, label: 'Users' },
    { id: 'media' as AdminSection, icon: Image, label: 'Media' },
    { id: 'pages' as AdminSection, icon: FileText, label: 'Pages' },
    { id: 'settings' as AdminSection, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Button
                  variant={activeSection === item.id ? 'default' : 'ghost'}
                  className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-4'}`}
                  onClick={() => onSectionChange(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-2">{item.label}</span>}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
