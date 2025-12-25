import { useSignAndExecuteTransaction, useCurrentAccount, useConnectWallet } from '@mysten/dapp-kit';
import { useSuiClient } from '../context/SuiContext';

export const useWalletConnection = () => {
  const account = useCurrentAccount();
  const { mutate: connectWallet } = useConnectWallet();

  return {
    account,
    isConnected: !!account,
    connect: () => {
      // connectWallet requires wallet selection, users need to click the ConnectButton
      // This is a no-op placeholder to maintain the same interface
      console.log('Wallet connection triggered');
    },
  };
};

export const useTransactionExecution = () => {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const client = useSuiClient();

  const executeTransaction = async (tx: any) => {
    return new Promise((resolve, reject) => {
      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: async (result) => {
            try {
              const txResult = await client.waitForTransaction({
                digest: result.digest,
              });
              resolve(txResult);
            } catch (error) {
              reject(error);
            }
          },
          onError: (error) => {
            reject(error);
          },
        }
      );
    });
  };

  return { executeTransaction };
};
