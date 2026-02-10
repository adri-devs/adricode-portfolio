import { NavLink, Link } from 'react-router-dom';
import { Sun, Moon, ExternalLink } from 'lucide-react';

const MountainIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <path d="M16 6L26 24H6L16 6Z" className="fill-purple-600 dark:fill-purple-500" />
    <path d="M20 18L24 24H16L20 18Z" className="fill-purple-500 dark:fill-purple-400 opacity-60" />
  </svg>
);

export default function Header({ darkMode, toggleDarkMode }) {
  const navLinks = [
    { to: '/', label: 'INICIO' },
    { to: '/about', label: 'SOBRE MÍ' },
    { to: '/projects', label: 'PROYECTOS' },
    { to: '/blog', label: 'BLOG' },
    { to: '/contact', label: 'CONTACTO' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm z-50">
      <div className="h-16 px-4 md:px-8 flex items-center justify-between">
        <nav className="hidden md:flex gap-8 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex flex-column gap-1">
              <MountainIcon />
              <span className="text-xl font-bold text-gray-900 dark:text-white">adricode</span>
            </div>
          </Link>
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide transition-colors ${
                  isActive
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="md:hidden text-lg font-bold text-purple-600 dark:text-purple-400">
          adricode
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://drive.google.com/file/d/1tqkOx8XchXLM84Oz35cWnEJk2esLtZKe/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
            aria-label="Ver CV"
          >
            <span className="text-sm font-semibold">CV</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Cambiar tema"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}