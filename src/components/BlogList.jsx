import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

// No distinción entre desarrollo local y dev.
const API_URL = import.meta.env.VITE_API_URL + import.meta.env.VITE_BLOG_ENDPOINT || 'https://adricode.com/api/blog';

export default function BlogList() {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false); // ya no controla el render
  const [allCategories, setAllCategories] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [order, setOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [showFilters, setShowFilters] = useState(false);

  const fetchPosts = async () => {
    // setLoading(true);
    setError(null);

    const params = new URLSearchParams({ page: currentPage, limit: 10, order });
    if (searchTerm) params.append('search', searchTerm);
    if (selectedCategory) params.append('category', selectedCategory);

    try {
      const response = await fetch(`${API_URL}/posts.php?${params}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
        setPagination(data.pagination);
        if (!selectedCategory && !searchTerm) {
          setAllCategories(data.categories || []);
        }
      } else {
        setError(data.error || 'Error al cargar los posts');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, inténtalo de nuevo.');
    } 
  };

  useEffect(() => {
  const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchPosts();
      }
  }, 100);

  return () => clearTimeout(timer);
}, [searchTerm, currentPage, selectedCategory, order]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleOrderToggle = () => {
    setOrder(order === 'desc' ? 'asc' : 'desc');
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setCurrentPage(1);
  };

  // if (loading) {
  //   return (
  //     <div className="px-6 lg:px-12 py-20 min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="px-6 lg:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-12 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Blog
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Artículos sobre desarrollo, tecnología y experiencias
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar artículos..."
              className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>

          <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-wrap gap-3 items-center`}>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todas las categorías</option>
              {allCategories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>

            <button
              onClick={handleOrderToggle}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Calendar className="w-4 h-4" />
              {order === 'desc' ? 'Más recientes' : 'Más antiguos'}
            </button>

            {(searchTerm || selectedCategory) && (
              <button onClick={clearFilters} className="px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:underline">
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
        {posts && posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No se encontraron artículos
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {/* Mejora, en caso de que no haya posts */}
              {posts?.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="block group">
                  <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-xl hover:border-purple-500 dark:hover:border-purple-400 transition-all">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                          {post.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                          <span>{formatDate(post.date_created)}</span>
                          {post.category && (
                            <>
                              <span>•</span>
                              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
                                {post.category}
                              </span>
                            </>
                          )}
                          {post.author && (
                            <>
                              <span>•</span>
                              <span>{post.author}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {post.excerpt && (
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3 text-sm">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium text-sm group-hover:gap-2 transition-all">
                      Leer más
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(pagination.pages)].map((_, idx) => {
                    const page = idx + 1;
                    if (
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1.5 rounded-lg border text-sm ${
                            currentPage === page
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2 text-gray-500">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                  disabled={currentPage === pagination.pages}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}