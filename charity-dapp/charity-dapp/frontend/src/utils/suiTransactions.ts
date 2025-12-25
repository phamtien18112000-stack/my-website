import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { CHARITY_PACKAGE_ID, CHARITY_MODULE, DEFAULT_GAS_BUDGET } from '../config/suiConfig';

/**
 * Create a new charity campaign
 */
export async function createCampaignTx(
  platformId: string,
  title: string,
  description: string,
  goalAmount: number,
  deadline: number,
  clockId: string // Sui Clock object ID
) {
  const tx = new Transaction();

  tx.moveCall({
    target: `${CHARITY_PACKAGE_ID}::${CHARITY_MODULE}::create_campaign`,
    arguments: [
      tx.object(platformId),
      tx.pure.string(title),
      tx.pure.string(description),
      tx.pure.u64(goalAmount),
      tx.pure.u64(deadline),
      tx.object(clockId), // Clock object (usually '0x6')
    ],
    typeArguments: [],
  });

  return tx;
}

/**
 * Donate to a campaign
 */
export async function donateTx(
  campaignId: string,
  coin: string, // Coin object ID
  amount: number,
  clockId: string
) {
  const tx = new Transaction();

  // Split coin if needed (to send exact amount)
  const [splitCoin] = tx.splitCoins(tx.object(coin), [tx.pure.u64(amount)]);

  tx.moveCall({
    target: `${CHARITY_PACKAGE_ID}::${CHARITY_MODULE}::donate`,
    arguments: [
      tx.object(campaignId),
      splitCoin,
      tx.object(clockId),
    ],
    typeArguments: ['0x2::sui::SUI'],
  });

  return tx;
}

/**
 * Withdraw funds from campaign (only owner)
 */
export async function withdrawTx(campaignId: string) {
  const tx = new Transaction();

  tx.moveCall({
    target: `${CHARITY_PACKAGE_ID}::${CHARITY_MODULE}::withdraw`,
    arguments: [tx.object(campaignId)],
    typeArguments: [],
  });

  return tx;
}

/**
 * Cancel a campaign (only owner)
 */
export async function cancelCampaignTx(campaignId: string) {
  const tx = new Transaction();

  tx.moveCall({
    target: `${CHARITY_PACKAGE_ID}::${CHARITY_MODULE}::cancel_campaign`,
    arguments: [tx.object(campaignId)],
    typeArguments: [],
  });

  return tx;
}

/**
 * Refund a donor (only owner, after campaign is cancelled)
 */
export async function refundDonorTx(campaignId: string, donorAddress: string) {
  const tx = new Transaction();

  tx.moveCall({
    target: `${CHARITY_PACKAGE_ID}::${CHARITY_MODULE}::refund_donor`,
    arguments: [
      tx.object(campaignId),
      tx.pure.address(donorAddress),
    ],
    typeArguments: [],
  });

  return tx;
}

/**
 * Get campaign info from chain
 */
export async function getCampaignInfo(
  client: SuiClient,
  campaignId: string
) {
  try {
    const campaign = await client.getObject({
      id: campaignId,
      options: {
        showContent: true,
        showType: true,
      },
    });

    if (campaign.data?.content && 'fields' in campaign.data.content) {
      return campaign.data.content.fields;
    }

    return null;
  } catch (error) {
    console.error('Error fetching campaign info:', error);
    return null;
  }
}

/**
 * Get all campaigns from event indexing
 * (In production, you'd use a proper indexer)
 */
export async function getCampaignList(client: SuiClient) {
  try {
    // This is a simplified version
    // In production, use a proper indexer like Hasura or Covalent
    const events = await client.queryEvents({
      query: {
        MoveModule: {
          package: CHARITY_PACKAGE_ID,
          module: CHARITY_MODULE,
        },
      },
    });

    return events.data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
}

/**
 * Get user's coins for donation
 */
export async function getUserCoins(
  client: SuiClient,
  userAddress: string,
  coinType = '0x2::sui::SUI'
) {
  try {
    const coins = await client.getCoins({
      owner: userAddress,
      coinType,
    });

    return coins.data;
  } catch (error) {
    console.error('Error fetching user coins:', error);
    return [];
  }
}
