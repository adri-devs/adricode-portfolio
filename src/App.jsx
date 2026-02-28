import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import ScrollToTop from './components/ScrollToTop';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BottomNavbar from './components/BottomNavbar';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import Legal from './components/Legal';
import Privacy from './components/Privacy';
import Playground from './components/Playground';
import CyberLab from './components/CyberLab';
import './App.css';

function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [showPlayground, setShowPlayground] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setShowPlayground(false);
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative">
      <div className="background-triangle"></div>
      <a 
        href="https://drive.google.com/file/d/1tqkOx8XchXLM84Oz35cWnEJk2esLtZKe/view?usp=drive_link" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="cv-corner" 
        aria-label="Descargar CV"
      ></a>

      <Header 
        darkMode={darkMode} 
        toggleDarkMode={() => setDarkMode(v => !v)} 
        onOpenPlayground={() => setShowPlayground(true)} 
      />

      <div className="flex pt-16">
        <main className="flex-1 lg:mr-80 min-h-[calc(100vh-4rem)] flex flex-col pb-20 md:pb-0 min-w-0">
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route 
                path="/projects" 
                element={
                  <Projects 
                    selectedProject={selectedProject} 
                    setSelectedProject={setSelectedProject} 
                  />
                } 
              />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cyberlab" element={<CyberLab />} />
            </Routes>
          </div>
          <Footer />
        </main>

        <aside className="hidden lg:block fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 border-none overflow-y-auto overflow-x-hidden z-[100]">
          <Sidebar 
            onOpenPlayground={() => setShowPlayground(true)} 
            selectedProject={selectedProject}
          />
        </aside>
      </div>

      <BottomNavbar onOpenPlayground={() => setShowPlayground(true)} />

      {showPlayground && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setShowPlayground(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Playground onClose={() => setShowPlayground(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}