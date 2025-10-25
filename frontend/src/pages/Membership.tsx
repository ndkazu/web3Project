import { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';
import { useWallet } from '../hooks/useWallet';
import { SubscriptionType, SUBSCRIPTION_AMOUNTS } from '../utils/constants';
import { useNotification } from '../components/NotificationProvider';
import { useSubscription } from '../hooks/useSubscription';

export function Membership() {
  const { createSubscription, updateSubscription, isLoading } = useContract();
  const { isConnected } = useWallet();
  const { showNotification } = useNotification();
  const subscriptionStatus = useSubscription();

  const [formData, setFormData] = useState({
    name: '',
    subscriptionType: SubscriptionType.Free,
    institutional: false,
    school: false
  });

  const [isNewUser, setIsNewUser] = useState(true);

  // Automatically set isNewUser based on subscription status
  useEffect(() => {
    if (!subscriptionStatus.isLoading && subscriptionStatus.hasSubscription) {
      setIsNewUser(false);
    }
  }, [subscriptionStatus]);

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createSubscription(
        formData.name,
        formData.subscriptionType,
        formData.institutional,
        formData.school
      );

      showNotification('Membership created successfully', 'success');

      // Refresh subscription status after successful creation
      setTimeout(() => {
        if (subscriptionStatus.refresh) {
          subscriptionStatus.refresh();
        }
      }, 2000); // Wait 2 seconds for blockchain to finalize

      setFormData({
        name: '',
        subscriptionType: SubscriptionType.Free,
        institutional: false,
        school: false
      });
    } catch (err: any) {
      console.error('Failed to create subscription:', err);

      // Check for insufficient funds error
      if (err.message?.includes('insufficient') || err.message?.includes('balance')) {
        showNotification('Insufficient funds to pay transaction fees', 'error');
      } else {
        showNotification('Failed to create membership. Please try again.', 'error');
      }
    }
  };

  const handleUpdateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSubscription(formData.subscriptionType);
      showNotification('Membership updated successfully', 'success');

      // Refresh subscription status after successful update
      setTimeout(() => {
        if (subscriptionStatus.refresh) {
          subscriptionStatus.refresh();
        }
      }, 2000); // Wait 2 seconds for blockchain to finalize
    } catch (err: any) {
      console.error('Failed to update subscription:', err);

      if (err.message?.includes('insufficient') || err.message?.includes('balance')) {
        showNotification('Insufficient funds to pay transaction fees', 'error');
      } else {
        showNotification('Failed to update membership. Please try again.', 'error');
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
            Membership
          </h1>
          <p className="text-lg font-light mb-8" style={{ color: 'var(--color-edh-gray)' }}>
            Please connect your wallet to access membership services.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 py-16" style={{ backgroundColor: 'var(--color-edh-white)' }}>
      <div className="max-w-5xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1
            className="text-6xl font-bold mb-8 tracking-wider uppercase"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-edh-black)', letterSpacing: '0.1em' }}
          >
            Membership
          </h1>
          <div className="w-32 h-px mx-auto" style={{ backgroundColor: 'var(--color-edh-black)' }} />
        </div>

        {/* Content Card */}
        <div className="bg-white edh-shadow p-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Toggle Buttons - Only show if user doesn't have subscription yet */}
          {!subscriptionStatus.hasSubscription && (
            <div className="flex justify-center gap-8 mb-12">
              <button
                onClick={() => setIsNewUser(true)}
                className={`text-sm tracking-wider uppercase transition-all pb-2 ${
                  isNewUser ? 'border-b-2' : 'opacity-50 hover:opacity-75'
                }`}
                style={isNewUser ? {
                  borderColor: 'var(--color-edh-black)',
                  color: 'var(--color-edh-black)',
                  letterSpacing: '0.15em'
                } : {
                  borderColor: 'transparent',
                  color: 'var(--color-edh-gray)',
                  letterSpacing: '0.15em'
                }}
              >
                New Member
              </button>
              <button
                onClick={() => setIsNewUser(false)}
                className={`text-sm tracking-wider uppercase transition-all pb-2 ${
                  !isNewUser ? 'border-b-2' : 'opacity-50 hover:opacity-75'
                }`}
                style={!isNewUser ? {
                  borderColor: 'var(--color-edh-black)',
                  color: 'var(--color-edh-black)',
                  letterSpacing: '0.15em'
                } : {
                  borderColor: 'transparent',
                  color: 'var(--color-edh-gray)',
                  letterSpacing: '0.15em'
                }}
              >
                Update Plan
              </button>
            </div>
          )}

          {/* Current subscription info for existing members */}
          {subscriptionStatus.hasSubscription && (
            <div className="mb-12 p-8 border-l-4" style={{ borderColor: 'var(--color-edh-beige)', backgroundColor: 'var(--color-edh-gray-light)' }}>
              <p className="text-base tracking-widest uppercase mb-3" style={{ color: 'var(--color-edh-gray)', letterSpacing: '0.15em' }}>
                Current Membership
              </p>
              <p className="text-3xl font-bold mb-2" style={{ color: 'var(--color-edh-black)' }}>
                {subscriptionStatus.subscriptionType}
              </p>
              {subscriptionStatus.name && (
                <p className="text-xl font-light" style={{ color: 'var(--color-edh-gray)' }}>
                  Registered as: {subscriptionStatus.name}
                </p>
              )}
            </div>
          )}

          <form onSubmit={isNewUser ? handleCreateSubscription : handleUpdateSubscription}>
            {/* Form Fields - Centered */}
            <div className="w-1/5 mx-auto">
              {isNewUser && (
                <div className="mb-8">
                  <label className="block text-sm tracking-widest uppercase mb-4" style={{ color: 'var(--color-edh-gray)', letterSpacing: '0.15em' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-b w-full py-3 px-0 font-light text-xl leading-tight focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--color-edh-black)',
                      borderBottomColor: 'var(--color-edh-gray-light)'
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = 'var(--color-edh-black)'}
                    onBlur={(e) => e.target.style.borderBottomColor = 'var(--color-edh-gray-light)'}
                    required
                    placeholder="Enter your name"
                  />
                </div>
              )}

              <div className="mb-8">
                <label className="block text-sm tracking-widest uppercase mb-4" style={{ color: 'var(--color-edh-gray)', letterSpacing: '0.15em' }}>
                  Membership Tier
                </label>
                <select
                  value={formData.subscriptionType}
                  onChange={(e) => setFormData({ ...formData, subscriptionType: e.target.value as any })}
                  className="border-b w-full py-3 px-0 font-light text-xl leading-tight focus:outline-none transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--color-edh-black)',
                    borderBottomColor: 'var(--color-edh-gray-light)'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = 'var(--color-edh-black)'}
                  onBlur={(e) => e.target.style.borderBottomColor = 'var(--color-edh-gray-light)'}
                >
                  {Object.keys(SubscriptionType).map((type) => {
                    // Filter out current subscription type for existing members updating their plan
                    if (!isNewUser && subscriptionStatus.hasSubscription && subscriptionStatus.subscriptionType === type) {
                      return null;
                    }
                    // Filter out Free for existing members (can't downgrade to free)
                    if (!isNewUser && type === SubscriptionType.Free) {
                      return null;
                    }

                    return (
                      <option key={type} value={type}>
                        {type} — {SUBSCRIPTION_AMOUNTS[type as keyof typeof SUBSCRIPTION_AMOUNTS]} tokens
                      </option>
                    );
                  }).filter(Boolean)}
                </select>
              </div>

              {isNewUser && (
                <>
                  <div className="mb-6">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.institutional}
                        onChange={(e) => setFormData({ ...formData, institutional: e.target.checked })}
                        className="mr-4 h-5 w-5 border cursor-pointer"
                        style={{
                          accentColor: 'var(--color-luxury-gold)',
                          borderColor: 'var(--color-luxury-light-gray)'
                        }}
                      />
                      <span className="text-sm font-light tracking-wide group-hover:opacity-75 transition-opacity" style={{ color: 'var(--color-edh-black)' }}>
                        Institutional Account
                      </span>
                    </label>
                  </div>

                  <div className="mb-12">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.school}
                        onChange={(e) => setFormData({ ...formData, school: e.target.checked })}
                        className="mr-4 h-5 w-5 border cursor-pointer"
                        style={{
                          accentColor: 'var(--color-edh-black)',
                          borderColor: 'var(--color-edh-gray-light)'
                        }}
                      />
                      <span className="text-sm font-light tracking-wide group-hover:opacity-75 transition-opacity" style={{ color: 'var(--color-edh-black)' }}>
                        Educational Institution
                      </span>
                    </label>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="py-4 px-12 font-bold tracking-widest uppercase text-xs hover:bg-white hover:text-black border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-edh-black)',
                  color: 'var(--color-edh-white)',
                  borderColor: 'var(--color-edh-black)',
                  letterSpacing: '0.2em'
                }}
              >
                {isLoading
                  ? 'Processing...'
                  : isNewUser
                  ? 'Submit Application'
                  : 'Update Membership'}
              </button>
            </div>
          </form>

          {/* Tier Benefits */}
          <div className="mt-20 pt-16 border-t" style={{ borderColor: 'var(--color-edh-gray-light)' }}>
            <h3 className="text-lg tracking-widest uppercase mb-12 text-center font-bold" style={{ color: 'var(--color-edh-black)', letterSpacing: '0.2em' }}>
              Tier Benefits
            </h3>
            <div className="max-w-3xl mx-auto space-y-10">
              {[
                { name: 'Free', amount: '0', desc: 'Essential access to DAO features' },
                { name: 'Basic', amount: '1,000', desc: 'Enhanced features with voting privileges' },
                { name: 'Premium', amount: '5,000', desc: 'Complete access including role requests' },
                { name: 'Custom', amount: '10,000', desc: 'Bespoke tier for specialized requirements' }
              ].map((tier) => (
                <div key={tier.name} className="text-center">
                  <p className="font-bold text-2xl mb-3" style={{ color: 'var(--color-edh-black)' }}>
                    {tier.name} {tier.amount !== '0' && `(${tier.amount} tokens)`}
                  </p>
                  <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--color-edh-gray)' }}>
                    {tier.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
