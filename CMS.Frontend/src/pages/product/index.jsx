import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Plus, Minus, Tag, Check, AlertTriangle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import productService from '../../services/productService';
import './index.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === 'inc') {
      setQuantity(prev => prev + 1);
    } else if (type === 'dec' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  const formatPrice = (price) => {
    if (typeof price === 'string') return price;
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80';
    if (url.startsWith('http')) return url;
    return `https://localhost:7296${url.startsWith('/') ? '' : '/'}${url}`;
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="pd-spinner"></div>
        <p>Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <AlertTriangle size={48} className="error-icon" />
        <h2>Không tìm thấy sản phẩm</h2>
        <p>Sản phẩm này có thể đã bị xóa hoặc không tồn tại.</p>
        <Link to="/shop" className="back-btn">
          <ArrowLeft size={16} /> Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="detail-container">
        <Link to="/shop" className="back-to-shop-link">
          <ArrowLeft size={16} />
          <span>Quay lại cửa hàng</span>
        </Link>

        <div className="detail-grid">
          <div className="detail-image-box">
            <img
              src={getImageUrl(product.imageUrl)}
              alt={product.name}
              className="detail-main-img"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          <div className="detail-info-box">
            <div className="detail-category-badge">
              <Tag size={13} />
              <span>{product.categoryProduct?.name || 'Công nghệ'}</span>
            </div>

            <h1 className="detail-title">{product.name}</h1>

            <div className="detail-price-row">
              <span className="detail-price">{formatPrice(product.price)}</span>
            </div>

            <div className="detail-stock-row">
              <span className="stock-label">Trạng thái:</span>
              <span className={`stock-badge-detail ${product.stockQuantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stockQuantity > 0 ? `Còn hàng (${product.stockQuantity} sản phẩm)` : 'Hết hàng'}
              </span>
            </div>

            <div className="detail-desc-box">
              <h3>Mô tả sản phẩm</h3>
              <p>{product.description || 'Không có mô tả cho sản phẩm này.'}</p>
            </div>

            {product.stockQuantity > 0 && (
              <div className="detail-purchase-row">
                <div className="quantity-selector-detail">
                  <button onClick={() => handleQuantityChange('dec')} className="qty-btn">
                    <Minus size={14} />
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button onClick={() => handleQuantityChange('inc')} className="qty-btn">
                    <Plus size={14} />
                  </button>
                </div>

                <button onClick={handleAddToCart} className="add-to-cart-btn-detail">
                  <ShoppingCart size={18} />
                  <span>Thêm Vào Giỏ Hàng</span>
                </button>
              </div>
            )}

            {addedMessage && (
              <div className="added-success-alert">
                <Check size={16} />
                <span>Đã thêm {quantity} sản phẩm vào giỏ hàng thành công!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
