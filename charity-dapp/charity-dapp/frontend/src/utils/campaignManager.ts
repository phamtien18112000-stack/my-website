import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, MODULE_NAME, REGISTRY_ID, mistToSui } from '../config/constants';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  creator: string;
  goal: number; // in SUI
  raised: number; // in SUI
  deadline: number; // timestamp
  beneficiary: string;
  createdAt: number;
}

export interface CreateCampaignParams {
  title: string;
  description: string;
  goal: number; // in SUI
  durationDays: number;
  beneficiary: string;
}

/**
 * Build transaction để tạo campaign mới
 */
export function buildCreateCampaignTx(params: CreateCampaignParams): Transaction {
  const tx = new Transaction();
  
  const deadlineMs = Date.now() + params.durationDays * 24 * 60 * 60 * 1000;
  const goalInMist = Math.floor(params.goal * 1_000_000_000);

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::create_campaign`,
    arguments: [
      tx.object(REGISTRY_ID), // registry
      tx.pure.string(params.title),
      tx.pure.string(params.description),
      tx.pure.u64(goalInMist),
      tx.pure.u64(deadlineMs),
      tx.pure.address(params.beneficiary),
    ],
  });

  return tx;
}

/**
 * Build transaction để donate vào campaign
 */
export function buildDonateTx(campaignId: string, amountSui: number): Transaction {
  const tx = new Transaction();
  
  const amountInMist = Math.floor(amountSui * 1_000_000_000);
  
  // Split coins từ gas
  const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist)]);

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::donate`,
    arguments: [
      tx.object(campaignId),
      coin,
    ],
  });

  return tx;
}

/**
 * Build transaction để withdraw funds
 */
export function buildWithdrawTx(campaignId: string): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::withdraw_funds`,
    arguments: [
      tx.object(campaignId),
    ],
  });

  return tx;
}

/**
 * Query tất cả campaigns từ on-chain
 */
export async function fetchAllCampaigns(client: SuiClient): Promise<Campaign[]> {
  try {
    // Query tất cả Campaign objects
    const response = await client.getOwnedObjects({
      filter: {
        StructType: `${PACKAGE_ID}::${MODULE_NAME}::Campaign`
      },
      options: {
        showContent: true,
        showType: true,
      }
    });

    const campaigns: Campaign[] = [];

    for (const item of response.data) {
      if (item.data?.content && 'fields' in item.data.content) {
        const fields = item.data.content.fields as any;
        
        campaigns.push({
          id: item.data.objectId,
          title: bytesToString(fields.title),
          description: bytesToString(fields.description),
          creator: fields.creator,
          goal: mistToSui(parseInt(fields.goal)),
          raised: mistToSui(parseInt(fields.raised || '0')),
          deadline: parseInt(fields.deadline),
          beneficiary: fields.beneficiary,
          createdAt: parseInt(fields.created_at),
        });
      }
    }

    // Sort by created date (newest first)
    return campaigns.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
}

/**
 * Query 1 campaign cụ thể
 */
export async function fetchCampaign(client: SuiClient, campaignId: string): Promise<Campaign | null> {
  try {
    const response = await client.getObject({
      id: campaignId,
      options: {
        showContent: true,
      }
    });

    if (!response.data?.content || !('fields' in response.data.content)) {
      return null;
    }

    const fields = response.data.content.fields as any;

    return {
      id: campaignId,
      title: bytesToString(fields.title),
      description: bytesToString(fields.description),
      creator: fields.creator,
      goal: mistToSui(parseInt(fields.goal)),
      raised: mistToSui(parseInt(fields.raised || '0')),
      deadline: parseInt(fields.deadline),
      beneficiary: fields.beneficiary,
      createdAt: parseInt(fields.created_at),
    };
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }
}

/**
 * Helper: Convert bytes array to string
 */
function bytesToString(bytes: number[] | string): string {
  if (typeof bytes === 'string') return bytes;
  return new TextDecoder().decode(new Uint8Array(bytes));
}

/**
 * Helper: Check if campaign is active
 */
export function isCampaignActive(campaign: Campaign): boolean {
  return Date.now() < campaign.deadline;
}

/**
 * Helper: Get campaign progress percentage
 */
export function getCampaignProgress(campaign: Campaign): number {
  if (campaign.goal === 0) return 0;
  return Math.min((campaign.raised / campaign.goal) * 100, 100);
}

/**
 * Helper: Format time remaining
 */
export function getTimeRemaining(deadline: number): string {
  const now = Date.now();
  const diff = deadline - now;

  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
  return 'Less than 1 hour';
}