import { useState } from 'react';
import Header from '../components/Header';
import { Plus, Search, Edit2, Trash2, Shield, User } from 'lucide-react';
import './GenericPage.css';

const users = [
  { id: 1, username: 'admin', fullName: 'Phi Hồng', email: 'phihong@hongcms.vn', role: 'admin', lastLogin: '2026-05-29', status: 'active' },
  { id: 2, username: 'editor01', fullName: 'Nguyễn Văn An', email: 'an@hongcms.vn', role: 'editor', lastLogin: '2026-05-28', status: 'active' },
  { id: 3, username: 'editor02', fullName: 'Trần Thị Bình', email: 'binh@hongcms.vn', role: 'editor', lastLogin: '2026-05-25', status: 'active' },
  { id: 4, username: 'viewer01', fullName: 'Lê Minh Cường', email: 'cuong@hongcms.vn', role: 'viewer', lastLogin: '2026-05-10', status: 'inactive' },
];

const roleConfig = {
  admin: { label: 'Admin', color: '#6366f1', bg: 'rgba(99,102,241,0.12)', icon: Shield },
  editor: { label: 'Editor', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', icon: User },
  viewer: { label: 'Viewer', color: '#10b981', bg: 'rgba(16,185,129,0.12)', icon: User },
};

export default function UsersPage() {
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <Header title="Quản Lý Người Dùng" subtitle="Tài khoản và phân quyền hệ thống" />
      <div className="page-body">
        <div className="card animate-fadeInUp">
          <div className="gp-toolbar">
            <div className="gp-search">
              <Search size={15} />
              <input
                placeholder="Tìm người dùng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="gp-actions">
              <button className="btn-primary"><Plus size={14} /> Thêm người dùng</button>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Đăng nhập lần cuối</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const r = roleConfig[u.role];
                  const RoleIcon = r.icon;
                  return (
                    <tr key={u.id} className="table-row">
                      <td>
                        <div className="customer-cell">
                          <div className="customer-avatar" style={{
                            background: u.role === 'admin'
                              ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                              : 'linear-gradient(135deg, #06b6d4, #10b981)'
                          }}>
                            {u.fullName.charAt(0)}
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13.5px' }}>
                            {u.fullName}
                          </span>
                        </div>
                      </td>
                      <td>
                        <code style={{ fontSize: '12.5px', background: 'var(--bg-secondary)', padding: '3px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                          @{u.username}
                        </code>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{u.email}</td>
                      <td>
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          background: r.bg, color: r.color,
                          padding: '4px 10px', borderRadius: '20px',
                          fontSize: '12px', fontWeight: 600
                        }}>
                          <RoleIcon size={12} />
                          {r.label}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{u.lastLogin}</td>
                      <td>
                        <span className={`status-badge ${u.status === 'active' ? 'status-completed' : 'status-cancelled'}`}>
                          {u.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
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
            <span className="page-info">Hiển thị {filtered.length} / {users.length} người dùng</span>
            <div className="page-btns">
              <button className="page-btn active">1</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
