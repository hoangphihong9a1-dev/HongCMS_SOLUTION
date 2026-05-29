import './StatCard.css';

export default function StatCard({ icon: Icon, label, value, change, changeType, color, delay = 0 }) {
  const isPositive = changeType === 'up';
  const colorMap = {
    purple: { bg: 'rgba(99,102,241,0.12)', glow: 'rgba(99,102,241,0.3)', icon: '#818cf8' },
    cyan: { bg: 'rgba(6,182,212,0.12)', glow: 'rgba(6,182,212,0.3)', icon: '#22d3ee' },
    green: { bg: 'rgba(16,185,129,0.12)', glow: 'rgba(16,185,129,0.3)', icon: '#34d399' },
    orange: { bg: 'rgba(245,158,11,0.12)', glow: 'rgba(245,158,11,0.3)', icon: '#fbbf24' },
  };
  const c = colorMap[color] || colorMap.purple;

  return (
    <div
      className="stat-card"
      style={{
        animationDelay: `${delay}ms`,
        '--card-bg': c.bg,
        '--card-glow': c.glow,
        '--card-icon': c.icon,
      }}
    >
      <div className="stat-card-top">
        <div className="stat-icon-wrap">
          <Icon size={22} className="stat-icon" />
        </div>
        {change && (
          <span className={`stat-change ${isPositive ? 'up' : 'down'}`}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-card-glow" />
    </div>
  );
}
