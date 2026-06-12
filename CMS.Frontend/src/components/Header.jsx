import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import './Header.css';

export default function Header() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="shop-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <ShoppingBag className="logo-icon" />
          <span>Hong<span className="logo-accent">CMS</span></span>
        </Link>

        {/* Navigation */}
        <nav className="header-nav">
          <Link to="/" className="nav-link">Trang Chủ</Link>
          <Link to="/shop" className="nav-link">Cửa Hàng</Link>
          <Link to="/blog" className="nav-link">Tin Tức</Link>
        </nav>

        {/* Action Buttons */}
        <div className="header-actions">
          {/* Cart Icon */}
          <Link to="/cart" className="action-btn cart-btn" title="Giỏ hàng">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* User Account / Profile */}
          <div className="user-menu-container">
            {user ? (
              <>
                <button 
                  className="user-profile-btn" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  title="Tài khoản"
                >
                  <div className="user-avatar">
                    {user.name ? user.name.substring(0, 2).toUpperCase() : 'KH'}
                  </div>
                  <span className="user-name">{user.name}</span>
                </button>
                {dropdownOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <p className="user-fullname">{user.name}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    {/* Admin portal shortcut linking to ASP.NET Backend Portal */}
                    <a href="https://localhost:7296/" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                      <LayoutDashboard size={16} />
                      <span>Quản trị hệ thống</span>
                    </a>
                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                      <LogOut size={16} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="login-link">Đăng Nhập</Link>
                <Link to="/register" className="register-btn">Đăng Ký</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
