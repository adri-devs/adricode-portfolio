import { getTechColor } from '../constants/techColors';

export default function About() {
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

  return (
    <div className="px-6 lg:px-12 py-20">
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Sobre mí
      </h2>
      <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
        <p>
          Soy desarrollador de aplicaciones con experiencia en frontend y backend.
          Me encanta enfrentarme a nuevos desafíos y generar proyectos útiles que solucionen situaciones cotidianas.
        </p>
        <p>
          He trabajado en desarrollo web, aplicaciones Java, soluciones ERP, videojuegos... Me gusta estar abierto
          a explorar distintas tecnologías según las necesidades del momento.
        </p>
        <p>
          Mi objetivo es seguir aprendiendo y trabajando en proyectos interesantes. Me gusta colaborar,
          compartir lo que sé, así como aprender de los demás. <i>¡Tengo un blog en desarrollo para compartir mis ideas!</i>
        </p>
      </div>
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Habilidades técnicas
        </h3>
        <div className="flex flex-wrap gap-2 max-w-4xl">
          {techStack.map((tech, i) => (
            <span
              key={i}
              className={`tech-badge px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${getTechColor(tech)}`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
