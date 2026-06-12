import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, AlertTriangle } from 'lucide-react';
import blogService from '../../services/blogService';
import './detail.css';

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await blogService.getPostById(id);
        setPost(data);
      } catch (err) {
        console.error('Error fetching post details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80';
    if (url.startsWith('http')) return url;
    return `https://localhost:7296${url.startsWith('/') ? '' : '/'}${url}`;
  };

  if (loading) {
    return (
      <div className="blog-detail-loading">
        <div className="bd-spinner"></div>
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-detail-error">
        <AlertTriangle size={48} className="error-icon" />
        <h2>Không tìm thấy bài viết</h2>
        <p>Bài viết này có thể đã bị gỡ bỏ hoặc không tồn tại.</p>
        <Link to="/blog" className="back-btn">
          <ArrowLeft size={16} /> Quay lại tin tức
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <article className="blog-post-container">
        <Link to="/blog" className="back-to-blog-link">
          <ArrowLeft size={16} />
          <span>Quay lại danh sách</span>
        </Link>

        <header className="post-detail-header">
          {post.category && (
            <span className="post-detail-category">{post.category.name}</span>
          )}
          <h1 className="post-detail-title">{post.title}</h1>

          <div className="post-detail-meta">
            <span className="meta-item">
              <Calendar size={14} />
              <span>{formatDate(post.createdDate || post.date)}</span>
            </span>
            <span className="meta-item">
              <User size={14} />
              <span>Đăng bởi Admin</span>
            </span>
          </div>
        </header>

        <div className="post-detail-cover">
          <img
            src={getImageUrl(post.imageUrl)}
            alt={post.title}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>

        {post.content && (
          /<[a-z][\s\S]*>/i.test(post.content) ? (
            <div
              className="post-detail-body"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <div className="post-detail-body">
              {post.content.split('\n').map((paragraph, idx) => (
                <p key={idx} style={{ marginBottom: '1.2em' }}>{paragraph}</p>
              ))}
            </div>
          )
        )}
      </article>
    </div>
  );
}
