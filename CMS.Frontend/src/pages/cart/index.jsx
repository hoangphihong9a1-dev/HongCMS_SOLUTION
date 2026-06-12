import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, CreditCard, ArrowLeft, CheckCircle, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import './index.css';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Form states
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');

  // Sync form states with logged-in user details when it loads
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      setLoading(true);

      let customerId = user?.id;

      if (!customerId) {
        // 1. Kiểm tra xem khách hàng có tồn tại chưa dựa vào email
        const customersRes = await orderService.getCustomers();
        const customers = customersRes.data || customersRes || [];
        let customer = customers.find(c => c.email.toLowerCase() === email.toLowerCase());

        // 2. Nếu chưa có, tạo khách hàng mới
        if (!customer) {
          const createRes = await orderService.createCustomer({
            fullName,
            email,
            phone,
            address
          });
          customer = createRes.data || createRes;
        }
        customerId = customer.id;
      }

      // 3. Tạo đơn hàng
      const orderRes = await orderService.createOrder({
        customerId: customerId,
        notes,
        items: cart
      });

      const orderData = orderRes.data || orderRes;

      // 4. Lưu đơn hàng thành công, hiển thị hoá đơn và xoá giỏ hàng
      setOrderSuccess({
        id: orderData.id,
        fullName,
        email,
        phone,
        address,
        total: cartTotal
      });
      clearCart();
    } catch (err) {
      console.error('Error during checkout:', err);
      alert('Đã xảy ra lỗi trong quá trình đặt hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Trang thái đặt hàng thành công
  if (orderSuccess) {
    return (
      <div className="checkout-success-page">
        <div className="success-card">
          <CheckCircle size={64} className="success-icon" />
          <h2>Đặt Hàng Thành Công!</h2>
          <p className="success-thank">Cảm ơn bạn đã mua sắm tại HongCMS. Đơn hàng của bạn đang được xử lý.</p>

          <div className="order-details-box">
            <h3>Thông Tin Đơn Hàng #{orderSuccess.id}</h3>
            <div className="details-grid-success">
              <div><span>Người nhận:</span> <strong>{orderSuccess.fullName}</strong></div>
              <div><span>Điện thoại:</span> <strong>{orderSuccess.phone}</strong></div>
              <div><span>Email:</span> <strong>{orderSuccess.email}</strong></div>
              <div><span>Địa chỉ:</span> <strong>{orderSuccess.address}</strong></div>
              <div className="success-total"><span>Tổng thanh toán:</span> <strong>{formatPrice(orderSuccess.total)}</strong></div>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/shop" className="btn-success-primary">Tiếp tục mua sắm</Link>
          </div>
        </div>
      </div>
    );
  }

  // Giỏ hàng trống
  if (cart.length === 0) {
    return (
      <div className="empty-cart-page">
        <div className="empty-cart-card">
          <ShoppingBag size={64} className="empty-cart-icon" />
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Hãy tham khảo các sản phẩm mới nhất của chúng tôi để chọn được món đồ ưng ý.</p>
          <Link to="/shop" className="btn-shop-now">Mua sắm ngay</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrap">
      <div className="cart-page-container">
        <h1 className="cart-page-title">Giỏ Hàng Của Bạn</h1>

        <div className="cart-layout-grid">
          {/* Danh sách sản phẩm bên trái */}
          <div className="cart-items-section">
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img
                    src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `https://localhost:7296${item.imageUrl.startsWith('/') ? '' : '/'}${item.imageUrl}`) : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=150&q=80'}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=150&q=80';
                    }}
                  />
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <span className="cart-item-price">{formatPrice(item.price)}</span>
                  </div>
                  <div className="cart-item-quantity-control">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="qty-ctrl-btn">
                      <Minus size={12} />
                    </button>
                    <span className="qty-ctrl-value">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="qty-ctrl-btn">
                      <Plus size={12} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="cart-item-delete-btn" title="Xóa">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <Link to="/shop" className="continue-shopping-btn">
              <ArrowLeft size={16} />
              <span>Tiếp tục mua hàng</span>
            </Link>
          </div>

          {/* Form đặt hàng & Tổng chi tiết bên phải */}
          <div className="cart-checkout-section">
            <div className="cart-summary-card">
              <h3 className="summary-title">Tóm tắt đơn hàng</h3>
              <div className="summary-row-item">
                <span>Tạm tính:</span>
                <span className="summary-value">{formatPrice(cartTotal)}</span>
              </div>
              <div className="summary-row-item">
                <span>Giao hàng:</span>
                <span className="summary-value green">Miễn phí</span>
              </div>
              <div className="summary-row-item total-row">
                <span>Tổng cộng:</span>
                <span className="summary-value total-value">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <div className="checkout-form-card">
              <h3 className="form-title">Thông tin giao hàng</h3>
              
              {!isAuthenticated && (
                <div className="checkout-login-prompt">
                  <Info size={16} className="info-icon" />
                  <span>
                    Đã có tài khoản? <Link to="/login" state={{ from: { pathname: '/cart' } }}>Đăng nhập ngay</Link> để tự động điền thông tin.
                  </span>
                </div>
              )}

              <form onSubmit={handleCheckout} className="checkout-form">
                <div className="form-group-item">
                  <label htmlFor="fullname">Họ và Tên *</label>
                  <input
                    type="text"
                    id="fullname"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>

                <div className="form-group-item">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="VD: an.nguyen@email.com"
                  />
                </div>

                <div className="form-group-item">
                  <label htmlFor="phone">Số điện thoại *</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="VD: 0909123456"
                  />
                </div>

                <div className="form-group-item">
                  <label htmlFor="address">Địa chỉ giao hàng *</label>
                  <input
                    type="text"
                    id="address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Số nhà, tên đường, quận/huyện..."
                  />
                </div>

                <div className="form-group-item">
                  <label htmlFor="notes">Ghi chú đơn hàng</label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Yêu cầu đặc biệt về đơn hàng (nếu có)..."
                    rows={3}
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-place-order">
                  <CreditCard size={18} />
                  <span>{loading ? 'Đang Xử Lý...' : 'Xác Nhận Đặt Hàng'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
