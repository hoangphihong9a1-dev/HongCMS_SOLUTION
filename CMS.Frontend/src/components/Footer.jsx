import { Link } from 'react-router-dom';
import { ShoppingBag, Phone, MapPin, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="shop-footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo">
              <ShoppingBag className="logo-icon" />
              <span>Hong<span className="logo-accent">CMS</span></span>
            </Link>
            <p className="brand-desc">
              Thương hiệu thời trang hàng đầu dành cho giới trẻ, luôn cập nhật những xu hướng thời trang mới nhất với chất lượng cao cấp và giá cả hợp lý.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Chính Sách</h4>
            <ul>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Chính sách đổi trả</a></li>
              <li><a href="#">Chính sách vận chuyển</a></li>
              <li><a href="#">Điều khoản dịch vụ</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Danh Mục</h4>
            <ul>
              <li><Link to="/shop">Tất cả sản phẩm</Link></li>
              <li><Link to="/shop">Quần áo nam</Link></li>
              <li><Link to="/shop">Váy đầm nữ</Link></li>
              <li><Link to="/blog">Tin tức phối đồ</Link></li>
            </ul>
          </div>

          <div className="footer-col contact-col">
            <h4>Liên Hệ</h4>
            <ul className="contact-info">
              <li>
                <MapPin size={16} />
                <span>123 Đường Ba Tháng Hai, Quận 10, TP. Hồ Chí Minh</span>
              </li>
              <li>
                <Phone size={16} />
                <span>0909 123 456</span>
              </li>
              <li>
                <Mail size={16} />
                <span>support@hongcmsfashion.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} HongCMS. Tất cả các quyền được bảo lưu. Thiết kế bởi Phi Hồng.</p>
        </div>
      </div>
    </footer>
  );
}
