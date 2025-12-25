import { type SuiClientOptions } from '@mysten/sui/client';

// Sui Devnet Configuration
export const SUI_DEVNET_RPC = 'https://fullnode.devnet.sui.io:443';
export const SUI_TESTNET_RPC = 'https://fullnode.testnet.sui.io:443';
export const SUI_MAINNET_RPC = 'https://fullnode.mainnet.sui.io:443';

// Active Network (Change to testnet/mainnet as needed)
export const ACTIVE_NETWORK = 'devnet';

// Smart Contract Package ID (Update after deployment)
export const CHARITY_PACKAGE_ID = '0x35b528c652fd5fb02132b08babc35d7055c85ee173db05cb2597a23b889c3834';

// Module name
export const CHARITY_MODULE = 'charity_platform';

// Sui Client config
export const suiClientConfig: SuiClientOptions = {
  url: SUI_DEVNET_RPC,
};

// Gas budget
export const DEFAULT_GAS_BUDGET = 10000000; // 0.01 SUI
