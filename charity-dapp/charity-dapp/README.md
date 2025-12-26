# Charity DApp

**Mục đích:** Ứng dụng web để tạo và quản lý chiến dịch từ thiện trên Sui (frontend + Move smart contracts).

---

## 🔧 Yêu cầu trước
- Node.js (v16+)
- npm (v8+)
- Sui CLI (để build/run smart contracts) — chỉ cần khi bạn làm việc với folder `move`
- Ví Sui (ví trình duyệt) để tương tác (kết nối, donate, withdraw)

---

## 🚀 Cài đặt nhanh
Từ thư mục gốc của repository:

1. Cài dependencies frontend:

```bash
npm run install-frontend
```

2. (Tùy chọn) Build smart contracts (cần Sui CLI):

```bash
npm run install-move
# tương đương: cd move && sui move build
```

3. Chạy ứng dụng ở môi trường phát triển:

```bash
npm start
# tương đương: cd frontend && npm start
```

Sau khi server khởi động, mở trình duyệt vào: `http://localhost:3000` (mặc định react-scripts dùng port 3000).

---

## 🧪 Chạy test
- Frontend tests:

```bash
cd frontend && npm test
```

- Move tests (nếu có và nếu bạn có Sui CLI):

```bash
cd move && sui move test
```

---

## ⚙️ Các lệnh hữu ích
- `npm run build` — build frontend cho production
- `npm run install-frontend` — install deps frontend
- `npm run install-move` — build move (sui move build)

---

## 🧭 Hướng dẫn sử dụng app (ngắn gọn)
1. Mở `http://localhost:3000` và kết nối ví Sui của bạn.
2. Tạo chiến dịch mới bằng form `Create Campaign` (chỉ owner mới có thể withdraw sau khi đạt mục tiêu).
3. Người dùng khác có thể donate thông qua modal `Donate`.
4. Sau khi đạt mục tiêu, owner có thể rút tiền (withdraw).

> Lưu ý: Hành vi phụ thuộc vào mạng Sui bạn kết nối (localnet/devnet/mainnet).

---

## 📚 Tài liệu & nơi tham khảo
- Hướng dẫn tích hợp Sui frontend: `frontend/SUI_INTEGRATION_GUIDE.md`
- Smart contract guide: `move/SMART_CONTRACT_GUIDE.md`
- Demo / mô tả: `docs/DEMO.md`
- Mã nguồn chính:
  - Frontend: `frontend/src/` (components, pages, context)
  - Move: `move/sources/`

---

## 💡 Troubleshooting nhanh
- Nếu dev server không chạy, kiểm tra port (3000) đã được sử dụng chưa và xem logs trong terminal.
- Nếu build Move lỗi, đảm bảo `sui` CLI và các biến môi trường cần thiết đã cài đặt đúng.
- Nếu ví không kết nối, đảm bảo extension wallet active, trang web được phép kết nối.

---

Nếu muốn, mình có thể bổ sung phần hướng dẫn chi tiết từng bước (cài Sui CLI, cấu hình localnet, deploy contract) hoặc dịch README sang tiếng Anh. ✨
