import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useNotification } from '../components/NotificationProvider';
import { useERC20 } from '../hooks/useERC20';
import { ApiPromise } from '@polkadot/api';

export function Faucet() {
  const { selectedAccount, isConnected, api } = useWallet();
  const { showNotification } = useNotification();
  const { approveDAO, isLoading: contractLoading } = useERC20();
  const [isLoading, setIsLoading] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [hasApproved, setHasApproved] = useState(false);

  const handleClaim = async () => {
    if (!api || !selectedAccount) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // In a real faucet, you'd send tokens from a treasury account
      // For development, we'll use Alice's account as the faucet
      const FAUCET_AMOUNT = 10_000n * 10n ** 12n; // 10,000 tokens

      // You would typically have a dedicated faucet account with private key
      // For now, this is a placeholder that shows the UI flow

      showNotification(
        'Faucet transfer initiated! In production, 10,000 tokens would be sent to your account.',
        'info'
      );

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setHasClaimed(true);
      showNotification('Tokens claimed successfully!', 'success');
    } catch (error: any) {
      console.error('Faucet error:', error);

      if (error.message?.includes('insufficient') || error.message?.includes('balance')) {
        showNotification('Faucet is currently empty. Please try again later.', 'error');
      } else {
        showNotification('Failed to claim tokens. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedAccount) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }

    try {
      // Approve 100,000 tokens (enough for multiple subscription updates)
      const APPROVE_AMOUNT = 100_000n;

      showNotification('Approving DAO to spend tokens...', 'info');

      await approveDAO(APPROVE_AMOUNT);

      setHasApproved(true);
      showNotification('DAO approved successfully! You can now update your subscription.', 'success');
    } catch (error: any) {
      console.error('Approve error:', error);

      // Extract the actual error message
      const errorMsg = error.message || error.toString();
      console.log('Error message:', errorMsg);

      if (errorMsg.includes('Cancelled') || errorMsg.includes('cancelled')) {
        showNotification('Transaction was cancelled by user', 'info');
      } else if (errorMsg.includes('insufficient') || errorMsg.includes('balance')) {
        showNotification('Insufficient funds to pay transaction fees', 'error');
      } else if (errorMsg.includes('InsufficientFunds')) {
        showNotification('Not enough tokens in your account', 'error');
      } else {
        showNotification(`Failed to approve DAO: ${errorMsg}`, 'error');
      }
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8" style={{ backgroundColor: 'var(--color-edh-white)' }}>
        <div className="max-w-2xl text-center">
          <h1
            className="text-6xl font-bold mb-8 tracking-wider uppercase"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-edh-black)' }}
          >
            Faucet
          </h1>
          <p className="text-lg font-light mb-8" style={{ color: 'var(--color-edh-gray)' }}>
            Please connect your wallet to claim free tokens.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 py-16" style={{ backgroundColor: 'var(--color-edh-white)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1
            className="text-6xl font-bold mb-8 tracking-wider uppercase"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-edh-black)', letterSpacing: '0.1em' }}
          >
            Token Faucet
          </h1>
          <div className="w-32 h-px mx-auto" style={{ backgroundColor: 'var(--color-edh-black)' }} />
          <p className="text-lg font-light mt-6 max-w-2xl mx-auto" style={{ color: 'var(--color-edh-gray)' }}>
            Claim free tokens to get started with our DAO platform
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white edh-shadow p-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Faucet Icon */}
          <div className="flex justify-center mb-8">
            <div
              className="w-24 h-24 flex items-center justify-center border-2 rounded-full"
              style={{ borderColor: 'var(--color-edh-black)' }}
            >
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="var(--color-edh-black)"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Account Info */}
          <div className="mb-8 text-center">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--color-edh-gray)', letterSpacing: '0.15em' }}>
              Claiming For
            </p>
            <p className="font-light text-lg mb-2" style={{ color: 'var(--color-edh-black)' }}>
              {selectedAccount?.meta.name}
            </p>
            <p className="font-mono text-sm opacity-60" style={{ color: 'var(--color-edh-gray)' }}>
              {selectedAccount?.address}
            </p>
          </div>

          {/* Claim Amount */}
          <div className="mb-12 p-8 border-2 text-center" style={{ borderColor: 'var(--color-edh-black)', backgroundColor: 'var(--color-edh-beige-light)' }}>
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--color-edh-gray)', letterSpacing: '0.15em' }}>
              Claim Amount
            </p>
            <p className="text-5xl font-light mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-edh-black)' }}>
              10,000
            </p>
            <p className="text-sm font-light" style={{ color: 'var(--color-edh-gray)' }}>
              Tokens
            </p>
          </div>

          {/* Claim Button */}
          {!hasClaimed ? (
            <div className="flex justify-center">
              <button
                onClick={handleClaim}
                disabled={isLoading}
                className="luxury-gold-gradient text-black py-4 px-12 font-medium tracking-widest uppercase text-xs hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ letterSpacing: '0.2em' }}
              >
                {isLoading ? 'Processing...' : 'Claim Tokens'}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-4 p-4 border-l-4" style={{ borderColor: '#10b981', backgroundColor: '#f0fdf4' }}>
                <svg className="w-6 h-6" fill="none" stroke="#10b981" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-light" style={{ color: '#065f46' }}>
                  Tokens claimed successfully!
                </span>
              </div>
            </div>
          )}

          {/* Approve DAO Section */}
          <div className="mt-16 pt-12 border-t" style={{ borderColor: 'var(--color-edh-gray-light)' }}>
            <div className="text-center mb-8">
              <h3 className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--color-edh-black)', letterSpacing: '0.2em' }}>
                Token Approval
              </h3>
              <p className="text-sm font-light max-w-2xl mx-auto mb-8" style={{ color: 'var(--color-edh-gray)' }}>
                Before updating your subscription, you must approve the DAO contract to spend your tokens.
                This is a one-time step that allows the DAO to transfer tokens when you upgrade your membership tier.
              </p>
            </div>

            {!hasApproved ? (
              <div className="flex justify-center">
                <button
                  onClick={handleApprove}
                  disabled={contractLoading}
                  className="border-2 py-4 px-12 font-medium tracking-widest uppercase text-xs hover:opacity-75 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: 'var(--color-edh-black)',
                    color: 'var(--color-edh-black)',
                    letterSpacing: '0.2em'
                  }}
                >
                  {contractLoading ? 'Processing...' : 'Approve DAO'}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="inline-flex items-center gap-3 p-4 border-l-4" style={{ borderColor: '#10b981', backgroundColor: '#f0fdf4' }}>
                  <svg className="w-6 h-6" fill="none" stroke="#10b981" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-light" style={{ color: '#065f46' }}>
                    DAO approved! You can now update your subscription on the Membership page.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-edh-gray-light)' }}>
            <h3 className="text-xs tracking-widest uppercase mb-6 text-center" style={{ color: 'var(--color-edh-black)', letterSpacing: '0.2em' }}>
              Faucet Information
            </h3>
            <div className="space-y-4 text-sm font-light" style={{ color: 'var(--color-edh-gray)' }}>
              <div className="flex items-start">
                <span className="mr-3" style={{ color: 'var(--color-edh-black)' }}>—</span>
                <p>Each wallet can claim 10,000 tokens once for testing purposes</p>
              </div>
              <div className="flex items-start">
                <span className="mr-3" style={{ color: 'var(--color-edh-black)' }}>—</span>
                <p>Tokens are provided for development and testing on the local network</p>
              </div>
              <div className="flex items-start">
                <span className="mr-3" style={{ color: 'var(--color-edh-black)' }}>—</span>
                <p>Use these tokens to create subscriptions and participate in governance</p>
              </div>
              <div className="flex items-start">
                <span className="mr-3" style={{ color: 'var(--color-edh-black)' }}>—</span>
                <p>For additional tokens, please use the development accounts (Alice, Bob, etc.)</p>
              </div>
            </div>
          </div>

          {/* Note about implementation */}
          <div className="mt-8 p-4 border-l-2" style={{ borderColor: '#d97706', backgroundColor: '#fef3c7' }}>
            <p className="text-xs font-light" style={{ color: '#92400e' }}>
              <strong style={{ fontWeight: 500 }}>Development Note:</strong> In production, this faucet would transfer tokens from a dedicated treasury account.
              For local testing, use development accounts like Alice or Bob which have initial balances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
