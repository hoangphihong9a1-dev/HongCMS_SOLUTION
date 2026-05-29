import { useState } from 'react';
import Header from '../components/Header';
import { Plus, Search, Filter, Edit2, Trash2, Eye } from 'lucide-react';
import './GenericPage.css';

export default function OrdersPage() {
  const [search, setSearch] = useState('');

  const orders = [
    { id: 1, code: '#DH001', customer: 'Nguyễn Văn An', date: '2026-05-29', total: '28.500.000đ', status: 'completed' },
    { id: 2, code: '#DH002', customer: 'Trần Thị Bình', date: '2026-05-28', total: '250.000đ', status: 'pending' },
    { id: 3, code: '#DH003', customer: 'Lê Minh Cường', date: '2026-05-28', total: '32.000.000đ', status: 'processing' },
    { id: 4, code: '#DH004', customer: 'Phạm Thị Dung', date: '2026-05-27', total: '320.000đ', status: 'completed' },
    { id: 5, code: '#DH005', customer: 'Hoàng Văn Em', date: '2026-05-26', total: '1.200.000đ', status: 'cancelled' },
    { id: 6, code: '#DH006', customer: 'Vũ Thị Phương', date: '2026-05-25', total: '4.800.000đ', status: 'completed' },
    { id: 7, code: '#DH007', customer: 'Đỗ Văn Giang', date: '2026-05-24', total: '680.000đ', status: 'pending' },
  ];

  const statusConfig = {
    completed: { label: 'Hoàn thành', cls: 'status-completed' },
    pending: { label: 'Chờ xử lý', cls: 'status-pending' },
    processing: { label: 'Đang xử lý', cls: 'status-processing' },
    cancelled: { label: 'Đã huỷ', cls: 'status-cancelled' },
  };

  const filtered = orders.filter(o =>
    o.code.toLowerCase().includes(search.toLowerCase()) ||
    o.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <Header title="Quản Lý Đơn Hàng" subtitle="Theo dõi và xử lý tất cả đơn hàng" />
      <div className="page-body">
        <div className="card animate-fadeInUp">
          <div className="gp-toolbar">
            <div className="gp-search">
              <Search size={15} />
              <input
                placeholder="Tìm đơn hàng, khách hàng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="gp-actions">
              <button className="btn-secondary"><Filter size={14} /> Lọc</button>
              <button className="btn-primary"><Plus size={14} /> Tạo đơn</button>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const s = statusConfig[o.status];
                  return (
                    <tr key={o.id} className="table-row">
                      <td className="order-id">{o.code}</td>
                      <td>
                        <div className="customer-cell">
                          <div className="customer-avatar">{o.customer.charAt(0)}</div>
                          {o.customer}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{o.date}</td>
                      <td className="amount">{o.total}</td>
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
            <span className="page-info">Hiển thị 1-{filtered.length} trong tổng {orders.length} đơn hàng</span>
            <div className="page-btns">
              <button className="page-btn">‹</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
