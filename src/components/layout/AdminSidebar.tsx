// src/components/layout/AdminSidebar.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building, Map, Users, X } from 'lucide-react'; // Added X icon for close
import { useTheme } from '@/contexts/ThemeContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/agencies', label: 'Agencies', icon: Building },
  { to: '/admin/routes', label: 'Routes', icon: Map },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/bookings', label: 'Bookings', icon: LayoutDashboard },
];

const AdminSidebar: React.FC<{ mobileOpen?: boolean; onClose?: () => void }> = ({ mobileOpen = false, onClose }) => {
  const { actualTheme } = useTheme();

  const SidebarContent = () => (
    <nav className="space-y-2 p-4">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClose} // Close sidebar on link click for mobile
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
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex md:flex-col w-64 min-h-screen border-r bg-sidebar text-sidebar-foreground"
        data-theme={actualTheme}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50 bg-sidebar text-sidebar-foreground border-r transition-transform duration-300 md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        data-theme={actualTheme}
      >
        <div className="flex justify-end p-2">
            <button onClick={onClose} aria-label="Close sidebar" className="p-2">
                <X className="h-6 w-6" />
            </button>
        </div>
        <SidebarContent />
      </div>
    </>
  );
};

export default AdminSidebar;