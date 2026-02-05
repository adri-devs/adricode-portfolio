export const TECH_COLORS = {
  'PHP': 'bg-indigo-600 dark:bg-indigo-500 text-white',
  'Python': 'bg-blue-600 dark:bg-blue-500 text-white',
  'JavaScript': 'bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white',
  'TypeScript': 'bg-blue-700 dark:bg-blue-600 text-white',
  'Java': 'bg-orange-600 dark:bg-orange-500 text-white',
  'Laravel': 'bg-red-600 dark:bg-red-500 text-white',
  'Flask': 'bg-teal-600 dark:bg-teal-500 text-white',
  'Node.js': 'bg-green-600 dark:bg-green-500 text-white',
  'React': 'bg-cyan-600 dark:bg-cyan-500 text-white',
  'Vite': 'bg-purple-600 dark:bg-purple-500 text-white',
  'Bootstrap': 'bg-purple-700 dark:bg-purple-600 text-white',
  'Tailwind CSS': 'bg-cyan-500 dark:bg-cyan-600 text-white',
  'PostCSS': 'bg-pink-600 dark:bg-pink-500 text-white',
  'MySQL': 'bg-blue-800 dark:bg-blue-700 text-white',
  'PostgreSQL': 'bg-blue-900 dark:bg-blue-800 text-white',
  'MongoDB': 'bg-green-700 dark:bg-green-600 text-white',
  'Apache': 'bg-red-700 dark:bg-red-600 text-white',
  'Git': 'bg-orange-700 dark:bg-orange-600 text-white',
  'Docker': 'bg-blue-600 dark:bg-blue-500 text-white',
  'API REST': 'bg-emerald-600 dark:bg-emerald-500 text-white',
};

export const DEFAULT_TECH_COLOR = 'bg-slate-600 dark:bg-slate-500 text-white';

export const getTechColor = (tech) => {
  return TECH_COLORS[tech] || DEFAULT_TECH_COLOR;
};
