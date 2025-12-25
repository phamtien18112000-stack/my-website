import React from 'react';

const Features: React.FC = () => {
  return (
    <section className="features" id="how-it-works">
      <div className="section-header">
        <h2>Tại sao chọn CharityChain?</h2>
        <p>Nền tảng thiện nguyện đầu tiên trên Sui Blockchain tại Việt Nam</p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Minh bạch tuyệt đối</h3>
          <p>Mọi giao dịch được ghi nhận trên blockchain, không thể chỉnh sửa hay xóa bỏ</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Nhanh chóng</h3>
          <p>Giao dịch được xác nhận trong vài giây nhờ công nghệ Sui Blockchain</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Phí thấp</h3>
          <p>Chi phí giao dịch cực kỳ thấp so với các phương thức truyền thống</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🌍</div>
          <h3>Toàn cầu</h3>
          <p>Quyên góp từ bất kỳ đâu trên thế giới, không giới hạn địa lý</p>
        </div>
      </div>
    </section>
  );
};

export default Features;