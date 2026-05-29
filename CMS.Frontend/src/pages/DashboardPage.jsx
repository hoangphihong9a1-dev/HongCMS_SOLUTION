import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import {
  ShoppingCart, Package, Users, DollarSign,
  TrendingUp, Eye, Clock, CheckCircle
} from 'lucide-react';
import './DashboardPage.css';

const revenueData = [
  { month: 'T1', revenue: 4200000, orders: 32 },
  { month: 'T2', revenue: 5800000, orders: 45 },
  { month: 'T3', revenue: 4900000, orders: 38 },
  { month: 'T4', revenue: 7200000, orders: 56 },
  { month: 'T5', revenue: 6500000, orders: 49 },
  { month: 'T6', revenue: 8900000, orders: 72 },
  { month: 'T7', revenue: 7600000, orders: 61 },
  { month: 'T8', revenue: 9200000, orders: 78 },
  { month: 'T9', revenue: 8100000, orders: 65 },
  { month: 'T10', revenue: 10500000, orders: 88 },
  { month: 'T11', revenue: 9800000, orders: 82 },
  { month: 'T12', revenue: 12000000, orders: 102 },
];

const categoryData = [
  { name: 'Điện tử', value: 38, color: '#6366f1' },
  { name: 'Thời trang', value: 27, color: '#8b5cf6' },
  { name: 'Thực phẩm', value: 18, color: '#06b6d4' },
  { name: 'Gia dụng', value: 17, color: '#10b981' },
];

const recentOrders = [
  { id: '#DH001', customer: 'Nguyễn Văn An', product: 'iPhone 15 Pro', amount: '28.500.000đ', status: 'completed', time: '2 phút trước' },
  { id: '#DH002', customer: 'Trần Thị Bình', product: 'Áo thun basic', amount: '250.000đ', status: 'pending', time: '15 phút trước' },
  { id: '#DH003', customer: 'Lê Minh Cường', product: 'Laptop Dell XPS', amount: '32.000.000đ', status: 'processing', time: '1 giờ trước' },
  { id: '#DH004', customer: 'Phạm Thị Dung', product: 'Cà phê hảo hạng', amount: '320.000đ', status: 'completed', time: '2 giờ trước' },
  { id: '#DH005', customer: 'Hoàng Văn Em', product: 'Nồi cơm điện', amount: '1.200.000đ', status: 'cancelled', time: '3 giờ trước' },
];

const topProducts = [
  { name: 'iPhone 15 Pro Max', sold: 142, revenue: '4.26 tỷ', change: '+12%' },
  { name: 'Laptop Dell XPS 15', sold: 87, revenue: '2.78 tỷ', change: '+8%' },
  { name: 'Samsung Galaxy S24', sold: 95, revenue: '2.37 tỷ', change: '+5%' },
  { name: 'Tai nghe AirPods Pro', sold: 203, revenue: '1.01 tỷ', change: '+18%' },
  { name: 'Đồng hồ Apple Watch', sold: 76, revenue: '836 tr', change: '-2%' },
];

const statusConfig = {
  completed: { label: 'Hoàn thành', cls: 'status-completed' },
  pending: { label: 'Chờ xử lý', cls: 'status-pending' },
  processing: { label: 'Đang xử lý', cls: 'status-processing' },
  cancelled: { label: 'Đã huỷ', cls: 'status-cancelled' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name === 'revenue' ? 'Doanh thu: ' : 'Đơn hàng: '}
            <strong>
              {p.name === 'revenue'
                ? new Intl.NumberFormat('vi-VN').format(p.value) + 'đ'
                : p.value}
            </strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [chartTab, setChartTab] = useState('revenue');

  const formatRevenue = (val) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    return val;
  };

  return (
    <div className="page">
      <Header
        title="Dashboard"
        subtitle="Chào mừng trở lại, Phi Hồng 👋 — Tổng quan hệ thống hôm nay"
      />

      <div className="page-body">
        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            icon={DollarSign}
            label="Tổng Doanh Thu"
            value="94.8M đ"
            change="12.5%"
            changeType="up"
            color="purple"
            delay={0}
          />
          <StatCard
            icon={ShoppingCart}
            label="Tổng Đơn Hàng"
            value="768"
            change="8.2%"
            changeType="up"
            color="cyan"
            delay={80}
          />
          <StatCard
            icon={Package}
            label="Sản Phẩm"
            value="234"
            change="3.1%"
            changeType="up"
            color="green"
            delay={160}
          />
          <StatCard
            icon={Users}
            label="Khách Hàng"
            value="1,482"
            change="5.8%"
            changeType="up"
            color="orange"
            delay={240}
          />
        </div>

        {/* Charts Row */}
        <div className="charts-row">
          {/* Revenue Chart */}
          <div className="card chart-card large">
            <div className="card-header">
              <div>
                <h3 className="card-title">Biểu Đồ Doanh Thu & Đơn Hàng</h3>
                <p className="card-subtitle">Thống kê theo tháng trong năm 2026</p>
              </div>
              <div className="chart-tabs">
                <button
                  className={`chart-tab ${chartTab === 'revenue' ? 'active' : ''}`}
                  onClick={() => setChartTab('revenue')}
                >
                  Doanh thu
                </button>
                <button
                  className={`chart-tab ${chartTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setChartTab('orders')}
                >
                  Đơn hàng
                </button>
              </div>
            </div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: '#475569', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={chartTab === 'revenue' ? formatRevenue : (v) => v}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {chartTab === 'revenue' ? (
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fill="url(#revenueGrad)"
                      dot={false}
                      activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                    />
                  ) : (
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      fill="url(#ordersGrad)"
                      dot={false}
                      activeDot={{ r: 5, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="card chart-card small">
            <div className="card-header">
              <div>
                <h3 className="card-title">Danh Mục</h3>
                <p className="card-subtitle">Tỷ lệ sản phẩm</p>
              </div>
            </div>
            <div className="chart-wrap pie-wrap">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {categoryData.map((item) => (
                  <div key={item.name} className="pie-legend-item">
                    <span className="pie-dot" style={{ background: item.color }} />
                    <span className="pie-name">{item.name}</span>
                    <span className="pie-pct">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="bottom-row">
          {/* Recent Orders */}
          <div className="card orders-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Đơn Hàng Gần Đây</h3>
                <p className="card-subtitle">5 đơn hàng mới nhất</p>
              </div>
              <a href="/orders" className="view-all-btn">Xem tất cả →</a>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã ĐH</th>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>Số tiền</th>
                    <th>Trạng thái</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const s = statusConfig[order.status];
                    return (
                      <tr key={order.id} className="table-row">
                        <td className="order-id">{order.id}</td>
                        <td className="customer-cell">
                          <div className="customer-avatar">
                            {order.customer.charAt(0)}
                          </div>
                          {order.customer}
                        </td>
                        <td className="product-name">{order.product}</td>
                        <td className="amount">{order.amount}</td>
                        <td>
                          <span className={`status-badge ${s.cls}`}>{s.label}</span>
                        </td>
                        <td className="time-cell">
                          <Clock size={12} />
                          {order.time}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="card products-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Sản Phẩm Bán Chạy</h3>
                <p className="card-subtitle">Top 5 tháng này</p>
              </div>
            </div>
            <div className="top-products">
              {topProducts.map((product, index) => {
                const isPositive = product.change.startsWith('+');
                return (
                  <div key={index} className="top-product-item">
                    <div className="product-rank">{index + 1}</div>
                    <div className="product-info">
                      <span className="product-name-top">{product.name}</span>
                      <span className="product-sold">{product.sold} đã bán</span>
                    </div>
                    <div className="product-metrics">
                      <span className="product-revenue">{product.revenue}</span>
                      <span className={`product-change ${isPositive ? 'positive' : 'negative'}`}>
                        {product.change}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="quick-stat">
                <TrendingUp size={16} className="qs-icon green" />
                <div>
                  <div className="qs-value">94.8%</div>
                  <div className="qs-label">Tỷ lệ hoàn thành</div>
                </div>
              </div>
              <div className="quick-stat">
                <CheckCircle size={16} className="qs-icon purple" />
                <div>
                  <div className="qs-value">4.8 ⭐</div>
                  <div className="qs-label">Đánh giá TB</div>
                </div>
              </div>
              <div className="quick-stat">
                <Eye size={16} className="qs-icon cyan" />
                <div>
                  <div className="qs-value">12.4K</div>
                  <div className="qs-label">Lượt xem/ngày</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
