import { DollarSign } from 'lucide-react';
import './ShopSidebar.css';

export default function ShopSidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange
}) {
  const handlePriceChange = (e) => {
    setPriceRange(Number(e.target.value));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <aside className="shop-sidebar">
      <div className="sidebar-group">
        <h3 className="sidebar-title">Danh Mục</h3>
        <ul className="sidebar-list">
          <li>
            <button
              className={`sidebar-link ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              Tất cả danh mục
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat.id}>
              <button
                className={`sidebar-link ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-group price-filter-group">
        <h3 className="sidebar-title">Lọc Theo Giá</h3>
        <div className="price-slider-wrap">
          <input
            type="range"
            min="0"
            max="50000000"
            step="1000000"
            value={priceRange}
            onChange={handlePriceChange}
            className="price-slider"
          />
          <div className="price-labels">
            <span>Tối đa:</span>
            <span className="price-value">{formatPrice(priceRange)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
