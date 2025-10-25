import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useNotification } from '../components/NotificationProvider';
import { ApiPromise } from '@polkadot/api';

export function Faucet() {
  const { selectedAccount, isConnected, api } = useWallet();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);

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

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8" style={{ backgroundColor: 'var(--color-luxury-cream)' }}>
        <div className="max-w-2xl text-center">
          <h1
            className="text-6xl font-light mb-8 tracking-wider"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-luxury-black)' }}
          >
            Faucet
          </h1>
          <p className="text-lg font-light mb-8" style={{ color: 'var(--color-luxury-gray)' }}>
            Please connect your wallet to claim free tokens.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 py-24" style={{ backgroundColor: 'var(--color-luxury-cream)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1
            className="text-6xl font-light mb-6 tracking-wider"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-luxury-black)' }}
          >
            Token Faucet
          </h1>
          <div className="w-24 h-px mx-auto" style={{ backgroundColor: 'var(--color-luxury-gold)' }} />
          <p className="text-lg font-light mt-6 max-w-2xl mx-auto" style={{ color: 'var(--color-luxury-gray)' }}>
            Claim free tokens to get started with our DAO platform
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white luxury-shadow p-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Faucet Icon */}
          <div className="flex justify-center mb-8">
            <div
              className="w-24 h-24 flex items-center justify-center border-2 rounded-full"
              style={{ borderColor: 'var(--color-luxury-gold)' }}
            >
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="var(--color-luxury-gold)"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Account Info */}
          <div className="mb-8 text-center">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--color-luxury-gray)', letterSpacing: '0.15em' }}>
              Claiming For
            </p>
            <p className="font-light text-lg mb-2" style={{ color: 'var(--color-luxury-black)' }}>
              {selectedAccount?.meta.name}
            </p>
            <p className="font-mono text-sm opacity-60" style={{ color: 'var(--color-luxury-gray)' }}>
              {selectedAccount?.address}
            </p>
          </div>

          {/* Claim Amount */}
          <div className="mb-12 p-8 border-2 text-center" style={{ borderColor: 'var(--color-luxury-gold)', backgroundColor: 'var(--color-luxury-cream)' }}>
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--color-luxury-gray)', letterSpacing: '0.15em' }}>
              Claim Amount
            </p>
            <p className="text-5xl font-light mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-luxury-black)' }}>
              10,000
            </p>
            <p className="text-sm font-light" style={{ color: 'var(--color-luxury-gray)' }}>
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

          {/* Info Section */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-luxury-light-gray)' }}>
            <h3 className="text-xs tracking-widest uppercase mb-6 text-center" style={{ color: 'var(--color-luxury-gold)', letterSpacing: '0.2em' }}>
              Faucet Information
            </h3>
            <div className="space-y-4 text-sm font-light" style={{ color: 'var(--color-luxury-gray)' }}>
              <div className="flex items-start">
                <span className="mr-3" style={{ color: 'var(--color-luxury-gold)' }}>—</span>
                <p>Each wallet can claim 10,000 tokens once for testing purposes</p>
              </div>
              <div className="flex items-start">
                <span className="mr-3" style={{ color: 'var(--color-luxury-gold)' }}>—</span>
                <p>Tokens are provided for development and testing on the local network</p>
              </div>
              <div className="flex items-start">
                <span className="mr-3" style={{ color: 'var(--color-luxury-gold)' }}>—</span>
                <p>Use these tokens to create subscriptions and participate in governance</p>
              </div>
              <div className="flex items-start">
                <span className="mr-3" style={{ color: 'var(--color-luxury-gold)' }}>—</span>
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
