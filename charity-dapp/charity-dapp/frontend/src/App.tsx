import React, { useState, useEffect } from 'react';
import { ConnectButton, useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { CampaignCard } from './components/CampaignCard';
import { CreateCampaignForm } from './components/CreateCampaignForm';
import { DonateModal } from './components/DonateModal';
import { Campaign, fetchAllCampaigns, buildWithdrawTx } from './utils/campaignManager';
import { getExplorerUrl } from './config/constants';

function App() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');

  // Load campaigns on mount and when account changes
  useEffect(() => {
    loadCampaigns();
  }, [currentAccount]);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await fetchAllCampaigns(suiClient);
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (campaign: Campaign) => {
    if (!window.confirm(`Withdraw ${campaign.raised.toFixed(2)} SUI to beneficiary?`)) {
      return;
    }

    try {
      const tx = buildWithdrawTx(campaign.id);

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            alert(`✅ Withdrawal successful! View on explorer: ${getExplorerUrl('tx', result.digest)}`);
            loadCampaigns(); // Refresh
          },
          onError: (error) => {
            alert(`❌ Withdrawal failed: ${error.message}`);
          },
        }
      );
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    if (filter === 'active') return Date.now() < c.deadline;
    if (filter === 'expired') return Date.now() >= c.deadline;
    return true;
  });

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => Date.now() < c.deadline).length,
    totalRaised: campaigns.reduce((sum, c) => sum + c.raised, 0),
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
    }}>
      {/* Navbar */}
      <nav style={{
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '16px 20px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🤝</span>
            <h1 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #2196f3, #00bcd4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Charity DApp
            </h1>
          </div>
          <ConnectButton />
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
      }}>
        {/* Hero Section */}
        {!showCreateForm && (
          <>
            <div style={{
              textAlign: 'center',
              marginBottom: '48px',
            }}>
              <h2 style={{
                fontSize: '42px',
                fontWeight: '700',
                color: '#212121',
                marginBottom: '16px',
              }}>
                Transparent Charity on Sui Blockchain
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#616161',
                marginBottom: '32px',
                maxWidth: '600px',
                margin: '0 auto 32px',
              }}>
                Create campaigns, donate with confidence, and track every transaction on-chain
              </p>

              <button
                onClick={() => setShowCreateForm(true)}
                disabled={!currentAccount}
                style={{
                  padding: '16px 32px',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: currentAccount ? 'pointer' : 'not-allowed',
                  backgroundColor: currentAccount ? '#2196f3' : '#e0e0e0',
                  color: '#fff',
                  boxShadow: currentAccount ? '0 4px 16px rgba(33, 150, 243, 0.3)' : 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (currentAccount) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(33, 150, 243, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentAccount) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(33, 150, 243, 0.3)';
                  }
                }}
              >
                ✨ Create Campaign
              </button>

              {!currentAccount && (
                <div style={{
                  marginTop: '12px',
                  fontSize: '14px',
                  color: '#f44336',
                }}>
                  ⚠️ Please connect your wallet to create a campaign
                </div>
              )}
            </div>

            {/* Stats Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '40px',
            }}>
              <div style={{
                backgroundColor: '#fff',
                padding: '24px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#2196f3' }}>
                  {stats.total}
                </div>
                <div style={{ fontSize: '14px', color: '#757575', marginTop: '4px' }}>
                  Total Campaigns
                </div>
              </div>

              <div style={{
                backgroundColor: '#fff',
                padding: '24px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#4caf50' }}>
                  {stats.active}
                </div>
                <div style={{ fontSize: '14px', color: '#757575', marginTop: '4px' }}>
                  Active Campaigns
                </div>
              </div>

              <div style={{
                backgroundColor: '#fff',
                padding: '24px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#ff9800' }}>
                  {stats.totalRaised.toFixed(2)} SUI
                </div>
                <div style={{ fontSize: '14px', color: '#757575', marginTop: '4px' }}>
                  Total Raised
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '24px',
              borderBottom: '2px solid #e0e0e0',
              paddingBottom: '12px',
            }}>
              {(['all', 'active', 'expired'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '15px',
                    fontWeight: filter === f ? '600' : '400',
                    color: filter === f ? '#2196f3' : '#757575',
                    cursor: 'pointer',
                    borderBottom: filter === f ? '3px solid #2196f3' : 'none',
                    marginBottom: filter === f ? '-14px' : '0',
                    transition: 'all 0.2s',
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  <span style={{ marginLeft: '6px', fontSize: '13px' }}>
                    ({f === 'all' ? stats.total : f === 'active' ? stats.active : stats.total - stats.active})
                  </span>
                </button>
              ))}
            </div>

            {/* Campaigns Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <div style={{ fontSize: '18px', color: '#757575' }}>Loading campaigns...</div>
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: '#fff',
                borderRadius: '12px',
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
                <h3 style={{ color: '#616161', marginBottom: '8px' }}>No campaigns found</h3>
                <p style={{ color: '#9e9e9e' }}>
                  {filter === 'all' ? 'Be the first to create one!' : `No ${filter} campaigns`}
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px',
              }}>
                {filteredCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onDonate={setSelectedCampaign}
                    onWithdraw={handleWithdraw}
                    currentAddress={currentAccount?.address}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Create Campaign Form */}
        {showCreateForm && (
          <CreateCampaignForm
            onSuccess={() => {
              setShowCreateForm(false);
              loadCampaigns();
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        )}
      </main>

      {/* Donate Modal */}
      {selectedCampaign && (
        <DonateModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onSuccess={loadCampaigns}
        />
      )}

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '32px 20px',
        color: '#757575',
        fontSize: '14px',
      }}>
        <div>Built on Sui Blockchain 🚀</div>
        <div style={{ marginTop: '8px' }}>
          <a
            href="https://docs.sui.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2196f3', textDecoration: 'none', marginRight: '16px' }}
          >
            Docs
          </a>
          <a
            href="https://suiscan.xyz/testnet"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2196f3', textDecoration: 'none' }}
          >
            Explorer
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;