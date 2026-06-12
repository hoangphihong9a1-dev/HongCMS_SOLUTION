import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import './ProductGrid.css';

export default function ProductGrid({ products }) {
  // Hiển thị tối đa 8 sản phẩm trên trang chủ
  const featuredProducts = products.slice(0, 8);

  return (
    <section className="product-grid-section">
      <div className="section-container">
        <div className="section-header-row">
          <div className="section-header-left">
            <span className="section-subtitle">Sản Phẩm Mới</span>
            <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
          </div>
          <Link to="/shop" className="view-all-link">
            Xem tất cả
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="empty-products-msg">
            <p>Hiện chưa có sản phẩm nào nổi bật.</p>
          </div>
        ) : (
          <div className="homepage-product-grid">
            {featuredProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
