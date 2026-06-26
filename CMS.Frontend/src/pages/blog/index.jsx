import { useEffect, useState } from 'react';
import PostCard from '../../components/PostCard';
import blogService from '../../services/blogService';
import './index.css';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await blogService.getAllPosts();
        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Tính toán phân trang
  const totalPages = Math.ceil(posts.length / pageSize);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="blog-page-wrap">
      <div className="blog-container">
        <div className="blog-header">
          <span className="blog-subtitle">Bài viết chia sẻ</span>
          <h1 className="blog-title">Tin Tức & Xu Hướng Công Nghệ</h1>
        </div>

        {loading ? (
          <div className="blog-loading">
            <div className="blog-spinner"></div>
            <p>Đang tải bài viết...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="blog-empty">
            <div className="empty-icon">📰</div>
            <h3>Chưa có bài viết nào</h3>
            <p>Danh sách bài viết sẽ sớm được cập nhật.</p>
          </div>
        ) : (
          <>
            <div className="blog-grid">
              {paginatedPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="blog-pagination">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="pag-btn"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`pag-num ${currentPage === idx + 1 ? 'active' : ''}`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="pag-btn"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
