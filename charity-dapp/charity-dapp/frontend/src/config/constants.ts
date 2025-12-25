// ⚙️ SUI NETWORK CONFIG
export const NETWORK = 'testnet';

// 📦 SMART CONTRACT - THAY ĐỔI SAU KHI DEPLOY
export const PACKAGE_ID = '0xbd4458df5025b6aaefdeb7b3a262fb64b0f9b3bad44b77fd6e9eea7fb227b14c'; // Thay sau khi chạy: sui client publish
export const REGISTRY_ID = '0xd7d57a280f3d0da9c1a606d6e62013714cc69cce84a63431c7f069b585a6f354'; // Lấy từ deploy output
export const MODULE_NAME = 'charity_platform';

// 🔗 EXPLORER URLs
export const EXPLORER_URL = 'https://suiscan.xyz/testnet';

// 💰 CONVERSION
export const MIST_PER_SUI = 1_000_000_000;

// ⏰ TIME
export const MS_PER_DAY = 24 * 60 * 60 * 1000;

// 🎨 UI
export const MAX_CAMPAIGNS_DISPLAY = 50;

// Helper functions
export const suiToMist = (sui: number): number => sui * MIST_PER_SUI;
export const mistToSui = (mist: number): number => mist / MIST_PER_SUI;

export const getExplorerUrl = (type: 'tx' | 'object' | 'address', id: string): string => {
  return `${EXPLORER_URL}/${type}/${id}`;
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatSui = (mist: number): string => {
  return (mist / MIST_PER_SUI).toFixed(4);
};