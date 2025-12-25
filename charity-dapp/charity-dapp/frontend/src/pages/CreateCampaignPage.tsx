import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCampaignPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    goal: '',
    deadline: '',
  });

  const categoryIcons: { [key: string]: string } = {
    education: '🏫',
    health: '🏥',
    environment: '🌳',
    social: '🍚',
    animals: '🐕',
    other: '🌟',
  };

  const categoryNames: { [key: string]: string } = {
    education: 'Giáo dục',
    health: 'Y tế',
    environment: 'Môi trường',
    social: 'Xã hội',
    animals: 'Động vật',
    other: 'Khác',
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call smart contract to create campaign
    console.log('Creating campaign with data:', formData);
    alert('Chiến dịch đã được tạo thành công! (Demo mode)');
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc muốn đặt lại form?')) {
      setFormData({
        title: '',
        category: '',
        description: '',
        goal: '',
        deadline: '',
      });
    }
  };

  const handleBack = () => {
    if (window.confirm('Bạn có chắc muốn quay lại? Mọi thay đổi chưa lưu sẽ bị mất.')) {
      navigate('/');
    }
  };

  const calculateDaysLeft = (): number => {
    if (!formData.deadline) return 0;
    const deadline = new Date(formData.deadline);
    const today = new Date();
    const diffTime = Math.abs(deadline.getTime() - today.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div>
      {/* Page Header */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Tạo chiến dịch mới</h1>
        <p style={{ fontSize: '1.125rem', opacity: 0.95 }}>
          Bắt đầu hành trình lan tỏa yêu thương của bạn
        </p>
      </section>

      {/* Main Container */}
      <div className="container" style={{ marginTop: '-2rem', marginBottom: '4rem' }}>
        {/* Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          paddingBottom: '2rem',
          borderBottom: '2px solid #e5e7eb',
        }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#2563eb',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.5rem',
              fontWeight: 700,
            }}>1</div>
            <div style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 600 }}>
              Thông tin cơ bản
            </div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#e5e7eb',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.5rem',
              fontWeight: 700,
            }}>2</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Xem trước</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#e5e7eb',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.5rem',
              fontWeight: 700,
            }}>3</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Xuất bản</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Form Section */}
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>📝 Thông tin chiến dịch</h2>

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 600,
                  color: '#4b5563',
                  marginBottom: '0.5rem',
                }}>
                  Tiêu đề chiến dịch <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-input"
                  placeholder="VD: Xây dựng trường học cho trẻ em vùng cao"
                  maxLength={100}
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                />
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Tối đa 100 ký tự
                </div>
              </div>

              {/* Category */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 600,
                  color: '#4b5563',
                  marginBottom: '0.5rem',
                }}>
                  Danh mục <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  id="category"
                  className="form-select"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                >
                  <option value="">-- Chọn danh mục --</option>
                  <option value="education">🏫 Giáo dục</option>
                  <option value="health">🏥 Y tế</option>
                  <option value="environment">🌳 Môi trường</option>
                  <option value="social">🍚 Xã hội</option>
                  <option value="animals">🐕 Động vật</option>
                  <option value="other">🌟 Khác</option>
                </select>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 600,
                  color: '#4b5563',
                  marginBottom: '0.5rem',
                }}>
                  Mô tả chi tiết <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  id="description"
                  className="form-textarea"
                  placeholder="Mô tả chi tiết về mục đích, lý do..."
                  maxLength={500}
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    minHeight: '120px',
                    resize: 'vertical',
                  }}
                />
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Tối đa 500 ký tự
                </div>
              </div>

              {/* Goal */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 600,
                  color: '#4b5563',
                  marginBottom: '0.5rem',
                }}>
                  Mục tiêu quyên góp (SUI) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  id="goal"
                  className="form-input"
                  placeholder="VD: 1000"
                  min="1"
                  step="0.01"
                  required
                  value={formData.goal}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                />
              </div>

              {/* Deadline */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 600,
                  color: '#4b5563',
                  marginBottom: '0.5rem',
                }}>
                  Thời hạn <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="date"
                  id="deadline"
                  className="form-input"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.deadline}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleReset}
                  style={{ flex: 1 }}
                >
                  Đặt lại
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Xem trước chiến dịch →
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            position: 'sticky',
            top: '2rem',
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>👁️ Xem trước</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
              Chiến dịch của bạn sẽ hiển thị như thế này
            </p>

            {/* Campaign Preview Card */}
            <div className="campaign-card">
              <div className="campaign-image">
                {formData.category ? categoryIcons[formData.category] : '🎗️'}
              </div>
              <div className="campaign-content">
                <span className="campaign-category">
                  {formData.category ? categoryNames[formData.category] : 'Danh mục'}
                </span>
                <h3 className="campaign-title">
                  {formData.title || 'Tiêu đề chiến dịch'}
                </h3>
                <p className="campaign-description">
                  {formData.description || 'Mô tả chiến dịch sẽ hiển thị ở đây...'}
                </p>

                <div className="campaign-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '0%' }}></div>
                  </div>
                  <div className="progress-info">
                    <span className="progress-current">0 SUI</span>
                    <span className="progress-goal">
                      Mục tiêu: {formData.goal || '0'} SUI
                    </span>
                  </div>
                </div>

                <div className="campaign-footer">
                  <span className="campaign-meta">
                    Còn {calculateDaysLeft() || '--'} ngày
                  </span>
                  <button className="btn-donate">Ủng hộ</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button className="btn-secondary" onClick={handleBack}>
            ← Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignPage;