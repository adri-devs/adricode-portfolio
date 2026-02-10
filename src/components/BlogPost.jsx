import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const API_URL = import.meta.env.VITE_API_URL + import.meta.env.VITE_BLOG_ENDPOINT || 'https://adricode.com/api/blog';

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
        setError(data.error || 'Post no encontrado');
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
      <div className="px-6 lg:px-12 py-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 lg:px-12 py-20 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </Link>
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h2 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-2">Error</h2>
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-12 py-20">
      <div className="max-w-4xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al blog
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
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

        {/* Es la mejor práctica? No, pero el markdown customizado aparece. */}
        <article className="
          prose prose-lg dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
          prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
          prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900 dark:prose-strong:text-white
          prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-gray-900 prose-pre:text-gray-100
          prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:pl-4 prose-blockquote:italic
          prose-img:rounded-lg prose-img:shadow-lg
          prose-ul:list-disc prose-ol:list-decimal
          prose-li:text-gray-700 dark:prose-li:text-gray-300
          prose-table:border-collapse prose-table:w-full
          prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-3 prose-th:text-left
          prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600 prose-td:p-3
        ">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>{children}</code>
                );
              },
              img({ src, ...props }) {
                const imgSrc = src?.startsWith('http') ? src : `/blog-posts/images/${src}`;
                return <img {...props} src={imgSrc} loading="lazy" />;
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link to="/blog" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline font-medium">
            <ArrowLeft className="w-4 h-4" />
            Ver todos los artículos
          </Link>
        </footer>
      </div>
    </div>
  );
}