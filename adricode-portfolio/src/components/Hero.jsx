import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme(); // Verifica el tema que hay cargado
    const observer = new MutationObserver(checkTheme); // Inicia un observer
    observer.observe(document.documentElement, {
      attributes: true, // Observa cambios en los atributos del elemento raíz
      attributeFilter: ['class'] // Observa cambios en las clases
    });
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div className="px-6 lg:px-12 py-20 md:py-32 min-h-screen flex items-center">
      <div className="max-w-4xl">
        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Desarrollando código y proyectos día a día
        </h1>

        <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Disfruto enfrentándome a nuevos retos y aprendiendo con cada proyecto.
          <br/>Me gusta construir cosas útiles y ver cómo cobran vida.
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          <Link
            to="/projects"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
          >
            Ver proyectos
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 font-medium rounded-lg transition-colors"
          >
            Contactar
          </Link>
        </div>

        <div className="terminal-badge inline-block px-4 py-2 rounded-md text-sm font-semibold">

          {isDark ? '$ echo "$ Ready to code"' : '$ Ready to code'}
          <span className="animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
}