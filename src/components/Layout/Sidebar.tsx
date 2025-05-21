import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  X, 
  LayoutDashboard, 
  Car, 
  Users, 
  CalendarClock, 
  Wrench, 
  Fuel, 
  FileText, 
  BarChart, 
  Settings,
  Home,
  AlertCircle,
  BarChart2,
  Calendar,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen || 
        sidebar.current.contains(target as Node) || 
        trigger.current.contains(target as Node)
      ) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  // Close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  const NavLinks = [
    { path: 'لوحة-التحكم', name: 'لوحة التحكم', icon: Home },
    { path: 'المركبات', name: 'المركبات', icon: Car },
    { path: 'السائقين', name: 'السائقين', icon: Users },
    { path: 'الرحلات', name: 'الرحلات', icon: Calendar },
    { path: 'الصيانة', name: 'الصيانة', icon: Wrench },
    { path: 'الوقود', name: 'الوقود', icon: Fuel },
    { path: 'المستندات', name: 'المستندات', icon: FileText },
  ];

  return (
    <>
      {/* Sidebar backdrop (mobile only) */}
      <div 
        className={`fixed inset-0 bg-gray-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar} 
        className={`fixed z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-72 lg:sidebar flex-shrink-0 bg-white dark:bg-black p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-8 pr-3 sm:px-2">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/hy2a.png" alt="شعار ادارة المركبات" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900 dark:text-white ml-2">ادارة المركبات</span>
          </div>
          
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">إغلاق القائمة</span>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages */}
          <div>
            <h3 className="text-xs uppercase text-gray-600 dark:text-gray-400 font-semibold pl-3 mb-3">
              القائمة الرئيسية
            </h3>
            <ul className="mt-3">
              {NavLinks.map((link, index) => (
                <li key={index} className="mb-1">
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition duration-150 ${
                        isActive
                          ? 'bg-gray-100 text-gray-900 dark:bg-[#101010] dark:text-white'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-[#101010]'
                      }`
                    }
                  >
                    <link.icon className="h-5 w-5 mr-2" />
                    <span>{link.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Tools */}
          <div>
            <h3 className="text-xs uppercase text-gray-600 dark:text-gray-400 font-semibold pl-3 mb-3">
              الأدوات
            </h3>
            <ul className="mt-3">
              <li className="mb-1">
                <NavLink
                  to="التقارير"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition duration-150 ${
                      isActive
                        ? 'bg-gray-100 text-gray-900 dark:bg-[#101010] dark:text-white'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-[#101010]'
                    }`
                  }
                >
                  <BarChart className="h-5 w-5 mr-2" />
                  <span>التقارير والتحليلات</span>
                </NavLink>
              </li>
              <li className="mb-1">
                <NavLink
                  to="الإعدادات"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition duration-150 ${
                      isActive
                        ? 'bg-gray-100 text-gray-900 dark:bg-[#101010] dark:text-white'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-[#101010]'
                    }`
                  }
                >
                  <Settings className="h-5 w-5 mr-2" />
                  <span>الإعدادات</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;