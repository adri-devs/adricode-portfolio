import React, { useEffect, useRef } from 'react';

const SKILLS = [
  { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
  { name: 'Laravel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg' },
  { name: 'Flask', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg' },
  { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Bootstrap', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg' },
  { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Vite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg' },
  { name: 'Apache', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg' },
];

export default function SkillsCloud() {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const items = SKILLS.map(() => ({
      x: Math.random() * (rect.width - 80) + 40,
      y: Math.random() * (rect.height - 80) + 40,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
    }));

    let animationId;
    const animate = () => {
      if (!containerRef.current) return;
      const currentRect = containerRef.current.getBoundingClientRect();
      
      items.forEach((item, i) => {
        const el = itemsRef.current[i];
        if (!el) return;

        item.x += item.vx;
        item.y += item.vy;

        // Bounce off walls
        if (item.x < 10) { item.x = 10; item.vx *= -1; }
        if (item.x > currentRect.width - 70) { item.x = currentRect.width - 70; item.vx *= -1; }
        if (item.y < 10) { item.y = 10; item.vy *= -1; }
        if (item.y > currentRect.height - 70) { item.y = currentRect.height - 70; item.vy *= -1; }

        // Mouse interaction
        if (mouseRef.current.active) {
          const dx = item.x + 30 - mouseRef.current.x;
          const dy = item.y + 30 - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            item.vx += dx * force * 0.03;
            item.vy += dy * force * 0.03;
          }
        }

        // Constant speed maintenance
        const speed = Math.sqrt(item.vx * item.vx + item.vy * item.vy);
        if (speed < 0.5) {
            item.vx *= 1.1;
            item.vy *= 1.1;
        }
        if (speed > 4) {
            item.vx *= 0.9;
            item.vy *= 0.9;
        }

        el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
      });
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] sm:h-[500px] overflow-hidden bg-transparent mt-8 cursor-default"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {SKILLS.map((skill, i) => (
        <div
          key={i}
          ref={el => itemsRef.current[i] = el}
          className="absolute w-14 h-14 sm:w-20 sm:h-20 flex flex-col items-center justify-center p-2 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-100 dark:border-gray-700 transition-shadow hover:shadow-xl pointer-events-none select-none"
          style={{ willChange: 'transform' }}
        >
          <img
            src={skill.icon}
            alt={skill.name}
            className="w-2/3 h-2/3 object-contain"
          />
          <span className="text-[10px] sm:text-xs font-semibold mt-1 text-gray-700 dark:text-gray-300">
            {skill.name}
          </span>
        </div>
      ))}
    </div>
  );
}
