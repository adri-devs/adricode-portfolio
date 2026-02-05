import { getTechColor } from '../constants/techColors';

export default function Projects() {
  const projects = [
    {
      title: "Dental Aragonesa",
      subtitle: "Clínica dental en Zaragoza",
      description: "Desarrollo completo de la web corporativa, incluyendo sistema de gestión interna y optimizaciones SEO para posicionamiento local.",
      tech: ["PHP", "Apache", "Bootstrap", "JavaScript"],
      demo: "https://dentalaragonesa.com",
      image: "/images/dental_showcase.png",
      hasSubproject: true,
      subproject: {
        title: "Módulos ERP personalizados",
        description: "Sistema de citas con calendarios individuales por trabajador y módulo de fichaje automático para control horario del personal."
      }
    },
    {
      title: "Peluquería Canina Alma",
      subtitle: "Web de gestión para peluquería canina",
      description: "Aplicación web con panel de administración para gestionar citas, clientes y servicios del negocio de forma centralizada.",
      tech: ["Laravel", "MySQL", "Tailwind CSS", "PostCSS"],
      demo: "https://pelucanalma.com",
      image: "/images/pelucan_showcase.png"
    },
    {
      title: "Eventura",
      subtitle: "Gestión de actividades de tiempo libre",
      description: "Plataforma que conecta padres y monitores para gestionar actividades extraescolares. Empezó como un prototipo en clase pero siempre he querido darle vida.",
      tech: ["Flask", "MySQL", "Bootstrap"],
      demo: "https://eventura.adricode.com",
      image: "/images/eventura_showcase.png"
    },
    {
      title: "SoloQ Challenge",
      subtitle: "Clasificación competitiva",
      description: "Sistema de ranking en tiempo real para competiciones entre amigos. Actualización colaborativa mediante API REST.",
      tech: ["PHP", "MySQL", "API REST"],
      demo: "https://soloq.adricode.com",
      image: "/images/soloq_showcase.png"
    },
    {
      title: "adricode.com",
      subtitle: "Portfolio personal",
      description: "Mi portfolio personal en constante evolución. Esta vez decidí rehacerlo con React para practicar y probar nuevas ideas.",
      tech: ["React", "Vite", "Tailwind CSS", "PostCSS"],
      demo: "https://adricode.com",
      image: "/images/adricode_showcase.png"
    }
  ];

  return (
    <div className="px-6 lg:px-12 py-20">
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-12">
        Proyectos destacados
      </h2>

      <div className="space-y-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
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
                  <div className="mt-3 p-3 bg-white dark:bg-gray-700/50 rounded-lg border-l-3 border-purple-500">
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
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-all"
                  >
                    Ver proyecto
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>

              <img
                src={project.image}
                alt={`Captura de pantalla de ${project.title}`}
                className="w-full h-auto max-h-[240px] object-contain rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
