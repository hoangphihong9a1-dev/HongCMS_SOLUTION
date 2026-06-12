import './LoadingOrEmpty.css';

export default function LoadingOrEmpty({ loading, isEmpty }) {
  if (loading) {
    return (
      <div className="shop-status-container">
        <div className="shop-spinner"></div>
        <p>Đang tìm kiếm sản phẩm...</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="shop-status-container empty-state">
        <div className="empty-icon">🔍</div>
        <h3>Không tìm thấy sản phẩm</h3>
        <p>Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc danh mục.</p>
      </div>
    );
  }

  return null;
}
