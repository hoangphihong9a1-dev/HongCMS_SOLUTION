import { useState } from 'react';
import Header from '../components/Header';
import { Plus, Search, Edit2, Trash2, Mail, Phone } from 'lucide-react';
import './GenericPage.css';
import './SharedComponents.css';

const customers = [
  { id: 1, name: 'Nguyễn Văn An', email: 'an.nguyen@email.com', phone: '0901234567', orders: 12, spent: '45.200.000đ', joined: '2025-01-15', status: 'active' },
  { id: 2, name: 'Trần Thị Bình', email: 'binh.tran@email.com', phone: '0912345678', orders: 5, spent: '8.750.000đ', joined: '2025-03-20', status: 'active' },
  { id: 3, name: 'Lê Minh Cường', email: 'cuong.le@email.com', phone: '0923456789', orders: 28, spent: '120.000.000đ', joined: '2024-11-05', status: 'vip' },
  { id: 4, name: 'Phạm Thị Dung', email: 'dung.pham@email.com', phone: '0934567890', orders: 3, spent: '2.100.000đ', joined: '2025-05-01', status: 'active' },
  { id: 5, name: 'Hoàng Văn Em', email: 'em.hoang@email.com', phone: '0945678901', orders: 0, spent: '0đ', joined: '2026-01-10', status: 'inactive' },
  { id: 6, name: 'Vũ Thị Phương', email: 'phuong.vu@email.com', phone: '0956789012', orders: 19, spent: '67.400.000đ', joined: '2025-02-28', status: 'vip' },
  { id: 7, name: 'Đỗ Văn Giang', email: 'giang.do@email.com', phone: '0967890123', orders: 7, spent: '15.300.000đ', joined: '2025-06-14', status: 'active' },
];

const statusConfig = {
  active: { label: 'Hoạt động', cls: 'status-completed' },
  vip: { label: 'VIP', cls: 'status-vip' },
  inactive: { label: 'Không hoạt động', cls: 'status-cancelled' },
};

export default function CustomersPage() {
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <Header title="Quản Lý Khách Hàng" subtitle="Danh sách và thông tin khách hàng" />
      <div className="page-body">
        {/* Summary cards */}
        <div className="summary-row">
          <div className="summary-mini purple">
            <span className="sm-value">{customers.length}</span>
            <span className="sm-label">Tổng khách hàng</span>
          </div>
          <div className="summary-mini green">
            <span className="sm-value">{customers.filter(c => c.status === 'active').length}</span>
            <span className="sm-label">Đang hoạt động</span>
          </div>
          <div className="summary-mini gold">
            <span className="sm-value">{customers.filter(c => c.status === 'vip').length}</span>
            <span className="sm-label">Khách VIP</span>
          </div>
          <div className="summary-mini red">
            <span className="sm-value">{customers.filter(c => c.status === 'inactive').length}</span>
            <span className="sm-label">Không hoạt động</span>
          </div>
        </div>

        <div className="card animate-fadeInUp">
          <div className="gp-toolbar">
            <div className="gp-search">
              <Search size={15} />
              <input
                placeholder="Tìm theo tên, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="gp-actions">
              <button className="btn-primary"><Plus size={14} /> Thêm khách hàng</button>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Liên hệ</th>
                  <th>Đơn hàng</th>
                  <th>Tổng chi tiêu</th>
                  <th>Ngày tham gia</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const s = statusConfig[c.status];
                  return (
                    <tr key={c.id} className="table-row">
                      <td>
                        <div className="customer-cell">
                          <div className="customer-avatar" style={{
                            background: c.status === 'vip'
                              ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                              : 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                          }}>
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13.5px' }}>{c.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                            <Mail size={11} /> {c.email}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                            <Phone size={11} /> {c.phone}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.orders}</td>
                      <td className="amount">{c.spent}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{c.joined}</td>
                      <td><span className={`status-badge ${s.cls}`}>{s.label}</span></td>
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
            <span className="page-info">Hiển thị {filtered.length} / {customers.length} khách hàng</span>
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
