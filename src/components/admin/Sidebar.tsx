
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  FileText, 
  FolderTree, 
  Image,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  User
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
  onToggleCollapse,
}) => {
  const menuItems = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as AdminSection, label: 'Products', icon: Package },
    { id: 'categories' as AdminSection, label: 'Categories', icon: FolderTree },
    { id: 'orders' as AdminSection, label: 'Orders', icon: ShoppingCart },
    { id: 'analytics' as AdminSection, label: 'Analytics', icon: BarChart3 },
    { id: 'users' as AdminSection, label: 'Users', icon: Users },
    { id: 'media' as AdminSection, label: 'Media', icon: Image },
    { id: 'pages' as AdminSection, label: 'Pages', icon: FileText },
    { id: 'user-settings' as AdminSection, label: 'User Settings', icon: User },
    { id: 'settings' as AdminSection, label: 'Admin Settings', icon: Settings },
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-1 h-8 w-8"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? 'default' : 'ghost'}
              className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-4'}`}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};
