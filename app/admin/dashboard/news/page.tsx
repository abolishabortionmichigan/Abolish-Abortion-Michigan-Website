'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, RefreshCw, Search, Plus, Edit, Trash, Download } from 'lucide-react';
import { fetchNewsArticles, deleteNewsArticle } from '@/lib/actions/news-actions';
import { NewsArticle } from '@/types';
import { formatDate } from '@/lib/utils';
import NewsModal from '../../components/news-modal';

export default function NewsManagementPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const itemsPerPage = 25;
  const [modalOpen, setModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const loadArticles = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetchNewsArticles(false);
      if ('error' in res) {
        setError(true);
      } else {
        setArticles(res);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleCreate = () => {
    setSelectedArticle(null);
    setIsCreating(true);
    setModalOpen(true);
  };

  const handleEdit = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsCreating(false);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await deleteNewsArticle(id);
      if (!('error' in res)) {
        setArticles(articles.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Title', 'Slug', 'Excerpt', 'Published', 'Created', 'Updated'];
    const rows = filteredArticles.map((art) => [
      art.title,
      art.slug,
      art.excerpt.replace(/"/g, '""'),
      art.published ? 'Yes' : 'No',
      art.created_at ? new Date(art.created_at).toLocaleDateString() : '',
      art.updated_at ? new Date(art.updated_at).toLocaleDateString() : '',
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `news-articles-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredArticles = articles.filter((article) => {
    const search = searchTerm.toLowerCase();
    return (
      article.title?.toLowerCase().includes(search) ||
      article.excerpt?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">News Management</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" onClick={handleExportCSV} disabled={loading || articles.length === 0} title="Export CSV">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={loadArticles} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handleCreate} className="flex-shrink-0">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">New Article</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
          <p>Error fetching articles. Please try again.</p>
          <Button variant="outline" className="mt-2" onClick={loadArticles}>
            Retry
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Newspaper className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No articles yet</h3>
          <p className="text-sm text-gray-500 mt-2">Create your first news article to get started</p>
          <Button className="mt-4" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Article
          </Button>
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-4 font-medium">Title</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Date</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedArticles.map((article) => (
                    <tr key={article.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-[300px]">{article.excerpt}</p>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        {article.created_at ? formatDate(article.created_at) : 'N/A'}
                      </td>
                      <td className="p-4">
                        <Badge className={article.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {article.published ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(article.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile card layout */}
          <div className="sm:hidden space-y-3">
            {paginatedArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg border p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium line-clamp-2">{article.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">{article.excerpt}</p>
                  </div>
                  <Badge className={`flex-shrink-0 ${article.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {article.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-gray-400">
                    {article.created_at ? formatDate(article.created_at) : 'N/A'}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-lg border px-4 py-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({filteredArticles.length} total)
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <NewsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        article={selectedArticle}
        isCreating={isCreating}
        onSave={loadArticles}
      />
    </div>
  );
}

function Newspaper(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  );
}
