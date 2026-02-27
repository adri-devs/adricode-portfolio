import { useState, useEffect } from 'react';
import { getTechColor } from '../constants/techColors';
import { ExternalLink, Github, X, Info } from 'lucide-react';

export default function Projects({ selectedProject, setSelectedProject }) {
  const [isClosing, setIsClosing] = useState(false);

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

  const handleProjectClick = (project, e) => {
    e.preventDefault();
    setSelectedProject(project);
  };

  const closePreview = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedProject(null);
      setIsClosing(false);
    }, 400);
  };


  return (
    <div className="relative min-h-screen">
      <div className={`px-6 md:px-12 lg:px-12 xl:px-24 pt-8 md:pt-10 mx-auto max-w-[100rem] transition-all duration-500 ${selectedProject ? 'lg:translate-x-[25%] lg:opacity-50 blur-sm lg:blur-none pointer-events-none lg:pointer-events-auto' : ''}`}>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white pb-8">
          Proyectos destacados
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {projects.map((project, index) => (
            <div
              key={index}
              onClick={(e) => handleProjectClick(project, e)}
              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-4 left-4">
                   <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      Ver detalles
                   </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${getTechColor(tech)} opacity-80`}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500">
                      +{project.tech.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Pane / Modal */}
      {selectedProject && (
        <>
          {/* Mobile Modal */}
          <div 
            className="lg:hidden fixed inset-0 z-[100] flex items-center sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={closePreview}
          >
            <div 
              className={`bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-slide-in-bottom max-h-[90vh] flex flex-col ${isClosing ? 'opacity-0 translate-y-20 transition-all duration-500' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-y-auto p-6">
                <ProjectDetailContent project={selectedProject} onClose={closePreview} isMobile={true} />
              </div>
            </div>
          </div>

          {/* Desktop Sliding Preview */}
          <div 
            className={`hidden lg:block fixed top-0 left-0 h-screen w-screen z-[90] pointer-events-none transition-all duration-500 ease-out transform ${isClosing ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'} animate-slide-in-left`}
          >
             <div 
               className="h-full w-full bg-white/40 dark:bg-gray-900/40 shadow-2xl project-preview-slant pointer-events-auto overflow-y-auto"
               style={{ 
   
               }}
             >
                <div className="min-h-full w-full bg-white/80 dark:bg-gray-900/80 py-16 lg:py-24 p-8 lg:p-12 lg:pr-[50vw]">
                  <div className="max-w-5xl mx-auto lg:mx-0">
                    <ProjectDetailContent project={selectedProject} onClose={closePreview} isMobile={false} />
                  </div>
                </div>
             </div>
          </div>
          <div 
            className="hidden lg:block fixed inset-0 z-[80] bg-black/10 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-500"
            onClick={closePreview}
          />
        </>
      )}
    </div>
  );
}

function ProjectDetailContent({ project, onClose, isMobile }) {
  return (
    <div className={`relative ${isMobile ? 'space-y-4' : 'space-y-6'}`}>
      <button 
        onClick={onClose}
        className="absolute top-0 right-0 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className={`space-y-2 ${isMobile ? 'pt-2' : 'pt-4'}`}>
        <h3 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-black text-gray-900 dark:text-white uppercase tracking-tighter`}>
          {project.title}
        </h3>
        <p className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-2 pb-2">
          {project.subtitle}
        </p>
      </div>

      <img 
        src={project.image} 
        alt={project.title} 
        className="w-full rounded-xl shadow-lg border border-gray-100 dark:border-gray-800"
      />

      <div className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
        <p className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-700 dark:text-gray-300 leading-relaxed`}>
          {project.description}
        </p>

        {project.hasSubproject && (
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30">
            <h4 className="text-sm font-bold text-purple-700 dark:text-purple-300 uppercase mb-2">
              {project.subproject.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {project.subproject.description}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {project.tech.map((tech, i) => (
            <span
              key={i}
              className={`px-3 py-1 text-xs font-bold rounded-full ${getTechColor(tech)} shadow-sm`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 active:scale-95"
          >
            <ExternalLink className="w-5 h-5" />
            VER DEMO EN VIVO
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl transition-all shadow-lg active:scale-95"
          >
            <Github className="w-5 h-5" />
            REPOSITORIO
          </a>
        )}
      </div>
    </div>
  );
}