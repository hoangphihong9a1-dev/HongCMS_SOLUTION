import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './RegisterPage.css';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc (*).');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await register({
        fullName,
        email,
        password,
        phone,
        address
      });
      // Register will auto-login the user and save session, so we can redirect immediately
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data || 
        err.message || 
        'Đăng ký tài khoản thất bại. Email có thể đã tồn tại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-card animate-fadeIn">
        <div className="register-card-header">
          <div className="register-icon-wrap">
            <UserPlus size={28} />
          </div>
          <h2>Tạo Tài Khoản Mới</h2>
          <p>Tham gia với HongCMS để có trải nghiệm mua sắm tốt nhất</p>
        </div>

        {error && (
          <div className="register-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-form-grid">
            {/* Full Name */}
            <div className="register-form-group">
              <label htmlFor="fullName">Họ và Tên *</label>
              <div className="register-input-wrapper">
                <User size={18} className="register-input-icon" />
                <input
                  type="text"
                  id="fullName"
                  placeholder="VD: Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="register-form-group">
              <label htmlFor="email">Email *</label>
              <div className="register-input-wrapper">
                <Mail size={18} className="register-input-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="VD: an.nguyen@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="register-form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <div className="register-input-wrapper">
                <Phone size={18} className="register-input-icon" />
                <input
                  type="tel"
                  id="phone"
                  placeholder="VD: 0909123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Address */}
            <div className="register-form-group">
              <label htmlFor="address">Địa chỉ</label>
              <div className="register-input-wrapper">
                <MapPin size={18} className="register-input-icon" />
                <input
                  type="text"
                  id="address"
                  placeholder="VD: Quận 1, TP. HCM"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="register-form-group">
              <label htmlFor="password">Mật khẩu *</label>
              <div className="register-input-wrapper">
                <Lock size={18} className="register-input-icon" />
                <input
                  type="password"
                  id="password"
                  placeholder="Ít nhất 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="register-form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label>
              <div className="register-input-wrapper">
                <Lock size={18} className="register-input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="register-submit-btn" disabled={loading}>
            {loading ? (
              <span className="register-spinner"></span>
            ) : (
              <span>Đăng Ký Tài Khoản</span>
            )}
          </button>
        </form>

        <div className="register-card-footer-text">
          <span>Đã có tài khoản? </span>
          <Link to="/login" state={{ from: location.state?.from }}>Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
}
