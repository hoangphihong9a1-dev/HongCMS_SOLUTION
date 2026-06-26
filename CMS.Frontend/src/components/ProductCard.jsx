import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  // Định dạng hiển thị ảnh từ API/Uploads hoặc ảnh mẫu ngẫu nhiên nếu trống
  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'; // Ảnh placeholder công nghệ
    if (url.startsWith('http')) return url;
    return `https://localhost:7296${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const formatPrice = (price) => {
    if (typeof price === 'string') return price;
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className="product-card animate-fadeIn">
      <div className="product-card-image-wrap">
        <Link to={`/product/${product.id}`}>
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            className="product-card-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80';
            }}
          />
        </Link>
        <span className="product-card-badge">Hot</span>
      </div>

      <div className="product-card-content">
        <span className="product-card-category">
          {product.categoryProduct?.name || 'Công nghệ'}
        </span>
        <h3 className="product-card-title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="product-card-footer">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          <button
            onClick={() => addToCart(product, 1)}
            className="product-card-cart-btn"
            title="Thêm vào giỏ"
          >
            <ShoppingCart size={15} />
            <span>Thêm</span>
          </button>
        </div>
      </div>
    </div>
  );
}
