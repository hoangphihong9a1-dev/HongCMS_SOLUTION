import { useState } from 'react';
import Header from '../components/Header';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import './GenericPage.css';

const categories = [
  { id: 1, name: 'Công nghệ', slug: 'cong-nghe', posts: 24, description: 'Tin tức công nghệ, review sản phẩm', status: 'active' },
  { id: 2, name: 'Tin tức', slug: 'tin-tuc', posts: 18, description: 'Tin tức tổng hợp, cập nhật mới nhất', status: 'active' },
  { id: 3, name: 'Hướng dẫn', slug: 'huong-dan', posts: 31, description: 'Các bài hướng dẫn sử dụng sản phẩm', status: 'active' },
  { id: 4, name: 'Thời trang', slug: 'thoi-trang', posts: 12, description: 'Xu hướng thời trang, phong cách', status: 'active' },
  { id: 5, name: 'Ẩm thực', slug: 'am-thuc', posts: 8, description: 'Công thức nấu ăn, review nhà hàng', status: 'inactive' },
];

const colorPalette = ['#6366f1', '#06b6d4', '#10b981', '#8b5cf6', '#f59e0b'];

export default function CategoriesPage() {
  const [search, setSearch] = useState('');

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <Header title="Danh Mục Bài Viết" subtitle="Quản lý danh mục cho nội dung bài đăng" />
      <div className="page-body">
        <div className="card animate-fadeInUp">
          <div className="gp-toolbar">
            <div className="gp-search">
              <Search size={15} />
              <input
                placeholder="Tìm danh mục..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="gp-actions">
              <button className="btn-primary"><Plus size={14} /> Thêm danh mục</button>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Danh mục</th>
                  <th>Slug URL</th>
                  <th>Mô tả</th>
                  <th>Số bài viết</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat, i) => (
                  <tr key={cat.id} className="table-row">
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '34px', height: '34px', minWidth: '34px',
                          background: `${colorPalette[i % colorPalette.length]}20`,
                          border: `1px solid ${colorPalette[i % colorPalette.length]}30`,
                          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '16px'
                        }}>
                          {['🏷️', '📰', '📖', '👚', '🍜'][i % 5]}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
                      </div>
                    </td>
                    <td>
                      <code style={{ fontSize: '12px', background: 'var(--bg-secondary)', padding: '3px 8px', borderRadius: '4px', color: colorPalette[i % colorPalette.length] }}>
                        /{cat.slug}
                      </code>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '200px' }}>{cat.description}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{cat.posts}</td>
                    <td>
                      <span className={`status-badge ${cat.status === 'active' ? 'status-completed' : 'status-cancelled'}`}>
                        {cat.status === 'active' ? 'Hoạt động' : 'Ẩn'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn edit"><Edit2 size={14} /></button>
                        <button className="action-btn delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="gp-pagination">
            <span className="page-info">Hiển thị {filtered.length} / {categories.length} danh mục</span>
            <div className="page-btns">
              <button className="page-btn active">1</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
