export default function ProjectCard({ project }) {
  const techColors = {
    'Django': 'bg-green-500 text-white',
    'Flask': 'bg-gray-700 text-white',
    'PostgreSQL': 'bg-blue-600 text-white',
    'REST API': 'bg-yellow-500 text-gray-900',
    'Bootstrap': 'bg-purple-600 text-white',
    'PHP': 'bg-indigo-600 text-white',
    'MySQL': 'bg-orange-500 text-white',
    'API Integration': 'bg-pink-500 text-white',
    'REST': 'bg-teal-500 text-white',
    'Real-time Data': 'bg-red-500 text-white',
    'Tailwind CSS': 'bg-cyan-500 text-white',
    'HTML5': 'bg-orange-600 text-white',
  };

  return (
    <article className="group bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-2xl hover:border-primary transition-all duration-300 hover:-translate-y-2">
      <div
        className="h-2"
        style={{ backgroundColor: project.color }}
      />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            {project.category}
          </span>
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors group-hover:translate-x-1 group-hover:-translate-y-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>

        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className={`px-3 py-1 text-xs font-semibold rounded-full ${techColors[tech] || 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
            >
              {tech}
            </span>
          ))}
        </div>

        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
        >
          Ver proyecto
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </article>
  );
}
