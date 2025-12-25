import React from 'react';

const Hero: React.FC = () => {
  const handleDonateNow = () => {
    // Cuộn xuống phần danh sách chiến dịch
    document.getElementById('campaigns')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateCampaign = () => {
    // Thông báo hoặc điều hướng đến component tạo chiến dịch
    alert('Tính năng tạo chiến dịch đang được phát triển!');
  };

  return (
    <section className="hero">
      <div className="hero-overlay"></div> {/* Lớp phủ tối cho ảnh nền - Nội dung mới */}
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">Nền tảng thiện nguyện minh bạch</h1>
          <p className="hero-subtitle">Kết nối yêu thương - Chia sẻ hạnh phúc</p>
          <p className="hero-description">
            Chúng tôi là cầu nối tin cậy giữa những tấm lòng hảo tâm và những hoàn cảnh khó khăn. 
            Mọi đóng góp của bạn đều được minh bạch trên Sui Blockchain và đến đúng người cần giúp đỡ.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={handleDonateNow}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z"/>
              </svg>
              Quyên góp ngay
            </button>
            <button className="btn btn-secondary" onClick={handleCreateCampaign}>
              Tạo chiến dịch
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;