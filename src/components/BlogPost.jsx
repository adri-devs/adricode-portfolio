import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Share2, Twitter, Copy, Check, Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './BlogPost.css';

const API_URL = (import.meta.env.VITE_API_URL + import.meta.env.VITE_BLOG_ENDPOINT) || 'https://adricode.com/api/blog';

const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/post.php?slug=${slug}`);
      const data = await response.json();
      if (data.success) {
        setPost(data.post);
      } else {
        setError(data.error || 'Post no encontrado o inválido');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = `Echa un vistazo a este artículo: ${post.title}`;
    const url = window.location.href;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = `Echa un vistazo a este artículo: ${post.title} - ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-12 py-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-12 py-20 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            Volver a la lista de artículos
          </Link>
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h2 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-2">Error</h2>
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const processContent = (content) => {
    const signaturePatterns = [
      /<span class="signature">.*?<\/span>$/s
    ];

    for (const pattern of signaturePatterns) {
      const match = content.match(pattern);
      if (match) {
        const mainContent = content.replace(pattern, '');
        const signatureText = match[0]
          .replace(/\n---\n\n/g, '')
          .replace(/<span class="signature">/g, '')
          .replace(/<\/span>/g, '')
          .replace(/\*/g, '')
          .replace(/<br\s*\/?>/g, '\n')
          .trim();
        
        return { mainContent, signature: signatureText };
      }
    }

    return { mainContent: content, signature: null };
  };

  const { mainContent, signature } = processContent(post.content);

  return (
    <div className="max-w-6xl px-6 lg:px-12 pt-8 lg:pt-10 mx-auto 2xl:ms-32">
      <div className="max-w-4xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline mb-6 sm:mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver a Artículos
        </Link>
        <header className="mb-8 sm:mb-12 w-full">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight break-words">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
            {post.date_created && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.date_created.iso)}</span>
              </div>
            )}
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            )}
            {post.category && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md text-sm font-medium">
                  {post.category}
                </span>
              </div>
            )}
          </div>
          {post.date_modified && post.date_modified.timestamp !== post.date_created.timestamp && (
            <p className="text-sm text-gray-500 dark:text-gray-500 italic">
              Última actualización: {formatDate(post.date_modified.iso)}
            </p>
          )}
        </header>

        {/* Minimalist Top Sharing Bar */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100 dark:border-gray-800/50">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Compartir:</span>
          <button
            onClick={handleCopyLink}
            className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
            title="Copiar enlace"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleShareTwitter}
            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
            title="X (Twitter)"
          >
            <Twitter className="w-4 h-4" />
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="p-2 text-gray-400 hover:text-green-500 transition-colors"
            title="WhatsApp"
          >
            <WhatsAppIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="w-full blog-post-container">
          <article className="w-full blog-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="code-block-scroll-wrapper">
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div" 
                        wrapLongLines={false}
                        customStyle={{
                          background: 'transparent',
                          overflowX: 'visible',
                          fontVariantLigatures: 'none',
                          fontFeatureSettings: '"liga" 0, "calt" 0',
                          padding: '1.5rem',
                          margin: 0
                        }}
                        codeTagProps={{ style: {
                                whiteSpace: 'pre',
                                wordBreak: 'normal'
                              }}}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={className} {...props}>{children}</code>
                  );
                },
                img({ src, ...props }) {
                  const imgSrc = src?.startsWith('http') ? src : `/blog-posts/images/${src}`;
                  return <img {...props} src={imgSrc} loading="lazy" className="max-w-full h-auto" />;
                }
              }}
            >
              {mainContent}
            </ReactMarkdown>

            {signature && (
              <div className="signature-wrapper">
                <div className="signature-content">
                  {signature.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            )}
          </article>
          <div className="flex flex-wrap items-center gap-4 my-2 mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            <Share2 className="w-4 h-4" />
            <span>Compartir</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Copiar enlace"
              className="p-2.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all active:scale-90"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
            <button
              onClick={handleShareTwitter}
              title="Compartir en Twitter"
              className="p-2.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-500 transition-all active:scale-90"
            >
              <Twitter className="w-5 h-5" />
            </button>
            <button
              onClick={handleShareWhatsApp}
              title="Compartir en WhatsApp"
              className="p-2.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 hover:text-green-600 dark:hover:text-green-600 transition-all active:scale-90"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        </div>
        <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700 w-full">
          <Link to="/blog" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline font-medium">
            <ArrowLeft className="w-4 h-4" />
            Ver todos los artículos
          </Link>
        </footer>
      </div>
    </div>
  );
}
