import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, Mail, BookOpen, Gamepad2, Shield, ChevronRight, X } from 'lucide-react';

export default function BottomNavbar({ onOpenPlayground }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const mainLinks = [
    { to: '/', label: 'Inicio', icon: <Home size={20} /> },
    { to: '/projects', label: 'Proyectos', icon: <Briefcase size={20} /> },
    { to: '/contact', label: 'Contacto', icon: <Mail size={20} /> },
  ];

  const secondaryLinks = [
    { to: '/blog', label: 'Blog', icon: <BookOpen size={20} />, type: 'link' },
    { to: '/cyberlab', label: 'CyberLab', icon: <Shield size={20} />, type: 'link' },
    { label: 'Playground', icon: <Gamepad2 size={20} />, type: 'button', onClick: onOpenPlayground },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100]">
      {/* Expanded Menu Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]" 
          onClick={() => setIsExpanded(false)} 
        />
      )}

      {/* Secondary Links (Slide up) */}
      <div className={`mx-4 mb-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-3xl p-4 transition-all duration-500 ease-out transform ${isExpanded ? 'translate-y-0 opacity-100 shadow-2xl' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="flex justify-around items-center">
          {secondaryLinks.map((link, idx) => (
            link.type === 'link' ? (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsExpanded(false)}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-2 transition-all ${
                    isActive ? 'text-purple-600 dark:text-purple-400 scale-110' : 'text-gray-500 dark:text-gray-400'
                  }`
                }
              >
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                  {link.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">{link.label}</span>
              </NavLink>
            ) : (
              <button
                key={link.label}
                onClick={() => { link.onClick(); setIsExpanded(false); }}
                className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400 transition-all active:scale-95"
              >
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                  {link.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">{link.label}</span>
              </button>
            )
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 px-6 h-20 flex justify-between items-center shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center w-full max-w-sm mx-auto">
          {mainLinks.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsExpanded(false)}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1.5 transition-all ${
                  isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                }`
              }
            >
              <div className={`transition-all duration-300 ${isExpanded ? 'opacity-50 blur-[1px]' : ''}`}>
                {icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${isExpanded ? 'opacity-50 blur-[1px]' : ''}`}>{label}</span>
            </NavLink>
          ))}

          {/* Expand Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex flex-col items-center gap-1.5 transition-all ${isExpanded ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}
          >
            <div className={`rounded-full transition-transform duration-500 ${isExpanded ? 'bg-purple-100 dark:bg-purple-900/30 rotate-180' : ''}`}>
              {isExpanded ? <X size={20} /> : <ChevronRight size={20} className="animate-pulse" />}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{isExpanded ? 'Cerrar' : 'Más'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
