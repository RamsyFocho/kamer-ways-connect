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

const AdminSidebar: React.FC = () => {
  const { theme } = useTheme();

  return (
    <aside
      className={`w-full md:w-64 border-r min-h-screen p-4 ${
        theme === 'dark' ? 'bg-card text-card-foreground' : 'bg-white'
      }`}
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
  );
};

export default AdminSidebar;
