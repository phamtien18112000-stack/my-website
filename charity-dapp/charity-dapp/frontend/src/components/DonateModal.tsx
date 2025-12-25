import React, { useState } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Campaign, buildDonateTx } from '../utils/campaignManager';
import { getExplorerUrl } from '../config/constants';

interface DonateModalProps {
  campaign: Campaign;
  onClose: () => void;
  onSuccess: () => void;
}

export function DonateModal({ campaign, onClose, onSuccess }: DonateModalProps) {
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  
  const [amount, setAmount] = useState('');
  const [txDigest, setTxDigest] = useState('');
  const [error, setError] = useState('');

  const presetAmounts = [1, 5, 10, 25];

  const handleDonate = async () => {
    const donationAmount = parseFloat(amount);

    // Validation
    if (!amount || isNaN(donationAmount) || donationAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (donationAmount > campaign.goal - campaign.raised) {
      setError(`Campaign only needs ${(campaign.goal - campaign.raised).toFixed(2)} more SUI`);
      return;
    }

    setError('');

    try {
      const tx = buildDonateTx(campaign.id, donationAmount);

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log('Donation successful:', result);
            setTxDigest(result.digest);
            
            // Wait 2 seconds then refresh
            setTimeout(() => {
              onSuccess();
              onClose();
            }, 2000);
          },
          onError: (error) => {
            console.error('Donation failed:', error);
            setError(error.message || 'Transaction failed');
          },
        }
      );
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred');
    }
  };

  // Success state
  if (txDigest) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ color: '#2e7d32', marginBottom: '12px' }}>
            Donation Successful!
          </h2>
          <p style={{ color: '#616161', marginBottom: '20px' }}>
            Thank you for supporting this campaign
          </p>
          <a
            href={getExplorerUrl('tx', txDigest)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#2196f3',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
            }}
          >
            View Transaction →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '28px',
          maxWidth: '450px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#212121' }}>
            💰 Donate to Campaign
          </h2>
          <button
            onClick={onClose}
            disabled={isPending}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: isPending ? 'not-allowed' : 'pointer',
              color: '#757575',
              padding: '4px',
            }}
          >
            ×
          </button>
        </div>

        {/* Campaign Info */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '12px',
          marginBottom: '20px',
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#212121' }}>
            {campaign.title}
          </h3>
          <div style={{ fontSize: '14px', color: '#616161' }}>
            <div>Goal: {campaign.goal.toFixed(2)} SUI</div>
            <div>Raised: {campaign.raised.toFixed(2)} SUI</div>
            <div>Remaining: {(campaign.goal - campaign.raised).toFixed(2)} SUI</div>
          </div>
        </div>

        {/* Preset Amounts */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontWeight: '600',
            color: '#424242',
          }}>
            Quick Select
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
          }}>
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                disabled={isPending || preset > (campaign.goal - campaign.raised)}
                style={{
                  padding: '12px',
                  border: amount === preset.toString() ? '2px solid #2196f3' : '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: amount === preset.toString() ? '#e3f2fd' : '#fff',
                  color: preset > (campaign.goal - campaign.raised) ? '#bdbdbd' : '#212121',
                  fontWeight: '600',
                  cursor: isPending || preset > (campaign.goal - campaign.raised) ? 'not-allowed' : 'pointer',
                }}
              >
                {preset} SUI
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#424242',
          }}>
            Or Enter Custom Amount (SUI)
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
            placeholder="e.g., 2.5"
            disabled={isPending}
            style={{
              width: '100%',
              padding: '14px',
              border: error ? '2px solid #f44336' : '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
            }}
            onFocus={(e) => {
              if (!error) e.currentTarget.style.borderColor = '#2196f3';
            }}
            onBlur={(e) => {
              if (!error) e.currentTarget.style.borderColor = '#e0e0e0';
            }}
          />
          {error && (
            <div style={{
              color: '#f44336',
              fontSize: '13px',
              marginTop: '6px',
            }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div style={{
          padding: '12px',
          backgroundColor: '#fff3e0',
          borderLeft: '4px solid #ff9800',
          borderRadius: '4px',
          fontSize: '13px',
          color: '#e65100',
          marginBottom: '20px',
        }}>
          <strong>Note:</strong> Transaction fees (~0.001 SUI) will be deducted from your wallet
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            style={{
              flex: 1,
              padding: '14px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isPending ? 'not-allowed' : 'pointer',
              backgroundColor: '#fff',
              color: '#616161',
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDonate}
            disabled={isPending || !amount}
            style={{
              flex: 2,
              padding: '14px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isPending || !amount ? 'not-allowed' : 'pointer',
              backgroundColor: isPending || !amount ? '#90caf9' : '#2196f3',
              color: '#fff',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isPending && amount) {
                e.currentTarget.style.backgroundColor = '#1976d2';
              }
            }}
            onMouseLeave={(e) => {
              if (!isPending && amount) {
                e.currentTarget.style.backgroundColor = '#2196f3';
              }
            }}
          >
            {isPending ? '🔄 Processing...' : '💸 Confirm Donation'}
          </button>
        </div>
      </div>
    </div>
  );
}