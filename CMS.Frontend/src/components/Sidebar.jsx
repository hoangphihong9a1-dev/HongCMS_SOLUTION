import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, Package, Users, Tag, FileText,
  UserCog, ChevronLeft, ChevronRight, Settings, Bell, Layers
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ShoppingCart, label: 'Đơn Hàng', path: '/orders' },
  { icon: Package, label: 'Sản Phẩm', path: '/products' },
  { icon: Users, label: 'Khách Hàng', path: '/customers' },
  { icon: Tag, label: 'Danh Mục SP', path: '/product-categories' },
  { icon: Layers, label: 'Danh Mục Bài', path: '/categories' },
  { icon: FileText, label: 'Bài Viết', path: '/posts' },
  { icon: UserCog, label: 'Người Dùng', path: '/users' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <span>H</span>
        </div>
        {!collapsed && (
          <div className="logo-text">
            <span className="logo-name">HongCMS</span>
            <span className="logo-sub">Admin Panel</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">{!collapsed && 'MAIN MENU'}</div>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
              title={collapsed ? item.label : ''}
            >
              <div className="nav-icon-wrap">
                <Icon size={19} />
                {isActive && <span className="active-dot" />}
              </div>
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {isActive && !collapsed && <span className="active-bar" />}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        {!collapsed && (
          <div className="sidebar-profile">
            <div className="profile-avatar">
              <span>PH</span>
            </div>
            <div className="profile-info">
              <span className="profile-name">Phi Hồng</span>
              <span className="profile-role">Administrator</span>
            </div>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
