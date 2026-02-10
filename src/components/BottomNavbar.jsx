import { NavLink } from 'react-router-dom';
import { Home, User, Briefcase, Mail, BookOpen } from 'lucide-react';

export default function BottomNavbar() {
  const navLinks = [
    { to: '/', label: 'Inicio', icon: <Home size={20} /> },
    { to: '/about', label: 'Sobre mí', icon: <User size={20} /> },
    { to: '/projects', label: 'Proyectos', icon: <Briefcase size={20} /> },
    { to: '/blog', label: 'Blog', icon: <BookOpen size={20} /> },
    { to: '/contact', label: 'Contacto', icon: <Mail size={20} /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around items-center h-16 overflow-x-auto">
        {navLinks.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors min-w-[60px] ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`
            }
          >
            {icon}
            <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}