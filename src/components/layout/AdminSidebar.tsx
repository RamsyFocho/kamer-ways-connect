import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building, Map, Users } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/agencies', label: 'Agencies', icon: Building },
  { to: '/admin/routes', label: 'Routes', icon: Map },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/bookings', label: 'Bookings', icon: LayoutDashboard }, // Using LayoutDashboard for now, can be changed
];


const AdminSidebar: React.FC<{ mobileOpen?: boolean; onClose?: () => void }> = ({ mobileOpen = false, onClose }) => {
  const { actualTheme } = useTheme();
  // Sidebar for desktop, drawer for mobile
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex md:flex-col w-64 min-h-screen border-r bg-sidebar text-sidebar-foreground p-4"
        data-theme={actualTheme}
      >
        <nav className="space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg transition-colors font-medium text-base ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`
              }
              end
            >
              <Icon className="h-5 w-5 mr-3" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50 bg-sidebar text-sidebar-foreground border-r p-4 transition-transform duration-300 md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        data-theme={actualTheme}
        style={{ boxShadow: mobileOpen ? '0 0 0 100vw rgba(0,0,0,0.3)' : 'none' }}
      >
        <button className="mb-4 text-right w-full" onClick={onClose} aria-label="Close sidebar">
          <span className="text-2xl">×</span>
        </button>
        <nav className="space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg transition-colors font-medium text-base ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`
              }
              end
              onClick={onClose}
            >
              <Icon className="h-5 w-5 mr-3" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
