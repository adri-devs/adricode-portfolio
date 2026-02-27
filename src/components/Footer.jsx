import { ArrowUp, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Floating button for mobile/tablet */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 right-6 p-4 bg-purple-600 text-white rounded-full shadow-2xl z-[150] transition-all duration-300 lg:hidden ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Volver al inicio"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      <footer className="bg-transparent pt-16 pb-8 px-4 relative">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
          
          {/* Desktop Scroll to Top (Visible above footer) */}
          <button
            onClick={scrollToTop}
            className="hidden lg:flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-12 group"
          >
            <span>Volver al Inicio</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-6"
          >
            <Home className="w-4 h-4" />
            <span>Volver a la página principal</span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-500">
            <Link to="/legal" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Aviso Legal
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Privacidad
            </Link>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 text-center font-medium">
            &copy; {currentYear} adricode
          </p>
        </div>
      </footer>
    </>
  );
}
