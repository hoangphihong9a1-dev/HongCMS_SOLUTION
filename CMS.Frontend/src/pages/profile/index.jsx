import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { User, ShoppingBag, MapPin, Phone, Mail, Clock, ShieldCheck, AlertCircle, X, Eye, Edit2, Trash2, Check, AlertTriangle } from 'lucide-react';
import './index.css';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'orders'
  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    password: user?.password || ''
  });

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Modal Edit States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [editDetails, setEditDetails] = useState([]);
  const [editCustomer, setEditCustomer] = useState({
    id: 0,
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });
  const [modalMessage, setModalMessage] = useState({ type: '', text: '' });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch orders
  useEffect(() => {
    if (user && activeTab === 'orders') {
      const fetchOrders = async () => {
        try {
          setOrdersLoading(true);
          const res = await orderService.getCustomerOrders(user.id);
          setOrders(res.data || res || []);
        } catch (err) {
          console.error('Error fetching customer orders:', err);
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchOrders();
    }
  }, [user, activeTab]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Cập nhật thông tin cá nhân thành công!' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setIsEditing(false);
    setEditNotes(order.notes || '');
    setEditDetails(order.orderDetails ? [...order.orderDetails] : []);
    setEditCustomer({
      id: order.customer?.id || user.id,
      fullName: order.customer?.fullName || user.fullName || user.name || '',
      email: order.customer?.email || user.email || '',
      phone: order.customer?.phone || user.phone || '',
      address: order.customer?.address || user.address || '',
      password: order.customer?.password || user.password || ''
    });
    setModalMessage({ type: '', text: '' });
  };

  const handleEditQty = (productId, type) => {
    setEditDetails(prev => prev.map(item => {
      if (item.productId === productId) {
        let newQty = item.quantity;
        if (type === 'inc') newQty += 1;
        if (type === 'dec' && item.quantity > 1) newQty -= 1;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveItem = (productId) => {
    if (editDetails.length <= 1) {
      setModalMessage({ type: 'error', text: 'Đơn hàng phải có ít nhất 1 sản phẩm. Để hủy đơn, hãy bấm nút Hủy đơn hàng bên dưới.' });
      return;
    }
    setEditDetails(prev => prev.filter(item => item.productId !== productId));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setModalMessage({ type: '', text: '' });
    try {
      const payload = {
        ...selectedOrder,
        notes: editNotes,
        customer: editCustomer,
        orderDetails: editDetails
      };
      await orderService.updateOrder(selectedOrder.id, payload);
      
      // Update orders state
      setOrders(prev => prev.map(o => {
        if (o.id === selectedOrder.id) {
          return {
            ...o,
            notes: editNotes,
            customer: { ...o.customer, ...editCustomer },
            orderDetails: editDetails
          };
        }
        return o;
      }));

      // Update selectedOrder
      setSelectedOrder(prev => ({
        ...prev,
        notes: editNotes,
        customer: { ...prev.customer, ...editCustomer },
        orderDetails: editDetails
      }));

      // Update main profile form default states
      setFormData(prev => ({
        ...prev,
        fullName: editCustomer.fullName,
        email: editCustomer.email,
        phone: editCustomer.phone,
        address: editCustomer.address
      }));

      // Update Context
      try {
        await updateProfile({
          fullName: editCustomer.fullName,
          phone: editCustomer.phone,
          address: editCustomer.address,
          email: editCustomer.email,
          password: formData.password
        });
      } catch (err) {
        console.error('Error synchronizing profile details:', err);
      }

      setIsEditing(false);
      setModalMessage({ type: 'success', text: 'Cập nhật chi tiết đơn hàng thành công!' });
    } catch (err) {
      console.error(err);
      setModalMessage({ type: 'error', text: 'Không thể cập nhật đơn hàng. Vui lòng thử lại.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
    setSaving(true);
    setModalMessage({ type: '', text: '' });
    try {
      const payload = {
        ...selectedOrder,
        status: 4 // Cancel
      };
      await orderService.updateOrder(selectedOrder.id, payload);
      
      // Update orders state
      setOrders(prev => prev.map(o => {
        if (o.id === selectedOrder.id) {
          return { ...o, status: 4 };
        }
        return o;
      }));

      // Update selectedOrder
      setSelectedOrder(prev => ({ ...prev, status: 4 }));
      setIsEditing(false);
      setModalMessage({ type: 'success', text: 'Đã hủy đơn hàng thành công.' });
    } catch (err) {
      console.error(err);
      setModalMessage({ type: 'error', text: 'Không thể hủy đơn hàng. Vui lòng thử lại.' });
    } finally {
      setSaving(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 0: return { label: 'Chờ duyệt', className: 'status-pending' };
      case 1: return { label: 'Đã xác nhận', className: 'status-confirmed' };
      case 2: return { label: 'Đang giao', className: 'status-shipping' };
      case 3: return { label: 'Đã giao', className: 'status-delivered' };
      case 4: return { label: 'Đã hủy', className: 'status-cancelled' };
      default: return { label: 'Chờ duyệt', className: 'status-pending' };
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80';
    if (url.startsWith('http')) return url;
    return `https://localhost:7296${url.startsWith('/') ? '' : '/'}${url}`;
  };

  if (!user) return null;

  return (
    <div className="profile-page-container">
      <div className="profile-wrapper">
        {/* Sidebar Navigation */}
        <div className="profile-sidebar">
          <div className="profile-user-summary">
            <div className="profile-avatar">
              {formData.fullName.substring(0, 2).toUpperCase()}
            </div>
            <h3 className="profile-user-name">{formData.fullName}</h3>
            <p className="profile-user-role">Khách hàng thành viên</p>
          </div>

          <div className="profile-nav-menu">
            <button
              className={`profile-nav-item ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <User size={18} />
              <span>Thông tin tài khoản</span>
            </button>
            <button
              className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={18} />
              <span>Lịch sử đơn hàng</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="profile-content-area">
          {activeTab === 'info' ? (
            <div className="profile-card">
              <h2 className="profile-card-title">📝 Thông Tin Cá Nhân</h2>
              <p className="profile-card-subtitle">Quản lý và cập nhật thông tin tài khoản của bạn</p>

              {message.text && (
                <div className={`profile-alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                  {message.type === 'success' ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                  <span>{message.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Họ và tên</label>
                    <div className="input-with-icon">
                      <User size={16} className="input-icon" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Địa chỉ Email</label>
                    <div className="input-with-icon disabled">
                      <Mail size={16} className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        placeholder="email@example.com"
                      />
                    </div>
                    <span className="input-note">Không thể thay đổi email đăng nhập</span>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <div className="input-with-icon">
                      <Phone size={16} className="input-icon" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Số điện thoại của bạn"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Địa chỉ nhận hàng</label>
                    <div className="input-with-icon">
                      <MapPin size={16} className="input-icon" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Số nhà, tên đường, quận/huyện..."
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save-profile" disabled={saving}>
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="profile-card">
              <h2 className="profile-card-title">📦 Lịch Sử Đơn Hàng</h2>
              <p className="profile-card-subtitle">Theo dõi trạng thái và chi tiết các đơn hàng đã đặt</p>

              {ordersLoading ? (
                <div className="profile-orders-loading">
                  <div className="orders-spinner"></div>
                  <p>Đang tải danh sách đơn hàng...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="profile-orders-empty">
                  <ShoppingBag size={48} className="empty-orders-icon" />
                  <h4>Bạn chưa có đơn hàng nào</h4>
                  <p>Hãy khám phá các sản phẩm công nghệ của chúng tôi và đặt đơn hàng đầu tiên!</p>
                  <button onClick={() => navigate('/shop')} className="btn-shop-now">
                    Mua Sắm Ngay
                  </button>
                </div>
              ) : (
                <div className="profile-orders-list">
                  {orders.map(order => {
                    const statusInfo = getStatusLabel(order.status);
                    const totalOrderPrice = order.orderDetails?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;

                    return (
                      <div key={order.id} className="order-history-card">
                        <div className="order-history-header">
                          <div className="order-id-date">
                            <span className="order-id-label">Mã đơn hàng: #{order.id}</span>
                            <span className="order-date-label">
                              <Clock size={12} />
                              {formatDate(order.orderDate)}
                            </span>
                          </div>
                          <span className={`order-status-badge ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                        </div>

                        <div className="order-history-body">
                          {(order.orderDetails || []).slice(0, 2).map((item, idx) => (
                            <div key={idx} className="order-item-row">
                              <div className="order-item-info">
                                <span className="order-item-name">{item.product?.name || 'Sản phẩm công nghệ'}</span>
                                <span className="order-item-qty-price">
                                  {formatPrice(item.unitPrice)} x {item.quantity}
                                </span>
                              </div>
                              <span className="order-item-subtotal">
                                {formatPrice(item.unitPrice * item.quantity)}
                              </span>
                            </div>
                          ))}
                          {order.orderDetails && order.orderDetails.length > 2 && (
                            <div className="order-item-more-text">
                              và {order.orderDetails.length - 2} sản phẩm khác...
                            </div>
                          )}
                        </div>

                        {order.notes && (
                          <div className="order-history-notes">
                            <strong>Ghi chú:</strong> {order.notes}
                          </div>
                        )}

                        <div className="order-history-footer">
                          <button
                            className="btn-view-order-details"
                            onClick={() => handleSelectOrder(order)}
                          >
                            <Eye size={14} />
                            <span>Xem chi tiết</span>
                          </button>
                          <div className="order-history-total-wrap">
                            <span className="total-label">Tổng cộng:</span>
                            <span className="total-value">{formatPrice(totalOrderPrice)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal chi tiết & sửa đơn hàng */}
      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="order-modal-header">
              <h3>Chi tiết đơn hàng #{selectedOrder.id}</h3>
              <button className="order-modal-close" onClick={() => setSelectedOrder(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="order-modal-body">
              {modalMessage.text && (
                <div className={`profile-alert ${modalMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                  {modalMessage.type === 'success' ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
                  <span>{modalMessage.text}</span>
                </div>
              )}

              {/* Thông tin nhận hàng */}
              <div className="order-modal-section">
                <h4 className="section-title-modal">Thông tin giao hàng</h4>
                
                {isEditing ? (
                  <div className="order-modal-edit-fields">
                    <div className="modal-edit-field-group">
                      <label>Họ và tên người nhận</label>
                      <div className="modal-input-wrapper">
                        <User size={14} className="modal-input-icon" />
                        <input
                          type="text"
                          value={editCustomer.fullName}
                          onChange={(e) => setEditCustomer({ ...editCustomer, fullName: e.target.value })}
                          className="modal-edit-input"
                          placeholder="Họ và tên người nhận"
                        />
                      </div>
                    </div>
                    
                    <div className="modal-edit-field-group">
                      <label>Số điện thoại</label>
                      <div className="modal-input-wrapper">
                        <Phone size={14} className="modal-input-icon" />
                        <input
                          type="text"
                          value={editCustomer.phone}
                          onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
                          className="modal-edit-input"
                          placeholder="Số điện thoại nhận hàng"
                        />
                      </div>
                    </div>

                    <div className="modal-edit-field-group full-width">
                      <label>Địa chỉ Email</label>
                      <div className="modal-input-wrapper">
                        <Mail size={14} className="modal-input-icon" />
                        <input
                          type="email"
                          value={editCustomer.email}
                          onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
                          className="modal-edit-input"
                          placeholder="Địa chỉ email"
                        />
                      </div>
                    </div>

                    <div className="modal-edit-field-group full-width">
                      <label>Địa chỉ nhận hàng</label>
                      <div className="modal-input-wrapper">
                        <MapPin size={14} className="modal-input-icon" />
                        <input
                          type="text"
                          value={editCustomer.address}
                          onChange={(e) => setEditCustomer({ ...editCustomer, address: e.target.value })}
                          className="modal-edit-input"
                          placeholder="Địa chỉ giao hàng chi tiết"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="order-modal-info-grid">
                    <div className="info-item">
                      <User size={14} className="info-icon" />
                      <span><strong>Người nhận:</strong> {selectedOrder.customer?.fullName || formData.fullName}</span>
                    </div>
                    <div className="info-item">
                      <Phone size={14} className="info-icon" />
                      <span><strong>Số điện thoại:</strong> {selectedOrder.customer?.phone || formData.phone || 'Chưa cung cấp'}</span>
                    </div>
                    <div className="info-item">
                      <MapPin size={14} className="info-icon" />
                      <span><strong>Địa chỉ:</strong> {selectedOrder.customer?.address || formData.address || 'Chưa cung cấp'}</span>
                    </div>
                    <div className="info-item">
                      <Mail size={14} className="info-icon" />
                      <span><strong>Email:</strong> {selectedOrder.customer?.email || user.email || 'Chưa cung cấp'}</span>
                    </div>
                    <div className="info-item">
                      <Clock size={14} className="info-icon" />
                      <span><strong>Ngày đặt hàng:</strong> {formatDate(selectedOrder.orderDate)}</span>
                    </div>
                  </div>
                )}
                
                {isEditing ? (
                  <div className="form-group edit-notes-form">
                    <label>Sửa ghi chú đơn hàng</label>
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Nhập ghi chú mới cho đơn hàng..."
                      rows={2}
                      className="edit-notes-textarea"
                    />
                  </div>
                ) : (
                  selectedOrder.notes && (
                    <div className="order-modal-notes">
                      <strong>Ghi chú khách hàng:</strong> {selectedOrder.notes}
                    </div>
                  )
                )}
              </div>

              {/* Trình theo dõi trạng thái */}
              <div className="order-modal-section">
                <h4 className="section-title-modal">Trạng thái xử lý</h4>
                <div className="order-steps-container">
                  <div className={`step-item ${selectedOrder.status >= 0 ? 'active' : ''}`}>
                    <span className="step-number">1</span>
                    <span className="step-label">Chờ duyệt</span>
                  </div>
                  <div className={`step-item ${selectedOrder.status >= 1 && selectedOrder.status !== 4 ? 'active' : ''}`}>
                    <span className="step-number">2</span>
                    <span className="step-label">Xác nhận</span>
                  </div>
                  <div className={`step-item ${selectedOrder.status >= 2 && selectedOrder.status !== 4 ? 'active' : ''}`}>
                    <span className="step-number">3</span>
                    <span className="step-label">Đang giao</span>
                  </div>
                  <div className={`step-item ${selectedOrder.status === 3 ? 'completed' : selectedOrder.status === 4 ? 'cancelled' : ''}`}>
                    <span className="step-number">4</span>
                    <span className="step-label">{selectedOrder.status === 4 ? 'Đã hủy' : 'Đã giao'}</span>
                  </div>
                </div>
              </div>

              {/* Danh sách sản phẩm mua / Sửa số lượng */}
              <div className="order-modal-section">
                <div className="section-header-modal-row">
                  <h4 className="section-title-modal">Danh sách sản phẩm mua</h4>
                  {selectedOrder.status === 0 && !isEditing && (
                    <button className="btn-edit-order-trigger" onClick={() => setIsEditing(true)}>
                      <Edit2 size={12} />
                      <span>Sửa đơn hàng</span>
                    </button>
                  )}
                </div>
                
                <div className="order-products-table">
                  {(isEditing ? editDetails : (selectedOrder.orderDetails || [])).map((item, idx) => (
                    <div key={idx} className="modal-product-row">
                      <img
                        src={getImageUrl(item.product?.imageUrl)}
                        alt={item.product?.name}
                        className="modal-product-img"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div className="modal-product-details">
                        <Link
                          to={`/product/${item.productId}`}
                          className="modal-product-name"
                          onClick={() => setSelectedOrder(null)}
                        >
                          {item.product?.name || 'Sản phẩm công nghệ'}
                        </Link>
                        <div className="modal-product-price-qty">
                          {formatPrice(item.unitPrice)}
                        </div>
                      </div>

                      {/* Editing quantity block */}
                      {isEditing ? (
                        <div className="modal-edit-qty-controls">
                          <button onClick={() => handleEditQty(item.productId, 'dec')} className="qty-edit-btn">-</button>
                          <span className="qty-edit-value">{item.quantity}</span>
                          <button onClick={() => handleEditQty(item.productId, 'inc')} className="qty-edit-btn">+</button>
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            className="btn-remove-item-modal"
                            title="Xóa sản phẩm này"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="modal-product-qty-static">
                          x {item.quantity}
                        </div>
                      )}

                      <div className="modal-product-total">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-modal-footer">
              <div className="modal-total-summary">
                <span>Tổng thanh toán:</span>
                <strong className="modal-total-amount">
                  {formatPrice(
                    (isEditing ? editDetails : (selectedOrder.orderDetails || [])).reduce(
                      (sum, item) => sum + item.quantity * item.unitPrice,
                      0
                    )
                  )}
                </strong>
              </div>
              
              <div className="modal-footer-actions">
                {isEditing ? (
                  <>
                    <button className="btn-cancel-edit" onClick={() => setIsEditing(false)}>Hủy</button>
                    <button className="btn-save-edit" onClick={handleSaveChanges}>Lưu thay đổi</button>
                  </>
                ) : (
                  <>
                    {selectedOrder.status === 0 && (
                      <button className="btn-cancel-order" onClick={handleCancelOrder}>Hủy đơn hàng</button>
                    )}
                    <button className="btn-close-modal" onClick={() => setSelectedOrder(null)}>Đóng</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
