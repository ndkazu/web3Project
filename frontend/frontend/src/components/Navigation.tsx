import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useOnChainInfo } from '../hooks/useOnChainInfo';
import { useSubscription } from '../hooks/useSubscription';

export function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    selectedAccount,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    accounts,
    selectAccount
  } = useWallet();

  const { chainInfo, isLoading: isChainLoading } = useOnChainInfo();
  const subscriptionStatus = useSubscription();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance?: string) => {
    if (!balance) return '0';
    const value = BigInt(balance);
    return (Number(value) / 1e12).toFixed(4);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 luxury-gradient text-white"
      style={{
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(201, 169, 97, 0.2)'
      }}
    >
      <div className="container mx-auto px-8 py-6">
        <div className="flex justify-between items-center">
          {/* Logo - Back to Home */}
          <Link
            to="/"
            className="text-4xl font-semibold tracking-wider hover:opacity-80 transition-all px-4 py-2 border-2 border-transparent hover:border-white/30"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-luxury-gold)'
            }}
          >
            ⌂ DAO
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/membership"
              className={`px-6 py-3 text-base font-bold tracking-widest uppercase transition-all border-2 ${
                isActive('/membership')
                  ? 'luxury-gold-gradient text-black border-yellow-500'
                  : 'bg-white/90 text-black border-white hover:luxury-gold-gradient hover:border-yellow-500'
              }`}
              style={{
                letterSpacing: '0.12em'
              }}
            >
              Membership
            </Link>
            <Link
              to="/governance"
              className={`px-6 py-3 text-base font-bold tracking-widest uppercase transition-all border-2 ${
                isActive('/governance')
                  ? 'luxury-gold-gradient text-black border-yellow-500'
                  : 'bg-white/90 text-black border-white hover:luxury-gold-gradient hover:border-yellow-500'
              }`}
              style={{
                letterSpacing: '0.12em'
              }}
            >
              Governance
            </Link>
            <Link
              to="/faucet"
              className={`px-6 py-3 text-base font-bold tracking-widest uppercase transition-all border-2 ${
                isActive('/faucet')
                  ? 'luxury-gold-gradient text-black border-yellow-500'
                  : 'bg-white/90 text-black border-white hover:luxury-gold-gradient hover:border-yellow-500'
              }`}
              style={{
                letterSpacing: '0.12em'
              }}
            >
              Faucet
            </Link>
            <Link
              to="/about"
              className={`px-6 py-3 text-base font-bold tracking-widest uppercase transition-all border-2 ${
                isActive('/about')
                  ? 'luxury-gold-gradient text-black border-yellow-500'
                  : 'bg-white/90 text-black border-white hover:luxury-gold-gradient hover:border-yellow-500'
              }`}
              style={{
                letterSpacing: '0.12em'
              }}
            >
              Community
            </Link>
          </div>

          {/* Wallet Connection */}
          <div>
            {!isConnected ? (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="luxury-gold-gradient text-black px-8 py-3 text-sm tracking-widest uppercase transition-all disabled:opacity-50 font-semibold hover:opacity-90"
                style={{ letterSpacing: '0.15em' }}
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="flex items-center gap-4">
                {/* Permanent Account Info Box */}
                <div
                  className="border-4 px-6 py-4 min-w-[320px] shadow-2xl"
                  style={{
                    borderColor: '#FFD700',
                    backgroundColor: '#1a1a1a',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
                  }}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b-2" style={{ borderColor: '#FFD700' }}>
                      <span className="text-base tracking-widest uppercase font-black" style={{ letterSpacing: '0.15em', color: '#FFD700' }}>
                        CONNECTED ACCOUNT
                      </span>
                      {!isChainLoading && (
                        <span className="text-base font-black" style={{ color: '#FFFFFF' }}>Block #{chainInfo.blockNumber}</span>
                      )}
                    </div>

                    {/* Account Name */}
                    <div>
                      <p className="text-xl font-black mb-2" style={{ color: '#FFFFFF' }}>
                        {selectedAccount?.meta.name || 'Account'}
                      </p>
                      <p className="text-base font-mono font-bold break-all" style={{ color: '#FFFFFF' }}>
                        {formatAddress(selectedAccount?.address || '')}
                      </p>
                    </div>

                    {/* Balance */}
                    <div className="flex items-center justify-between pt-3 border-t-2" style={{ borderColor: '#FFD700' }}>
                      <span className="text-base uppercase tracking-wider font-black" style={{ color: '#FFD700' }}>
                        BALANCE
                      </span>
                      <span className="text-xl font-black" style={{ color: '#FFFFFF' }}>
                        {formatBalance(selectedAccount?.balance)} <span className="text-base font-black">Tokens</span>
                      </span>
                    </div>

                    {/* Membership Status */}
                    <div className="pt-3 border-t-2" style={{ borderColor: '#FFD700' }}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-base tracking-wider uppercase font-black" style={{ color: '#FFD700' }}>
                          MEMBERSHIP STATUS
                        </p>
                        <button
                          onClick={() => subscriptionStatus.refresh && subscriptionStatus.refresh()}
                          className="px-3 py-1 text-xs font-bold uppercase border-2 hover:bg-white/10 transition-all"
                          style={{ borderColor: '#FFD700', color: '#FFD700' }}
                          title="Refresh subscription status"
                        >
                          ↻ REFRESH
                        </button>
                      </div>
                      {subscriptionStatus.isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#FFD700' }} />
                          <span className="text-lg font-black" style={{ color: '#FFFFFF' }}>Loading...</span>
                        </div>
                      ) : subscriptionStatus.hasSubscription ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }} />
                          <span className="text-lg font-black" style={{ color: '#FFFFFF' }}>
                            {subscriptionStatus.subscriptionType}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFFFFF' }} />
                          <span className="text-lg font-black" style={{ color: '#FFFFFF' }}>No Active Membership</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-3">
                      {accounts.length > 1 && (
                        <select
                          value={selectedAccount?.address}
                          onChange={(e) => {
                            const account = accounts.find(acc => acc.address === e.target.value);
                            if (account) selectAccount(account);
                          }}
                          className="flex-1 bg-white text-black px-4 py-3 text-base border-4 font-black uppercase tracking-wider hover:bg-yellow-100 transition-all"
                          style={{ borderColor: '#FFD700' }}
                        >
                          {accounts.map((account) => (
                            <option key={account.address} value={account.address} className="text-black font-bold">
                              {account.meta.name}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        onClick={disconnectWallet}
                        className="px-6 py-3 text-base font-black tracking-wider uppercase transition-all border-4 bg-red-600 hover:bg-red-700"
                        style={{
                          letterSpacing: '0.1em',
                          borderColor: '#FF0000',
                          color: '#FFFFFF'
                        }}
                      >
                        DISCONNECT
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden mt-6 pt-6 border-t animate-fade-in-up"
            style={{ borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <div className="flex flex-col gap-4">
              <Link
                to="/membership"
                className={`px-6 py-3 text-base font-bold tracking-widest uppercase transition-all border-2 ${
                  isActive('/membership')
                    ? 'luxury-gold-gradient text-black border-yellow-500'
                    : 'bg-white/90 text-black border-white hover:luxury-gold-gradient hover:border-yellow-500'
                }`}
                style={{ letterSpacing: '0.12em' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Membership
              </Link>
              <Link
                to="/governance"
                className={`px-6 py-3 text-base font-bold tracking-widest uppercase transition-all border-2 ${
                  isActive('/governance')
                    ? 'luxury-gold-gradient text-black border-yellow-500'
                    : 'bg-white/90 text-black border-white hover:luxury-gold-gradient hover:border-yellow-500'
                }`}
                style={{ letterSpacing: '0.12em' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Governance
              </Link>
              <Link
                to="/faucet"
                className={`px-6 py-3 text-base font-bold tracking-widest uppercase transition-all border-2 ${
                  isActive('/faucet')
                    ? 'luxury-gold-gradient text-black border-yellow-500'
                    : 'bg-white/90 text-black border-white hover:luxury-gold-gradient hover:border-yellow-500'
                }`}
                style={{ letterSpacing: '0.12em' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Faucet
              </Link>
              <Link
                to="/about"
                className={`px-6 py-3 text-base font-bold tracking-widest uppercase transition-all border-2 ${
                  isActive('/about')
                    ? 'luxury-gold-gradient text-black border-yellow-500'
                    : 'bg-white/90 text-black border-white hover:luxury-gold-gradient hover:border-yellow-500'
                }`}
                style={{ letterSpacing: '0.12em' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Community
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
