import React, { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { buildCreateCampaignTx } from '../utils/campaignManager';
import { getExplorerUrl } from '../config/constants';

interface CreateCampaignFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateCampaignForm({ onSuccess, onCancel }: CreateCampaignFormProps) {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    durationDays: '30',
    beneficiary: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [txDigest, setTxDigest] = useState<string>('');

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    const goal = parseFloat(formData.goal);
    if (!formData.goal || isNaN(goal) || goal <= 0) {
      newErrors.goal = 'Goal must be greater than 0';
    }

    const duration = parseInt(formData.durationDays);
    if (!formData.durationDays || isNaN(duration) || duration < 1) {
      newErrors.durationDays = 'Duration must be at least 1 day';
    }

    if (!formData.beneficiary.trim()) {
      newErrors.beneficiary = 'Beneficiary address is required';
    } else if (!formData.beneficiary.startsWith('0x') || formData.beneficiary.length !== 66) {
      newErrors.beneficiary = 'Invalid Sui address format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentAccount) {
      alert('Please connect your wallet first');
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      const tx = buildCreateCampaignTx({
        title: formData.title,
        description: formData.description,
        goal: parseFloat(formData.goal),
        durationDays: parseInt(formData.durationDays),
        beneficiary: formData.beneficiary,
      });

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log('Campaign created:', result);
            setTxDigest(result.digest);
            
            // Show success for 2 seconds then callback
            setTimeout(() => {
              onSuccess();
            }, 2000);
          },
          onError: (error) => {
            console.error('Transaction failed:', error);
            alert(`Failed to create campaign: ${error.message}`);
          },
        }
      );
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Success state
  if (txDigest) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#e8f5e9',
        borderRadius: '12px',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ color: '#2e7d32', marginBottom: '12px' }}>Campaign Created!</h2>
        <p style={{ color: '#616161', marginBottom: '20px' }}>
          Your campaign has been successfully created on Sui blockchain
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
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '24px', color: '#212121' }}>
        Create New Campaign
      </h2>

      {/* Title */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '6px',
          fontWeight: '600',
          color: '#424242',
        }}>
          Campaign Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Help Build School in Rural Vietnam"
          style={{
            width: '100%',
            padding: '12px',
            border: errors.title ? '2px solid #f44336' : '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '15px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => {
            if (!errors.title) e.currentTarget.style.borderColor = '#2196f3';
          }}
          onBlur={(e) => {
            if (!errors.title) e.currentTarget.style.borderColor = '#e0e0e0';
          }}
        />
        {errors.title && (
          <div style={{ color: '#f44336', fontSize: '13px', marginTop: '4px' }}>
            {errors.title}
          </div>
        )}
      </div>

      {/* Description */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '6px',
          fontWeight: '600',
          color: '#424242',
        }}>
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your campaign goals and how funds will be used..."
          rows={4}
          style={{
            width: '100%',
            padding: '12px',
            border: errors.description ? '2px solid #f44336' : '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '15px',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => {
            if (!errors.description) e.currentTarget.style.borderColor = '#2196f3';
          }}
          onBlur={(e) => {
            if (!errors.description) e.currentTarget.style.borderColor = '#e0e0e0';
          }}
        />
        {errors.description && (
          <div style={{ color: '#f44336', fontSize: '13px', marginTop: '4px' }}>
            {errors.description}
          </div>
        )}
      </div>

      {/* Goal and Duration */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '20px',
      }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontWeight: '600',
            color: '#424242',
          }}>
            Goal Amount (SUI) *
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
            placeholder="e.g., 100"
            style={{
              width: '100%',
              padding: '12px',
              border: errors.goal ? '2px solid #f44336' : '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              outline: 'none',
            }}
            onFocus={(e) => {
              if (!errors.goal) e.currentTarget.style.borderColor = '#2196f3';
            }}
            onBlur={(e) => {
              if (!errors.goal) e.currentTarget.style.borderColor = '#e0e0e0';
            }}
          />
          {errors.goal && (
            <div style={{ color: '#f44336', fontSize: '13px', marginTop: '4px' }}>
              {errors.goal}
            </div>
          )}
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontWeight: '600',
            color: '#424242',
          }}>
            Duration (days) *
          </label>
          <input
            type="number"
            value={formData.durationDays}
            onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
            placeholder="e.g., 30"
            style={{
              width: '100%',
              padding: '12px',
              border: errors.durationDays ? '2px solid #f44336' : '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              outline: 'none',
            }}
            onFocus={(e) => {
              if (!errors.durationDays) e.currentTarget.style.borderColor = '#2196f3';
            }}
            onBlur={(e) => {
              if (!errors.durationDays) e.currentTarget.style.borderColor = '#e0e0e0';
            }}
          />
          {errors.durationDays && (
            <div style={{ color: '#f44336', fontSize: '13px', marginTop: '4px' }}>
              {errors.durationDays}
            </div>
          )}
        </div>
      </div>

      {/* Beneficiary */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          marginBottom: '6px',
          fontWeight: '600',
          color: '#424242',
        }}>
          Beneficiary Address *
        </label>
        <input
          type="text"
          value={formData.beneficiary}
          onChange={(e) => setFormData({ ...formData, beneficiary: e.target.value })}
          placeholder="0x..."
          style={{
            width: '100%',
            padding: '12px',
            border: errors.beneficiary ? '2px solid #f44336' : '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'monospace',
            outline: 'none',
          }}
          onFocus={(e) => {
            if (!errors.beneficiary) e.currentTarget.style.borderColor = '#2196f3';
          }}
          onBlur={(e) => {
            if (!errors.beneficiary) e.currentTarget.style.borderColor = '#e0e0e0';
          }}
        />
        {errors.beneficiary && (
          <div style={{ color: '#f44336', fontSize: '13px', marginTop: '4px' }}>
            {errors.beneficiary}
          </div>
        )}
        <div style={{ fontSize: '13px', color: '#757575', marginTop: '4px' }}>
          Address that will receive the funds
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="button"
          onClick={onCancel}
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
          type="submit"
          disabled={isPending}
          style={{
            flex: 2,
            padding: '14px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isPending ? 'not-allowed' : 'pointer',
            backgroundColor: isPending ? '#90caf9' : '#2196f3',
            color: '#fff',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!isPending) e.currentTarget.style.backgroundColor = '#1976d2';
          }}
          onMouseLeave={(e) => {
            if (!isPending) e.currentTarget.style.backgroundColor = '#2196f3';
          }}
        >
          {isPending ? '🔄 Creating...' : '✨ Create Campaign'}
        </button>
      </div>
    </form>
  );
}