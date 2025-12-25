import React from 'react';
import { Campaign, getCampaignProgress, getTimeRemaining, isCampaignActive } from '../utils/campaignManager';
import { formatAddress, getExplorerUrl } from '../config/constants';

interface CampaignCardProps {
  campaign: Campaign;
  onDonate: (campaign: Campaign) => void;
  onWithdraw?: (campaign: Campaign) => void;
  currentAddress?: string;
}

export function CampaignCard({ campaign, onDonate, onWithdraw, currentAddress }: CampaignCardProps) {
  const progress = getCampaignProgress(campaign);
  const isActive = isCampaignActive(campaign);
  const isCreator = currentAddress === campaign.creator;
  const canWithdraw = isCreator && campaign.raised > 0;

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {/* Status Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          padding: '4px 12px',
          borderRadius: '16px',
          fontSize: '12px',
          fontWeight: '600',
          backgroundColor: isActive ? '#e8f5e9' : '#fafafa',
          color: isActive ? '#2e7d32' : '#757575',
        }}>
          {isActive ? '🟢 Active' : '⚫ Expired'}
        </span>
        
        {isCreator && (
          <span style={{
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: '#e3f2fd',
            color: '#1976d2',
          }}>
            Your Campaign
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{
        margin: 0,
        fontSize: '20px',
        fontWeight: '700',
        color: '#212121',
      }}>
        {campaign.title}
      </h3>

      {/* Description */}
      <p style={{
        margin: 0,
        fontSize: '14px',
        color: '#616161',
        lineHeight: '1.5',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}>
        {campaign.description}
      </p>

      {/* Progress Bar */}
      <div style={{ marginTop: '8px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '6px',
          fontSize: '14px',
        }}>
          <span style={{ fontWeight: '600', color: '#212121' }}>
            {campaign.raised.toFixed(2)} SUI
          </span>
          <span style={{ color: '#757575' }}>
            of {campaign.goal.toFixed(2)} SUI
          </span>
        </div>
        
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: progress >= 100 ? '#4caf50' : '#2196f3',
            transition: 'width 0.3s ease',
          }} />
        </div>
        
        <div style={{
          fontSize: '12px',
          color: '#757575',
          marginTop: '4px',
        }}>
          {progress.toFixed(1)}% funded
        </div>
      </div>

      {/* Meta Info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        padding: '12px',
        backgroundColor: '#fafafa',
        borderRadius: '8px',
        fontSize: '13px',
      }}>
        <div>
          <div style={{ color: '#757575', marginBottom: '4px' }}>Creator</div>
          <a 
            href={getExplorerUrl('address', campaign.creator)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1976d2', textDecoration: 'none', fontWeight: '600' }}
          >
            {formatAddress(campaign.creator)}
          </a>
        </div>
        
        <div>
          <div style={{ color: '#757575', marginBottom: '4px' }}>Deadline</div>
          <div style={{ fontWeight: '600', color: isActive ? '#212121' : '#f44336' }}>
            {getTimeRemaining(campaign.deadline)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button
          onClick={() => onDonate(campaign)}
          disabled={!isActive}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: isActive ? 'pointer' : 'not-allowed',
            backgroundColor: isActive ? '#2196f3' : '#e0e0e0',
            color: isActive ? '#fff' : '#9e9e9e',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (isActive) {
              e.currentTarget.style.backgroundColor = '#1976d2';
            }
          }}
          onMouseLeave={(e) => {
            if (isActive) {
              e.currentTarget.style.backgroundColor = '#2196f3';
            }
          }}
        >
          💰 Donate
        </button>

        {canWithdraw && onWithdraw && (
          <button
            onClick={() => onWithdraw(campaign)}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #4caf50',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: '#fff',
              color: '#4caf50',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4caf50';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.color = '#4caf50';
            }}
          >
            💸 Withdraw
          </button>
        )}
      </div>

      {/* View on Explorer */}
      <a
        href={getExplorerUrl('object', campaign.id)}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#757575',
          textDecoration: 'none',
          padding: '8px',
          borderRadius: '6px',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#fafafa';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        🔍 View on Explorer →
      </a>
    </div>
  );
}