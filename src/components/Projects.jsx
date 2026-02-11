import { getTechColor } from '../constants/techColors';

export default function Projects() {
  const projects = [
    {
      title: "Dental Aragonesa",
      subtitle: "Clínica dental",
      description: "Desarrollo completo web e infraestructura del servidor.",
      tech: ["PHP", "Apache", "Bootstrap", "JavaScript"],
      demo: "https://dentalaragonesa.com",
      image: "/images/dental_showcase.png",
      hasSubproject: true,
      subproject: {
        title: "Módulos ERP personalizados",
        description: "Sistema de citas y registro E/S por trabajador"
      }
    },
    {
      title: "Peluquería Canina  Alma",
      subtitle: "Peluquería canina",
      description: "Aplicación web con panel de administración.",
      tech: ["Laravel", "MySQL", "Tailwind CSS", "PostCSS"],
      demo: "https://pelucanalma.com",
      image: "/images/pelucan_showcase.png"
    },
    {
      title: "Eventura",
      subtitle: "Gestión de actividades de tiempo libre",
      description: "Plataforma para gestionar actividades extraescolares, para padres y monitores.",
      tech: ["Flask", "MySQL", "Bootstrap"],
      demo: "https://eventura.adricode.com",
      image: "/images/eventura_showcase.png"
    },
    {
      title: "SoloQ Challenge",
      subtitle: "Clasificación competitiva",
      description: "Sistema de clasificación en tiempo real. Actualización mediante API REST.",
      tech: ["PHP", "MySQL", "API REST"],
      demo: "https://soloq.adricode.com",
      image: "/images/soloq_showcase.png"
    },
    {
      title: "adricode.com",
      subtitle: "Portfolio personal",
      description: "Mi portfolio personal en constante evolución. ¡Esta vez con React!",
      tech: ["React", "Vite", "Tailwind CSS", "PostCSS"],
      github: "https://github.com/adri-devs/adricode-portfolio",
      image: "/images/adricode_showcase.png"
    }
  ];

  return (
    <div className="px-6 lg:px-12 pt-8 md:pt-10 mx-auto 2xl:ms-32">
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white pb-8">
        Proyectos destacados
      </h2>

      <div className="space-y-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl w-full 2xl:w-4/5 overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
          >
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="grid xl:grid-cols-2">
                <div className="p-6 space-y-2">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {project.description}
                  </p>

                  {project.hasSubproject && (
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <div>
                          <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">
                            {project.subproject.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
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
                </div>
                <div className="p-0 sm:pb-6 xl:py-6 xl:px-4 flex items-center justify-center">
                  <img
                    src={project.image}
                    alt={`Captura de pantalla de ${project.title}`}
                    className="w-full sm:w-3/4 xl:w-full h-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}