import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { useOnChainInfo } from '../hooks/useOnChainInfo';

export function Navigation() {
  const location = useLocation();
  const {
    selectedAccount,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet
  } = useWallet();

  const { chainInfo, isLoading: isChainLoading } = useOnChainInfo();

  const formatBalance = (balance?: string) => {
    if (!balance) return '0';
    const value = BigInt(balance);
    return (Number(value) / 1e12).toFixed(2);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="sticky top-0 z-50">
      {/* Announcement Bar */}
      <div
        className="w-full py-2 text-center text-xs font-medium"
        style={{
          backgroundColor: 'var(--color-edh-beige)',
          color: 'var(--color-edh-black)',
          letterSpacing: '0.05em'
        }}
      >
        BENEFIT FROM A FREE PERSONALITY ASSESSMENT WITH EVERY REGISTRATION
      </div>

      {/* Main Navigation */}
      <nav
        className="bg-white border-b"
        style={{
          borderColor: 'var(--color-edh-gray-light)'
        }}
      >
        <div className="container mx-auto px-8 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Left: Main Navigation Links */}
            <div className="flex items-center justify-start">
              <Link
                to="/membership"
                className={`text-xs font-bold uppercase transition-all whitespace-nowrap ${
                  isActive('/membership') ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  color: 'var(--color-edh-black)',
                  letterSpacing: '0.05em',
                  marginRight: '32px'
                }}
              >
                MEMBERSHIP
              </Link>
              <Link
                to="/governance"
                className={`text-xs font-bold uppercase transition-all whitespace-nowrap ${
                  isActive('/governance') ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  color: 'var(--color-edh-black)',
                  letterSpacing: '0.05em',
                  marginRight: '32px'
                }}
              >
                GOVERNANCE
              </Link>
              <Link
                to="/faucet"
                className={`text-xs font-bold uppercase transition-all whitespace-nowrap ${
                  isActive('/faucet') ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  color: 'var(--color-edh-black)',
                  letterSpacing: '0.05em',
                  marginRight: '32px'
                }}
              >
                FAUCET
              </Link>
              <Link
                to="/about"
                className={`text-xs font-bold uppercase transition-all whitespace-nowrap ${
                  isActive('/about') ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  color: 'var(--color-edh-black)',
                  letterSpacing: '0.05em'
                }}
              >
                COMMUNITY
              </Link>
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center">
              <Link
                to="/"
                className="text-xl font-black tracking-wider hover:opacity-80 transition-all whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-edh-black)',
                  letterSpacing: '0.05em'
                }}
              >
                ECOLE DES HOMMES
              </Link>
            </div>

            {/* Right: Action Buttons and Wallet Info */}
            <div className="flex items-center gap-3 justify-end flex-wrap">
              {/* Connect/Start Button */}
              {!isConnected ? (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="px-5 py-2 text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-50 whitespace-nowrap"
                  style={{
                    backgroundColor: 'var(--color-edh-black)',
                    color: 'var(--color-edh-white)',
                    letterSpacing: '0.08em'
                  }}
                >
                  {isConnecting ? 'CONNECTING...' : 'COMMENCER'}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {/* User Info - Compact */}
                  <div className="text-right">
                    <div className="text-xs font-bold whitespace-nowrap" style={{ color: 'var(--color-edh-black)' }}>
                      {selectedAccount?.meta.name || 'Account'}
                    </div>
                    <div className="text-xs whitespace-nowrap" style={{ color: 'var(--color-edh-gray)' }}>
                      {formatBalance(selectedAccount?.balance)} • #{!isChainLoading && chainInfo.blockNumber}
                    </div>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="px-3 py-1 text-xs font-bold uppercase border hover:bg-black hover:text-white transition-all"
                    style={{
                      borderColor: 'var(--color-edh-black)',
                      color: 'var(--color-edh-black)'
                    }}
                  >
                    EXIT
                  </button>
                </div>
              )}

              {/* Icons - Simplified */}
              <div className="flex items-center gap-2">
                <button className="hover:opacity-70 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button className="hover:opacity-70 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                <button className="hover:opacity-70 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
