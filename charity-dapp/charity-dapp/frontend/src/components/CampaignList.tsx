import React from 'react';
import CampaignCard from './CampaignCard';

const CampaignList: React.FC = () => {
  // Mock data - sẽ thay bằng data từ blockchain sau
  const campaigns = [
    {
      id: 1,
      category: 'education',
      icon: '🏫',
      title: 'Xây dựng lại trường học sau lũ lụt',
      description: 'Giúp đỡ các em học sinh vùng cao có nơi học tập tốt hơn sau thiên tai',
      currentAmount: 375.5,
      goalAmount: 500,
      daysLeft: 12,
    },
    {
      id: 2,
      category: 'health',
      icon: '🏥',
      title: 'Hỗ trợ điều trị cho trẻ em nghèo',
      description: 'Mang lại cơ hội chữa bệnh cho các em nhỏ có hoàn cảnh khó khăn',
      currentAmount: 225,
      goalAmount: 500,
      daysLeft: 8,
    },
    {
      id: 3,
      category: 'environment',
      icon: '🌳',
      title: 'Trồng 10,000 cây xanh',
      description: 'Cùng nhau xây dựng môi trường xanh, sạch, đẹp cho thế hệ tương lai',
      currentAmount: 450,
      goalAmount: 500,
      daysLeft: 5,
    },
    {
      id: 4,
      category: 'social',
      icon: '🍚',
      title: 'Bữa ăn cho người vô gia cư',
      description: 'Mỗi ngày một bữa ăn ấm, mang yêu thương đến người khó khăn',
      currentAmount: 155,
      goalAmount: 250,
      daysLeft: 20,
    },
    {
      id: 5,
      category: 'education',
      icon: '📚',
      title: 'Tủ sách cho trẻ em miền núi',
      description: 'Trao tri thức, thắp sáng tương lai cho các em nhỏ vùng cao',
      currentAmount: 95,
      goalAmount: 250,
      daysLeft: 15,
    },
    {
      id: 6,
      category: 'animals',
      icon: '🐕',
      title: 'Cứu hộ động vật bị bỏ rơi',
      description: 'Mang lại cơ hội sống mới cho những người bạn bốn chân',
      currentAmount: 82.5,
      goalAmount: 150,
      daysLeft: 10,
    },
  ];

  return (
    <section className="container" id="campaigns">
      <div className="section-header">
        <h2>Chiến dịch đang gây quỹ</h2>
        <p>Hãy là một phần của sự thay đổi tích cực</p>
      </div>

      <div className="campaigns-grid">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} {...campaign} />
        ))}
      </div>
    </section>
  );
};

export default CampaignList;