# 📁 Cấu Trúc Dự Án Charity DApp

## Tổng Quan Dự Án
Dự án Charity DApp là một ứng dụng phi tập trung để quản lý các chiến dịch từ thiện. Bao gồm Frontend (React/TypeScript) và Smart Contracts (Move language trên Sui).

---

## 📂 Cấu Trúc Thư Mục Chính

```
charity-dapp/
├── 📄 README.md
├── 📄 .gitignore
├── 📁 docs/
├── 📁 frontend/
└── 📁 move/
```

---

## 📋 Chi Tiết Cấu Trúc

### 📁 **docs/** - Tài Liệu
Chứa các tài liệu dự án:
```
docs/
├── DEMO.md          # Hướng dẫn demo dự án
└── PITCH.mds        # Pitch/Giới thiệu dự án
```

---

### 📁 **frontend/** - Ứng Dụng React

```markdown
# 📁 Cấu Trúc Dự Án — charity-dapp

## Tổng quan
Tài liệu này mô tả cấu trúc thư mục hiện tại của workspace `charity-dapp` (frontend React + smart contracts Move trên Sui).

---

## Cây thư mục chính (tóm tắt)

```
charity-dapp/
├── package.json
├── STRUCTURE.md
├── docs/
│   ├── DEMO.md
│   └── PITCH.mds
├── frontend/
└── move/
```

---

## Chi tiết theo thư mục

### docs/
```
docs/
├── DEMO.md
└── PITCH.mds
```

---

### frontend/ (React + TypeScript)

```
frontend/
├── package.json
├── README.md
├── SUI_INTEGRATION_GUIDE.md
├── tsconfig.json
├── build/
│   ├── asset-manifest.json
│   ├── index.html
│   └── static/
│       ├── css/main.004c35e4.css
│       └── js/
│           ├── main.54e0d522.js
│           └── main.54e0d522.js.LICENSE.txt
├── public/
│   └── index.html
└── src/
    ├── App.css
    ├── App.tsx
    ├── index.css
    ├── index.tsx
    ├── components/
    │   ├── CampaignCard.tsx
    │   ├── CampaignList.tsx
    │   ├── CreateCampaign.tsx
    │   ├── DonateModal.tsx
    │   ├── Features.tsx
    │   ├── Footer.tsx
    │   ├── Hero.tsx
    │   ├── Navbar.tsx
    │   └── StatsBar.tsx
    ├── config/
    │   └── suiConfig.ts
    ├── context/
    │   └── SuiContext.tsx
    ├── hooks/
    │   └── useSui.ts
    ├── pages/
    │   ├── CreateCampaignPage.tsx
    │   └── HomePage.tsx
    └── utils/
        ├── CampaignManager.ts
        ├── constants.ts
        └── suiTransactions.ts
```

---

### move/ (Sui Move smart contracts)

```
move/
├── deploy_output.txt
├── Move.toml
├── README.md
├── SMART_CONTRACT_GUIDE.md
├── build/
│   └── charity/
│       ├── BuildInfo.yaml
│       ├── bytecode_modules/
│       │   ├── charity_platform.mv
│       │   └── dependencies/
│       │       ├── MoveStdlib/
│       │       │   ├── address.mv
│       │       │   ├── ascii.mv
│       │       │   ├── bcs.mv
│       │       │   └── ...
│       │       └── Sui/
│       ├── debug_info/
│       │   ├── charity_platform.json
│       │   └── charity_platform.mvd
│       └── sources/
│           └── charity_platform.move
├── sources/
│   └── charity.move
└── tests/
    └── charity_tests.move
```

---

## Tệp quan trọng (chỉ mục nhanh)
- Frontend entry: [frontend/src/index.tsx](frontend/src/index.tsx#L1)
- Frontend main: [frontend/src/App.tsx](frontend/src/App.tsx#L1)
- Smart contract source: [move/sources/charity.move](move/sources/charity.move#L1)
- Move config: [move/Move.toml](move/Move.toml#L1)

---

Nếu bạn muốn mình mở rộng mô tả cho từng file (mục đích, điểm bắt đầu phát triển, ví dụ chạy), mình sẽ cập nhật tiếp.

``` 

