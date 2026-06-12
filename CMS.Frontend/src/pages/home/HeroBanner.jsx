import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './HeroBanner.css';

export default function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-overlay"></div>
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-tag animate-slideDown">Bộ Sưu Tập Mùa Hè 2026</span>
          <h1 className="hero-title animate-fadeIn">
            Định Hình Phong Cách <br />
            <span className="title-highlight">Thời Trang Mới</span>
          </h1>
          <p className="hero-desc animate-fadeIn">
            Khám phá những thiết kế mới nhất mang đậm phong cách tối giản, thanh lịch nhưng không kém phần nổi bật. Giảm giá tới 40% cho tất cả đơn hàng đầu tiên.
          </p>
          <div className="hero-actions animate-slideUp">
            <Link to="/shop" className="hero-btn-primary">
              <span>Mua Ngay</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/blog" className="hero-btn-secondary">
              Xem Xu Hướng
            </Link>
          </div>
        </div>
        <div className="hero-image-box animate-fadeIn">
          <div className="hero-image-backdrop"></div>
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"
            alt="Fashion Summer 2026"
            className="hero-main-img"
          />
        </div>
      </div>
    </section>
  );
}
