import { useState } from 'react';
import Header from '../components/Header';
import { Plus, Search, Edit2, Trash2, Eye, Star } from 'lucide-react';
import { useCategoryContext } from '../context/CategoryContext';
import './GenericPage.css';
import './ProductsPage.css';

const statusConfig = {
  active: { label: 'Còn hàng', cls: 'status-completed' },
  out_of_stock: { label: 'Hết hàng', cls: 'status-cancelled' },
  inactive: { label: 'Ẩn', cls: 'status-pending' },
};

export default function ProductsPage() {
  const { products, categories, getCategoryName } = useCategoryContext();
  const [search, setSearch] = useState('');
  const [view, setView] = useState('table');
  const [filterCat, setFilterCat] = useState('all');

  const filtered = products.filter(p => {
    const catName = getCategoryName(p.categoryId);
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      catName.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || String(p.categoryId) === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="page">
      <Header title="Quản Lý Sản Phẩm" subtitle="Danh sách toàn bộ sản phẩm trong hệ thống" />
      <div className="page-body">
        <div className="card animate-fadeInUp">
          <div className="gp-toolbar">
            <div className="gp-search">
              <Search size={15} />
              <input
                placeholder="Tìm sản phẩm, danh mục..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="cat-filter-select"
              value={filterCat}
              onChange={e => setFilterCat(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(c => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>
            <div className="view-toggle">
              <button className={`vt-btn ${view === 'table' ? 'active' : ''}`} onClick={() => setView('table')}>☰</button>
              <button className={`vt-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>⊞</button>
            </div>
            <div className="gp-actions">
              <button className="btn-primary"><Plus size={14} /> Thêm sản phẩm</button>
            </div>
          </div>

          {view === 'table' ? (
            <>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Danh mục</th>
                      <th>Giá bán</th>
                      <th>Tồn kho</th>
                      <th>Đánh giá</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => {
                      const s = statusConfig[p.status];
                      const categoryName = getCategoryName(p.categoryId);
                      return (
                        <tr key={p.id} className="table-row">
                          <td>
                            <div className="product-cell">
                              <div className="product-thumb">{p.name.charAt(0)}</div>
                              <span className="product-cell-name">{p.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="category-tag">{categoryName}</span>
                          </td>
                          <td className="amount">{p.price}</td>
                          <td>
                            <span className={`stock-badge ${p.stock === 0 ? 'zero' : p.stock < 10 ? 'low' : 'ok'}`}>
                              {p.stock === 0 ? 'Hết' : p.stock}
                            </span>
                          </td>
                          <td>
                            <div className="rating-cell">
                              <Star size={12} fill="#fbbf24" color="#fbbf24" />
                              <span>{p.rating}</span>
                            </div>
                          </td>
                          <td><span className={`status-badge ${s.cls}`}>{s.label}</span></td>
                          <td>
                            <div className="action-btns">
                              <button className="action-btn view"><Eye size={14} /></button>
                              <button className="action-btn edit"><Edit2 size={14} /></button>
                              <button className="action-btn delete"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="gp-pagination">
                <span className="page-info">Hiển thị {filtered.length} / {products.length} sản phẩm</span>
                <div className="page-btns">
                  <button className="page-btn">‹</button>
                  <button className="page-btn active">1</button>
                  <button className="page-btn">›</button>
                </div>
              </div>
            </>
          ) : (
            <div className="product-grid">
              {filtered.map((p) => {
                const s = statusConfig[p.status];
                const categoryName = getCategoryName(p.categoryId);
                return (
                  <div key={p.id} className="product-grid-card">
                    <div className="pgc-thumb">{p.name.charAt(0)}</div>
                    <h4 className="pgc-name">{p.name}</h4>
                    <span className="category-tag">{categoryName}</span>
                    <div className="pgc-footer">
                      <span className="pgc-price">{p.price}</span>
                      <span className={`status-badge ${s.cls}`}>{s.label}</span>
                    </div>
                    <div className="pgc-actions">
                      <button className="action-btn edit"><Edit2 size={14} /></button>
                      <button className="action-btn delete"><Trash2 size={14} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
