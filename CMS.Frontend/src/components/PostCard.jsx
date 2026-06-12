import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import './PostCard.css';

export default function PostCard({ post }) {
  // Loại bỏ các thẻ HTML từ nội dung CKEditor
  const stripHtml = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const getExcerpt = (content, limit = 100) => {
    const text = stripHtml(content);
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };

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
    if (!url) return 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80';
    if (url.startsWith('http')) return url;
    return `https://localhost:7296${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <article className="post-card">
      <div className="post-card-image-wrap">
        <Link to={`/blog/${post.id}`}>
          <img
            src={getImageUrl(post.imageUrl)}
            alt={post.title}
            className="post-card-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </Link>
        {post.category && (
          <span className="post-card-category">{post.category.name}</span>
        )}
      </div>

      <div className="post-card-content">
        <div className="post-card-meta">
          <span className="meta-item">
            <Calendar size={13} />
            <span>{formatDate(post.createdDate || post.date)}</span>
          </span>
          <span className="meta-item">
            <User size={13} />
            <span>Admin</span>
          </span>
        </div>

        <h3 className="post-card-title">
          <Link to={`/blog/${post.id}`}>{post.title}</Link>
        </h3>

        <p className="post-card-excerpt">
          {getExcerpt(post.content, 90)}
        </p>

        <Link to={`/blog/${post.id}`} className="post-card-link">
          <span>Đọc tiếp</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
