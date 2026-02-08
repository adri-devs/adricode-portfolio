import { getTechColor } from '../constants/techColors';
import { ExternalLink, Github, Lock, Mail } from 'lucide-react';

export default function Projects() {
  const projects = [
    {
      title: "Dental Aragonesa",
      subtitle: "Clínica dental",
      description: "Desarrollo completo de la web corporativa, incluyendo edición del sistema de gestión interna y SEO para posicionamiento local.",
      tech: ["PHP", "Apache", "Bootstrap", "JavaScript"],
      demo: "https://dentalaragonesa.com",
      buttonType: "demo",
      image: "/images/dental_showcase.png",
      hasSubproject: true,
      subproject: {
        title: "Módulos ERP personalizados",
        description: "Sistema de citas con calendarios individuales por trabajador y módulo de fichaje automático para control horario del personal."
      }
    },
    {
      title: "Peluquería Canina  Alma",
      subtitle: "Peluquería canina",
      description: "Aplicación web con panel de administración para gestionar citas, clientes y servicios del negocio de forma centralizada.",
      tech: ["Laravel", "MySQL", "Tailwind CSS", "PostCSS"],
      demo: "https://pelucanalma.com",
      buttonType: "demo",
      image: "/images/pelucan_showcase.png"
    },
    {
      title: "Eventura",
      subtitle: "Gestión de actividades de tiempo libre",
      description: "Plataforma que conecta padres y monitores para gestionar actividades extraescolares. Empezó como un prototipo de clase pero siempre he querido darle vida.",
      tech: ["Flask", "MySQL", "Bootstrap"],
      demo: "https://eventura.adricode.com",
      buttonType: "demo",
      image: "/images/eventura_showcase.png"
    },
    {
      title: "SoloQ Challenge",
      subtitle: "Clasificación competitiva",
      description: "Sistema de ranking en tiempo real para competiciones entre amigos. Actualización colaborativa mediante API REST.",
      tech: ["PHP", "MySQL", "API REST"],
      demo: "https://soloq.adricode.com",
      buttonType: "demo",
      image: "/images/soloq_showcase.png"
    },
    {
      title: "adricode.com",
      subtitle: "Portfolio personal",
      description: "Mi portfolio personal en constante evolución. Esta vez decidí rehacerlo con React para practicar y probar nuevas ideas.",
      tech: ["React", "Vite", "Tailwind CSS", "PostCSS"],
      github: "https://github.com/adri-devs/adricode-portfolio",
      buttonType: "github",
      image: "/images/adricode_showcase.png"
    }
  ];

  const getButton = (project) => {
    switch (project.buttonType) {
      case 'demo':
        return (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            Ver proyecto
            <ExternalLink className="w-4 h-4" />
          </a>
        );
      
      case 'github':
        return (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            Ver repositorio
            <Github className="w-4 h-4" />
          </a>
        );
      
      case 'private':
        return (
          <button
            disabled
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded-lg cursor-not-allowed"
          >
            No disponible
            <Lock className="w-4 h-4" />
          </button>
        );
      
      case 'contact':
        return (
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-600 dark:hover:to-blue-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            Contáctame
            <Mail className="w-4 h-4" />
          </a>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="px-6 lg:px-12 py-20">
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-12">
        Proyectos destacados
      </h2>

      <div className="space-y-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
          >
            <div className="grid md:grid-cols-2 gap-6 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {project.subtitle}
                  </p>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {project.description}
                </p>

                {project.hasSubproject && (
                  <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-3 border-purple-500">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <div>
                        <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">
                          {project.subproject.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {project.subproject.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className={`tech-badge px-3 py-1 text-xs font-medium rounded-full ${getTechColor(tech)}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  {getButton(project)}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <img
                  src={project.image}
                  alt={`Captura de pantalla de ${project.title}`}
                  className="w-full h-auto max-h-[280px] object-contain rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}