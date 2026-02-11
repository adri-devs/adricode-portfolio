import { useState, useEffect, useRef } from 'react';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const API_ENDPOINT = import.meta.env.VITE_API_URL + import.meta.env.VITE_CONTACT_ENDPOINT;

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isHovering, setIsHovering] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) return;

    if (document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
      scriptLoadedRef.current = true;
      initTurnstile();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      initTurnstile();
    };
    script.onerror = () => setSubmitStatus('error');
    document.head.appendChild(script);

    return () => {
      if (window.turnstile && widgetIdRef.current !== null) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (e) {
          console.error('Error limpiando Turnstile:', e);
        }
      }
    };
  }, []);

  const initTurnstile = () => {
    const checkTurnstile = setInterval(() => {
      if (window.turnstile && turnstileRef.current) {
        clearInterval(checkTurnstile);
        if (widgetIdRef.current === null) {
          try {
            const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
              sitekey: TURNSTILE_SITE_KEY,
              callback: (token) => setTurnstileToken(token),
              'error-callback': () => setSubmitStatus('error'),
              'expired-callback': () => setTurnstileToken(''),
              'timeout-callback': () => setSubmitStatus('error'),
              theme: theme,
              size: 'invisible'
            });
          } catch (e) {
            console.error('Error inicializando Turnstile:', e);
          }
        }
      }
    }, 100);
    setTimeout(() => clearInterval(checkTurnstile), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (turnstileToken) {
      await sendMessage(turnstileToken);
      return;
    }

    if (window.turnstile && widgetIdRef.current !== null) {
      try {
        setSubmitStatus('loading');
        window.turnstile.execute(widgetIdRef.current);
      } catch (error) {
        setSubmitStatus('error');
      }
    } else {
      setSubmitStatus('error');
    }
  };

  const sendMessage = async (token) => {
    if (!token) {
      setSubmitStatus('error');
      return;
    }

    setSubmitStatus('loading');

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          'cf-turnstile-response': token
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        if (window.turnstile && widgetIdRef.current !== null) {
          window.turnstile.reset(widgetIdRef.current);
        }
        setTurnstileToken('');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
        if (window.turnstile && widgetIdRef.current !== null) {
          window.turnstile.reset(widgetIdRef.current);
        }
        setTurnstileToken('');
      }
    } catch (error) {
      setSubmitStatus('error');
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.reset(widgetIdRef.current);
      }
      setTurnstileToken('');
    }
  };

  useEffect(() => {
    if (turnstileToken && submitStatus === 'loading') {
      sendMessage(turnstileToken);
    }
  }, [turnstileToken]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-6xl px-6 lg:px-12 pt-8 lg:pt-10 mx-auto 2xl:ms-32">
      <div className="mb-10">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Contacto
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
          ¿Tienes un proyecto en mente? Hablemos. Te responderé lo antes posible.
        </p>
      </div>
    
      <div className="grid xl:grid-cols-5 gap-4 xl:gap-0">
        <div className="lg:col-span-2"> 
          <div className="
          bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm 
          border border-gray-200 dark:border-gray-700 p-6 
          xl:rounded-tl-lg xl:rounded-bl-lg xl:border-r-0">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Información de contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 space-y-6 lg:space-y-0 lg:gap-6 ">
              <a
                href="mailto:dev@adricode.com"
                className="flex items-center gap-4 text-gray-600 dark:text-gray-400 hover:text-purple-600 
                dark:hover:text-purple-400 transition-colors group"
              >
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-sm group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-all">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-md text-gray-500 dark:text-gray-500">Email</p>
                  <p className="font-medium">dev@adricode.com</p>
                </div>
              </a>

              <a
                href="https://github.com/adri-devs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
              >
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-sm group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-all">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-md text-gray-500 dark:text-gray-500">GitHub</p>
                  <p className="font-medium">github.com/adri-devs</p>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/adrian-perez-/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
              >
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-sm group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-all">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-md text-gray-500 dark:text-gray-500">LinkedIn</p>
                  <p className="font-medium">adrian-perez-</p>
                </div>
              </a>
            </div>
          </div>
        </div>
         <form onSubmit={handleSubmit} className="lg:col-span-3">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 rounded-sm space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Envíame un mensaje
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={submitStatus === 'loading'}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={submitStatus === 'loading'}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={submitStatus === 'loading'}
                  rows="6"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Cuéntame sobre tu proyecto..."
                />
              </div>

              <div ref={turnstileRef}></div>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-sm">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-300">
                        Mensaje enviado
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        Te responderé lo antes posible.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-sm">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">
                        Error al enviar
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                        Inténtalo de nuevo o escríbeme a dev@adricode.com
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitStatus === 'loading'}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="group relative w-full md:w-auto px-8 py-3 bg-purple-600 dark:bg-purple-500 text-white font-mono font-medium overflow-hidden transition-all duration-300 hover:bg-purple-700 dark:hover:bg-purple-600 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600 rounded-sm"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="tracking-wider">
                    {submitStatus === 'loading' ? '> ENVIANDO...' : '> ENVIAR'}
                  </span>
                  <span className={`inline-block transition-all duration-300 ${isHovering || submitStatus === 'loading' ? 'opacity-0' : 'opacity-100'}`}>_</span>
                </span>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.15)_50%)] bg-[length:4px_4px]"></div>
                </div>
                <div className="absolute inset-0 border-2 border-purple-400/30 dark:border-purple-300/30 group-hover:border-purple-300/50 dark:group-hover:border-purple-200/50 transition-colors rounded-sm"></div>
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ${isHovering && submitStatus !== 'loading' ? 'translate-x-full' : '-translate-x-full'}`}></div>
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}