import React from 'react';

const StatsBar: React.FC = () => {
  return (
    <div className="container">
      <div className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>124+</h3>
            <p>Chiến dịch thành công</p>
          </div>
          <div className="stat-item">
            <h3>15,000+</h3>
            <p>Người ủng hộ</p>
          </div>
          <div className="stat-item">
            <h3>2,5M SUI</h3>
            <p>Đã quyên góp</p>
          </div>
          <div className="stat-item">
            <h3>100%</h3>
            <p>Minh bạch</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;