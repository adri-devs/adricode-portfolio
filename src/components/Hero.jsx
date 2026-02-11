import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTechColor } from '../constants/techColors';

export default function Hero() {
  const [isDark, setIsDark] = useState(false);

  // Solo visible en esta página
  const techStack = [
    'PHP',
    'Laravel',
    'Flask',
    'Java',
    'React',
    'JavaScript',
    'TypeScript',
    'Tailwind CSS',
    'Bootstrap',
    'MySQL',
    'PostgreSQL',
    'Git',
    'Docker',
    'Vite',
    'Apache',
  ];

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="min-h-[85vh] md:min-h-[90vh] px-6 lg:px-12 max-w-4xl mx-auto 2xl:ms-32 flex flex-col justify-center relative">
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
        <div className="text-sm font-semibold">
          <div className="terminal-badge px-4 py-2 rounded-md">
            <span className={`${isDark ? '' : 'hidden'} console-command`}>echo</span> {isDark ? '"$ Ready to code"' : '$ Ready to code'}
            <span className="console-animate-pulse">_</span>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="text-sm italic text-gray-500 dark:text-gray-400">
            ¡Desliza para ver más sobre mí!
          </p>
        </div>
      </section>

      <section className="pt-20 px-6 lg:px-12 max-w-4xl mx-auto 2xl:ms-32">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Sobre mí
          </h2>
          <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
            <p>
              Soy desarrollador de aplicaciones con experiencia en frontend y backend.
              Me encanta enfrentarme a nuevos desafíos y generar proyectos útiles que
              solucionen situaciones cotidianas.
            </p>
            <p>
              He trabajado en desarrollo web, aplicaciones Java, soluciones ERP, videojuegos...
              Me gusta estar abierto a explorar distintas tecnologías según las necesidades del momento.
            </p>
            <p>
              Mi objetivo es seguir aprendiendo y trabajando en proyectos interesantes.
              Me gusta colaborar, compartir lo que sé, así como aprender de los demás.
              ¡Tengo un blog en desarrollo para compartir mis ideas!
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Habilidades técnicas
          </h2>
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech, i) => {
              return (
                <span
                  key={i}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${getTechColor(tech)} hover:scale-105`}
                >
                  {tech}
                </span>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}