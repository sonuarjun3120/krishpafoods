
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Moon, Sun, LogOut, Menu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  sidebarCollapsed,
  onToggleSidebar
}) => {
  const { toast } = useToast();

  const handleNotifications = () => {
    toast({
      title: "Notifications",
      description: "You have 3 new orders and 1 low stock alert",
    });
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            E-commerce Admin Dashboard
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNotifications}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDarkMode}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
