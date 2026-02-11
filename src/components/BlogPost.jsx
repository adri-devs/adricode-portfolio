import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './BlogPost.css';

const API_URL = (import.meta.env.VITE_API_URL + import.meta.env.VITE_BLOG_ENDPOINT) || 'https://adricode.com/api/blog';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    // Buscar patrones de firma al final del contenido
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
        <div className="w-full blog-post-container">
          <article className="w-full blog-content text-justify">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div" 
                      wrapLongLines={false}
                      customStyle={{
                        background: 'black',
                        overflowX: 'auto',
                        fontVariantLigatures: 'none',
                        fontFeatureSettings: '"liga" 0, "calt" 0'
                      }}
                      codeTagProps={{ style: {
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word'
                            }}}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
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