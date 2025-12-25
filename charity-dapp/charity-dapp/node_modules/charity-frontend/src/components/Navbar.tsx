import React, { useState } from 'react';
import { ConnectButton } from '@mysten/dapp-kit';
import { useNavigate, Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // TODO: Implement search logic
  };

  const handleCreateCampaign = () => {
    // Chuyển hướng sang trang tạo chiến dịch
    // Lưu ý: Đảm bảo route trong App.tsx là '/create'
    navigate('/create');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo dùng Link để về trang chủ */}
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          🎗️ CharityChain
        </Link>

        {/* Search Bar */}
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm chiến dịch..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Nav Menu */}
        <ul className="nav-menu">
          {/* Ủng hộ Dropdown */}
          <li className="nav-item">
            <button className="nav-link-btn">
              Ủng hộ
              <span className="dropdown-icon">▼</span>
            </button>
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => navigate('/')}>
                <span className="dropdown-item-icon">🌟</span>
                <span>Tất cả chiến dịch</span>
              </div>
              <div className="dropdown-item">
                <span className="dropdown-item-icon">🏫</span>
                <span>Giáo dục</span>
              </div>
              <div className="dropdown-item">
                <span className="dropdown-item-icon">🏥</span>
                <span>Y tế</span>
              </div>
            </div>
          </li>

          {/* Giới thiệu Dropdown */}
          <li className="nav-item">
            <button className="nav-link-btn">
              Giới thiệu
              <span className="dropdown-icon">▼</span>
            </button>
            <div className="dropdown-menu">
              <div className="dropdown-item">
                <span className="dropdown-item-icon">ℹ️</span>
                <span>Về chúng tôi</span>
              </div>
              <div className="dropdown-item">
                <span className="dropdown-item-icon">⚙️</span>
                <span>Cách thức hoạt động</span>
              </div>
            </div>
          </li>
        </ul>

        {/* Buttons */}
        <div className="nav-buttons">
          <ConnectButton />
          <button className="btn-primary" onClick={handleCreateCampaign}>
            Tạo chiến dịch
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;