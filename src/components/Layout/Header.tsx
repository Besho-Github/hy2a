import React, { useState } from 'react';
import { Menu, Sun, Moon, User, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#000000] shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Hamburger + Title */}
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 lg:hidden p-2"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">فتح القائمة</span>
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-white ml-2">
              نظام ادارة المركبات
            </h1>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center text-sm rounded-full focus:outline-none"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <span className="sr-only">فتح قائمة المستخدم</span>
                <div className="h-8 w-8 rounded-full bg-[#333333] text-white flex items-center justify-center">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-8 w-8 rounded-full" 
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
                <span className="hidden md:block ml-2 text-sm font-medium text-white">
                  {user?.name}
                </span>
              </button>
              
              {/* Dropdown menu */}
              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 card-bg ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
                  </div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      الملف الشخصي
                    </div>
                  </a>
                  <button
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={logout}
                  >
                    <div className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      تسجيل الخروج
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;