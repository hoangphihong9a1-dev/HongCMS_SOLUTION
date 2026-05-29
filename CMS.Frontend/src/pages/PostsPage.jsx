import { useState } from 'react';
import Header from '../components/Header';
import { Plus, Search, Edit2, Trash2, FileText, Eye, Calendar } from 'lucide-react';
import './GenericPage.css';

const posts = [
  { id: 1, title: 'Xu hướng công nghệ 2026: AI và tương lai', category: 'Công nghệ', author: 'Phi Hồng', date: '2026-05-28', views: 1240, status: 'published' },
  { id: 2, title: 'Top 10 sản phẩm bán chạy tháng 5', category: 'Tin tức', author: 'Phi Hồng', date: '2026-05-25', views: 875, status: 'published' },
  { id: 3, title: 'Hướng dẫn chọn laptop cho sinh viên', category: 'Hướng dẫn', author: 'Phi Hồng', date: '2026-05-20', views: 2310, status: 'published' },
  { id: 4, title: 'Bộ sưu tập thời trang hè 2026', category: 'Thời trang', author: 'Phi Hồng', date: '2026-05-18', views: 560, status: 'draft' },
  { id: 5, title: 'Review iPhone 15 Pro Max chi tiết', category: 'Công nghệ', author: 'Phi Hồng', date: '2026-05-15', views: 3890, status: 'published' },
  { id: 6, title: 'Công thức nấu cà phê đặc biệt', category: 'Ẩm thực', author: 'Phi Hồng', date: '2026-05-10', views: 0, status: 'draft' },
];

const statusConfig = {
  published: { label: 'Đã đăng', cls: 'status-completed' },
  draft: { label: 'Nháp', cls: 'status-pending' },
  archived: { label: 'Lưu trữ', cls: 'status-cancelled' },
};

export default function PostsPage() {
  const [search, setSearch] = useState('');

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <Header title="Quản Lý Bài Viết" subtitle="Quản lý nội dung và bài đăng" />
      <div className="page-body">
        <div className="card animate-fadeInUp">
          <div className="gp-toolbar">
            <div className="gp-search">
              <Search size={15} />
              <input
                placeholder="Tìm bài viết, danh mục..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="gp-actions">
              <button className="btn-primary"><Plus size={14} /> Viết bài mới</button>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Danh mục</th>
                  <th>Tác giả</th>
                  <th>Ngày đăng</th>
                  <th>Lượt xem</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const s = statusConfig[p.status];
                  return (
                    <tr key={p.id} className="table-row">
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '34px', height: '34px', minWidth: '34px',
                            background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))',
                            borderRadius: '8px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <FileText size={16} color="white" />
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13.5px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.title}
                          </span>
                        </div>
                      </td>
                      <td><span className="category-tag">{p.category}</span></td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{p.author}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                          <Calendar size={12} /> {p.date}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          <Eye size={13} color="var(--accent-tertiary)" />
                          {p.views.toLocaleString()}
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
            <span className="page-info">Hiển thị {filtered.length} / {posts.length} bài viết</span>
            <div className="page-btns">
              <button className="page-btn">‹</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
