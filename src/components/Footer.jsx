import { ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-transparent py-8 mt-16">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center">
        <button
          onClick={scrollToTop}
          className="group flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-4"
        >
          <span>Volver al inicio</span>
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
        </button>

        {/* Enlaces legales */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-500">
          <Link to="/legal" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Aviso Legal
          </Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Privacidad
          </Link>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {currentYear} adricode
        </p>
      </div>
    </footer>
  );
}