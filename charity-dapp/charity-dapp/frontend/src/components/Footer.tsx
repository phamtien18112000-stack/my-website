import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <h4>Về CharityChain</h4>
          <ul>
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#">Cách thức hoạt động</a></li>
            <li><a href="#">Câu hỏi thường gặp</a></li>
          </ul>
        </div>

        <div>
          <h4>Chiến dịch</h4>
          <ul>
            <li><a href="#">Đang gây quỹ</a></li>
            <li><a href="#">Đã hoàn thành</a></li>
            <li><a href="#">Tạo chiến dịch mới</a></li>
          </ul>
        </div>

        <div>
          <h4>Hỗ trợ</h4>
          <ul>
            <li><a href="#">Trung tâm trợ giúp</a></li>
            <li><a href="#">Điều khoản sử dụng</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
          </ul>
        </div>

        <div>
          <h4>Kết nối</h4>
          <ul>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Telegram</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 CharityChain. Xây dựng trên Sui Blockchain.</p>
      </div>
    </footer>
  );
};

export default Footer;