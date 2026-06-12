import { useEffect, useState } from 'react';
import PostCard from '../../components/PostCard';
import blogService from '../../services/blogService';
import './index.css';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="blog-page-wrap">
      <div className="blog-container">
        <div className="blog-header">
          <span className="blog-subtitle">Bài viết chia sẻ</span>
          <h1 className="blog-title">Tin Tức & Xu Hướng Thời Trang</h1>
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
          <div className="blog-grid">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
