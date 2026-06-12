import { Grid, List } from 'lucide-react';
import './ShopHeader.css';

export default function ShopHeader({
  totalCount,
  sortBy,
  setSortBy,
  searchTerm,
  setSearchTerm
}) {
  return (
    <div className="shop-page-header">
      <div className="sph-left">
        <h2 className="sph-title">Cửa Hàng</h2>
        <p className="sph-count">Hiển thị {totalCount} sản phẩm</p>
      </div>

      <div className="sph-right">
        {searchTerm && (
          <div className="search-term-badge">
            Từ khóa: <strong>"{searchTerm}"</strong>
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>×</button>
          </div>
        )}

        <div className="sort-dropdown-wrap">
          <label htmlFor="shop-sort">Sắp xếp:</label>
          <select
            id="shop-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="default">Mặc định</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="name-asc">Tên: A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}
