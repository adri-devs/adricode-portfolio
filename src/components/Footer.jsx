import { ArrowUp, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Fallback for some mobile browsers
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    document.body.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <footer className="bg-transparent pt-16 pb-8 px-4 relative">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
          
          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-12 group"
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
