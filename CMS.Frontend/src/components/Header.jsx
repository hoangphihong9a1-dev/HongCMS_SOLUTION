import { Bell, Search, Moon, RefreshCw } from 'lucide-react';
import './Header.css';

export default function Header({ title, subtitle }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="page-title-wrap">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header-right">
        <div className="search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="search-input"
          />
          <kbd className="search-kbd">⌘K</kbd>
        </div>

        <button className="header-btn" title="Refresh">
          <RefreshCw size={16} />
        </button>

        <button className="header-btn notif-btn" title="Thông báo">
          <Bell size={16} />
          <span className="notif-badge">3</span>
        </button>

        <div className="header-avatar">
          <div className="avatar-img">PH</div>
          <div className="avatar-status" />
        </div>
      </div>
    </header>
  );
}
