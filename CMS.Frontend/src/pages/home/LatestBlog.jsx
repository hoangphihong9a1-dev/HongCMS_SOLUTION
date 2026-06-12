import { Link } from 'react-router-dom';
import PostCard from '../../components/PostCard';
import './LatestBlog.css';

export default function LatestBlog({ posts }) {
  // Lấy tối đa 3 bài viết mới nhất
  const latestPosts = posts.slice(0, 3);

  return (
    <section className="latest-blog-section">
      <div className="section-container">
        <div className="section-header-row">
          <div className="section-header-left">
            <span className="section-subtitle">Xu Hướng Thời Trang</span>
            <h2 className="section-title">Tin Tức Mới Nhất</h2>
          </div>
          <Link to="/blog" className="view-all-link">
            Xem tất cả bài viết
          </Link>
        </div>

        {latestPosts.length === 0 ? (
          <div className="empty-blog-msg">
            <p>Chưa có bài đăng tin tức nào.</p>
          </div>
        ) : (
          <div className="homepage-blog-grid">
            {latestPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
