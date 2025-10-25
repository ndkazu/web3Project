import { useState } from 'react';
import { useContract } from '../hooks/useContract';
import { useWallet } from '../hooks/useWallet';
import { SubscriptionType, SUBSCRIPTION_AMOUNTS } from '../utils/constants';

export function SubscriptionCard() {
  const { createSubscription, updateSubscription, isLoading, error } = useContract();
  const { isConnected } = useWallet();

  const [formData, setFormData] = useState({
    name: '',
    subscriptionType: SubscriptionType.Free,
    institutional: false,
    school: false
  });

  const [isNewUser, setIsNewUser] = useState(true);

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createSubscription(
        formData.name,
        formData.subscriptionType,
        formData.institutional,
        formData.school
      );

      alert('Subscription created successfully!');
      setFormData({
        name: '',
        subscriptionType: SubscriptionType.Free,
        institutional: false,
        school: false
      });
    } catch (err) {
      console.error('Failed to create subscription:', err);
      alert('Failed to create subscription. Check console for details.');
    }
  };

  const handleUpdateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSubscription(formData.subscriptionType);
      alert('Subscription updated successfully!');
    } catch (err) {
      console.error('Failed to update subscription:', err);
      alert('Failed to update subscription. Check console for details.');
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white luxury-shadow rounded-none p-8">
        <h2 className="text-3xl font-light mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-luxury-black)' }}>
          Membership
        </h2>
        <p className="font-light" style={{ color: 'var(--color-luxury-gray)' }}>
          Please connect your wallet to access membership services.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white luxury-shadow rounded-none p-8">
      <h2 className="text-3xl font-light mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-luxury-black)' }}>
        Membership
      </h2>

      {error && (
        <div className="border-l-4 px-4 py-3 mb-6" style={{ borderColor: '#dc2626', backgroundColor: '#fee2e2', color: '#991b1b' }}>
          {error}
        </div>
      )}

      <div className="mb-8 flex gap-1 border-b" style={{ borderColor: 'var(--color-luxury-light-gray)' }}>
        <button
          onClick={() => setIsNewUser(true)}
          className={`px-6 py-3 font-light tracking-wider uppercase text-sm transition-all ${
            isNewUser
              ? 'border-b-2'
              : 'opacity-50 hover:opacity-75'
          }`}
          style={isNewUser ? {
            borderColor: 'var(--color-luxury-gold)',
            color: 'var(--color-luxury-black)',
            letterSpacing: '0.1em'
          } : {
            borderColor: 'transparent',
            color: 'var(--color-luxury-gray)',
            letterSpacing: '0.1em'
          }}
        >
          New Member
        </button>
        <button
          onClick={() => setIsNewUser(false)}
          className={`px-6 py-3 font-light tracking-wider uppercase text-sm transition-all ${
            !isNewUser
              ? 'border-b-2'
              : 'opacity-50 hover:opacity-75'
          }`}
          style={!isNewUser ? {
            borderColor: 'var(--color-luxury-gold)',
            color: 'var(--color-luxury-black)',
            letterSpacing: '0.1em'
          } : {
            borderColor: 'transparent',
            color: 'var(--color-luxury-gray)',
            letterSpacing: '0.1em'
          }}
        >
          Update Plan
        </button>
      </div>

      <form onSubmit={isNewUser ? handleCreateSubscription : handleUpdateSubscription}>
        {isNewUser && (
          <div className="mb-6">
            <label className="block text-xs tracking-wider uppercase mb-3" style={{ color: 'var(--color-luxury-gray)', letterSpacing: '0.1em' }}>
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-b-2 border-transparent w-full py-3 px-0 font-light leading-tight focus:outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-luxury-cream)',
                color: 'var(--color-luxury-black)',
                borderBottomColor: 'var(--color-luxury-light-gray)'
              }}
              onFocus={(e) => e.target.style.borderBottomColor = 'var(--color-luxury-gold)'}
              onBlur={(e) => e.target.style.borderBottomColor = 'var(--color-luxury-light-gray)'}
              required
              placeholder="Enter your name"
            />
          </div>
        )}

        <div className="mb-6">
          <label className="block text-xs tracking-wider uppercase mb-3" style={{ color: 'var(--color-luxury-gray)', letterSpacing: '0.1em' }}>
            Membership Tier
          </label>
          <select
            value={formData.subscriptionType}
            onChange={(e) => setFormData({ ...formData, subscriptionType: e.target.value as any })}
            className="border-b-2 w-full py-3 px-0 font-light leading-tight focus:outline-none transition-all cursor-pointer"
            style={{
              backgroundColor: 'var(--color-luxury-cream)',
              color: 'var(--color-luxury-black)',
              borderBottomColor: 'var(--color-luxury-light-gray)'
            }}
            onFocus={(e) => e.target.style.borderBottomColor = 'var(--color-luxury-gold)'}
            onBlur={(e) => e.target.style.borderBottomColor = 'var(--color-luxury-light-gray)'}
          >
            {Object.keys(SubscriptionType).map((type) => (
              <option key={type} value={type}>
                {type} — {SUBSCRIPTION_AMOUNTS[type as keyof typeof SUBSCRIPTION_AMOUNTS]} tokens
              </option>
            ))}
          </select>
        </div>

        {isNewUser && (
          <>
            <div className="mb-5">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.institutional}
                  onChange={(e) => setFormData({ ...formData, institutional: e.target.checked })}
                  className="mr-3 h-5 w-5 border-2 rounded-none cursor-pointer"
                  style={{
                    accentColor: 'var(--color-luxury-gold)',
                    borderColor: 'var(--color-luxury-light-gray)'
                  }}
                />
                <span className="text-sm font-light group-hover:opacity-75 transition-opacity" style={{ color: 'var(--color-luxury-black)' }}>
                  Institutional Account
                </span>
              </label>
            </div>

            <div className="mb-8">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.checked })}
                  className="mr-3 h-5 w-5 border-2 rounded-none cursor-pointer"
                  style={{
                    accentColor: 'var(--color-luxury-gold)',
                    borderColor: 'var(--color-luxury-light-gray)'
                  }}
                />
                <span className="text-sm font-light group-hover:opacity-75 transition-opacity" style={{ color: 'var(--color-luxury-black)' }}>
                  Educational Institution
                </span>
              </label>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full luxury-gold-gradient text-black py-4 px-6 rounded-none font-medium tracking-wider uppercase text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ letterSpacing: '0.12em' }}
        >
          {isLoading
            ? 'Processing...'
            : isNewUser
            ? 'Submit Application'
            : 'Update Membership'}
        </button>
      </form>

      {/* Subscription Tier Info */}
      <div className="mt-8 border-t pt-6" style={{ borderColor: 'var(--color-luxury-light-gray)' }}>
        <h3 className="font-medium mb-4 tracking-wider uppercase text-sm" style={{ color: 'var(--color-luxury-gold)', letterSpacing: '0.1em' }}>
          Tier Benefits
        </h3>
        <ul className="space-y-3 text-sm font-light" style={{ color: 'var(--color-luxury-gray)' }}>
          <li className="flex items-start">
            <span className="mr-3" style={{ color: 'var(--color-luxury-gold)' }}>•</span>
            <span><strong style={{ fontWeight: 500 }}>Free</strong> — Essential access to DAO features</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3" style={{ color: 'var(--color-luxury-gold)' }}>•</span>
            <span><strong style={{ fontWeight: 500 }}>Basic (1,000 tokens)</strong> — Enhanced features with voting privileges</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3" style={{ color: 'var(--color-luxury-gold)' }}>•</span>
            <span><strong style={{ fontWeight: 500 }}>Premium (5,000 tokens)</strong> — Complete access including role requests</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3" style={{ color: 'var(--color-luxury-gold)' }}>•</span>
            <span><strong style={{ fontWeight: 500 }}>Custom (10,000 tokens)</strong> — Bespoke tier for specialized requirements</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
