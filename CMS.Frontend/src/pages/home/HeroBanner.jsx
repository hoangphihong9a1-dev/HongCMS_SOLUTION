import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroBanner.css';

const slides = [
  {
    tag: "Siêu Phẩm Công Nghệ 2026",
    title: "Trải Nghiệm Công Nghệ\nĐột Phá & Đẳng Cấp",
    desc: "Khám phá các thiết bị công nghệ chính hãng mới nhất từ điện thoại, laptop đến phụ kiện thông minh. Cam kết chất lượng, bảo hành chính hãng và trả góp 0%.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    link: "/shop",
    linkText: "Mua Ngay",
    isPost: false
  },
  {
    tag: "Thế Giới Laptop Gaming",
    title: "Sức Mạnh Vượt Trội\nChiến Game Đỉnh Cao",
    desc: "Sở hữu các dòng laptop gaming cực mượt, cấu hình khủng Intel Core Ultra, card RTX 40-series thế hệ mới nhất. Nhận ngay bộ quà tặng trị giá 2 triệu đồng.",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
    link: "/shop?category=2",
    linkText: "Khám Phá",
    isPost: false
  },
  {
    tag: "Tin Tức & Đánh Giá",
    title: "Cập Nhật Công Nghệ\nĐánh Giá Chuyên Sâu",
    desc: "Theo dõi tin tức sự kiện nóng hổi và các bài viết review chi tiết các siêu phẩm công nghệ như iPhone 15 Pro Max, Apple Watch Ultra 2 từ các chuyên gia.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    link: "/blog",
    linkText: "Đọc Ngay",
    isPost: true
  }
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[current];

  return (
    <section className="hero-banner">
      <div className="hero-overlay"></div>
      
      {/* Navigation Arrows */}
      <button className="hero-nav-btn prev" onClick={handlePrev} aria-label="Previous slide">
        <ChevronLeft size={24} />
      </button>
      <button className="hero-nav-btn next" onClick={handleNext} aria-label="Next slide">
        <ChevronRight size={24} />
      </button>

      <div className="hero-container" key={current}>
        <div className="hero-content">
          <span className="hero-tag animate-slideDown">{slide.tag}</span>
          <h1 className="hero-title animate-fadeIn">
            {slide.title.split('\n')[0]} <br />
            <span className="title-highlight">{slide.title.split('\n')[1]}</span>
          </h1>
          <p className="hero-desc animate-fadeIn">{slide.desc}</p>
          <div className="hero-actions animate-slideUp">
            <Link to={slide.link} className="hero-btn-primary">
              <span>{slide.linkText}</span>
              <ArrowRight size={16} />
            </Link>
            {!slide.isPost ? (
              <Link to="/blog" className="hero-btn-secondary">
                Tin Tức Công Nghệ
              </Link>
            ) : (
              <Link to="/shop" className="hero-btn-secondary">
                Đến Cửa Hàng
              </Link>
            )}
          </div>
        </div>
        <div className="hero-image-box animate-fadeIn">
          <div className="hero-image-backdrop"></div>
          <img
            src={slide.image}
            alt={slide.tag}
            className="hero-main-img"
          />
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="hero-indicators">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`indicator-dot ${current === idx ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
