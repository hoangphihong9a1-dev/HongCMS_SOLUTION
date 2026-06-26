import { Link } from 'react-router-dom';
import './CategoryMenu.css';

export default function CategoryMenu({ categories }) {
  // Biểu tượng tĩnh cho các loại danh mục
  const icons = ['👕', '👗', '👜', '👟', '🕶️', '⌚', '📦'];

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const baseUrl = (import.meta.env.VITE_API_URL || 'https://localhost:7296/api').replace(/\/api\/?$/, '');
    return `${baseUrl}${url}`;
  };

  return (
    <section className="category-menu-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-subtitle">Khám Phá Ngay</span>
          <h2 className="section-title">Danh Mục Sản Phẩm</h2>
        </div>

        <div className="category-menu-grid">
          {categories.map((cat, index) => (
            <Link
              to={`/shop?category=${cat.id}`}
              key={cat.id}
              className="category-menu-card"
            >
              <div className="category-menu-icon-wrap">
                {cat.imageUrl ? (
                  <img
                    src={getImageUrl(cat.imageUrl)}
                    alt={cat.name}
                    className="category-menu-img"
                  />
                ) : (
                  <span className="category-menu-icon">
                    {icons[index % icons.length]}
                  </span>
                )}
              </div>
              <h3 className="category-menu-name">{cat.name}</h3>
              {cat.description && <p className="category-menu-desc">{cat.description}</p>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
