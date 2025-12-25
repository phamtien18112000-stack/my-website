# 📜 Smart Contract Guide - Charity Platform

## ✅ Hoàn Thành Các Functions

### 1. **create_campaign** - Tạo Chiến Dịch Từ Thiện
```move
public fun create_campaign(
    platform: &mut CharityPlatform,
    title: String,
    description: String,
    goal_amount: u64,
    deadline: u64,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**Chức năng:**
- Tạo một chiến dịch từ thiện mới
- Kiểm tra mục tiêu quyên góp > 0
- Kiểm tra deadline phải lớn hơn thời gian hiện tại
- Lưu campaign vào platform registry
- Phát hành event `CampaignCreated`

**Parameters:**
- `platform`: Platform object để lưu campaign
- `title`: Tên chiến dịch
- `description`: Mô tả chiến dịch
- `goal_amount`: Mục tiêu quyên góp (SUI)
- `deadline`: Thời gian kết thúc chiến dịch (timestamp)
- `clock`: Sui Clock để kiểm tra thời gian
- `ctx`: Transaction context

---

### 2. **donate** - Quyên Góp Cho Chiến Dịch
```move
public fun donate(
    campaign: &mut Campaign,
    payment: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**Chức năng:**
- Quyên góp tiền cho chiến dịch
- Kiểm tra chiến dịch còn hoạt động
- Kiểm tra deadline chưa hết
- Kiểm tra số tiền > 0
- Cập nhật số tiền quyên góp
- Theo dõi danh sách người quyên góp
- Tạo donation receipt cho người quyên góp
- Phát hành event `DonationMade`

**Parameters:**
- `campaign`: Campaign object
- `payment`: Coin<SUI> để quyên góp
- `clock`: Sui Clock
- `ctx`: Transaction context

**Output:**
- Gửi `DonationReceipt` tới người quyên góp

---

### 3. **withdraw** - Rút Tiền (Chỉ Khi Đạt Mục Tiêu)
```move
public fun withdraw(
    campaign: &mut Campaign,
    ctx: &mut TxContext
)
```

**Chức năng:**
- Rút tiền từ chiến dịch sau khi đạt mục tiêu
- Chỉ owner chiến dịch mới có thể rút
- Kiểm tra số tiền quyên góp >= mục tiêu
- Kiểm tra chiến dịch còn hoạt động
- Kiểm tra còn tiền trong balance
- Gửi tiền tới owner
- Đánh dấu chiến dịch là hoàn thành (is_active = false)
- Phát hành event `FundsWithdrawn`

**Parameters:**
- `campaign`: Campaign object
- `ctx`: Transaction context

**Requirements:**
- Phải là owner chiến dịch
- Số tiền quyên góp >= goal_amount
- Chiến dịch phải còn hoạt động

---

### 4. **cancel_campaign** - Hủy Chiến Dịch
```move
public fun cancel_campaign(
    campaign: &mut Campaign,
    ctx: &mut TxContext
)
```

**Chức năng:**
- Hủy chiến dịch
- Chỉ owner mới có thể hủy
- Đánh dấu chiến dịch là không hoạt động
- Phát hành event `CampaignCancelled`
- Sau khi hủy, người quyên góp có thể yêu cầu refund

**Parameters:**
- `campaign`: Campaign object
- `ctx`: Transaction context

---

### 5. **refund_donor** - Hoàn Lại Tiền (Sau Khi Hủy Chiến Dịch)
```move
public fun refund_donor(
    campaign: &mut Campaign,
    donor: address,
    ctx: &mut TxContext
)
```

**Chức năng:**
- Hoàn lại tiền cho người quyên góp (chỉ khi chiến dịch bị hủy)
- Kiểm tra chỉ owner mới có thể gọi
- Kiểm tra chiến dịch không còn hoạt động
- Kiểm tra donor có quyên góp
- Kiểm tra balance đủ tiền hoàn lại
- Gửi tiền hoàn lại tới donor
- Xóa người quyên góp khỏi danh sách
- Phát hành event `FundsRefunded`

**Parameters:**
- `campaign`: Campaign object
- `donor`: Địa chỉ người quyên góp cần hoàn lại tiền
- `ctx`: Transaction context

---

## 📊 View Functions (Chỉ Đọc)

### 1. **get_campaign_info** - Lấy Thông Tin Chiến Dịch
```move
public fun get_campaign_info(campaign: &Campaign): 
    (String, String, u64, u64, u64, bool)
```
Trả về: `(title, description, goal_amount, current_amount, deadline, is_active)`

### 2. **get_campaign_owner** - Lấy Địa Chỉ Owner
```move
public fun get_campaign_owner(campaign: &Campaign): address
```

### 3. **get_campaign_progress** - Lấy Tiến Độ Quyên Góp
```move
public fun get_campaign_progress(campaign: &Campaign): (u64, u64)
```
Trả về: `(current_amount, goal_amount)`

### 4. **get_donor_amount** - Lấy Số Tiền Quyên Góp Của Một Người
```move
public fun get_donor_amount(campaign: &Campaign, donor: address): u64
```

---

## 📢 Events

| Event | Khi Nào | Thông Tin |
|-------|---------|----------|
| `CampaignCreated` | Tạo chiến dịch | campaign_id, owner, title, goal_amount, deadline |
| `DonationMade` | Có người quyên góp | campaign_id, donor, amount |
| `FundsWithdrawn` | Owner rút tiền | campaign_id, owner, amount |
| `CampaignCancelled` | Hủy chiến dịch | campaign_id, owner |
| `FundsRefunded` | Hoàn lại tiền | campaign_id, donor, amount |

---

## ⚠️ Error Codes

| Error | Code | Ý Nghĩa |
|-------|------|---------|
| `EInvalidAmount` | 0 | Số tiền không hợp lệ (≤ 0) |
| `ECampaignNotActive` | 1 | Chiến dịch không hoạt động |
| `ENotCampaignOwner` | 2 | Không phải owner chiến dịch |
| `EGoalNotReached` | 3 | Chưa đạt mục tiêu quyên góp |
| `EDeadlinePassed` | 5 | Quá hạn chiến dịch |
| `EInvalidDeadline` | 6 | Deadline không hợp lệ |
| `ENoFundsToWithdraw` | 7 | Không có tiền để rút |

---

## 🔄 Luồng Sử Dụng Chính

### Scenario 1: Quyên Góp Thành Công
```
1. Owner tạo campaign (create_campaign)
   ↓
2. Donors quyên góp (donate)
   ↓
3. Khi đạt mục tiêu, owner rút tiền (withdraw)
   ↓
4. Campaign tự động đánh dấu là hoàn thành
```

### Scenario 2: Hủy & Hoàn Tiền
```
1. Owner tạo campaign (create_campaign)
   ↓
2. Donors quyên góp (donate)
   ↓
3. Owner quyết định hủy (cancel_campaign)
   ↓
4. Mỗi donor gọi hoàn tiền (refund_donor)
   ↓
5. Tiền được trả lại cho donors
```

---

## 🏗️ Data Structures

### Campaign
```move
public struct Campaign has key, store {
    id: UID,                        // Campaign ID
    owner: address,                 // Campaign owner
    title: String,                  // Campaign title
    description: String,            // Campaign description
    goal_amount: u64,               // Target amount in SUI
    current_amount: u64,            // Current donated amount
    deadline: u64,                  // Deadline timestamp
    is_active: bool,                // Is campaign active
    balance: Balance<SUI>,          // Campaign balance
    donors: Table<address, u64>,    // Donor address -> amount
}
```

### DonationReceipt
```move
public struct DonationReceipt has key, store {
    id: UID,
    campaign_id: ID,                // Campaign ID
    donor: address,                 // Donor address
    amount: u64,                    // Donation amount
    timestamp: u64,                 // Donation timestamp
}
```

---

## ✨ Cải Tiến Được Thêm Vào

1. ✅ **Event Emissions** - Theo dõi tất cả hoạt động
2. ✅ **Time-based Checks** - Kiểm tra deadline với Sui Clock
3. ✅ **Refund Logic** - Hoàn tiền khi chiến dịch bị hủy
4. ✅ **Better Error Handling** - Thêm error codes chi tiết
5. ✅ **Donor Tracking** - Theo dõi ai quyên góp bao nhiêu
6. ✅ **Receipt System** - Cấp biên lai cho mỗi quyên góp

---

**Status:** ✅ Smart Contract Hoàn Thành và Build Thành Công
