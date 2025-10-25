import { useWallet } from '../hooks/useWallet';
import { useOnChainInfo } from '../hooks/useOnChainInfo';

export function Header() {
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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance?: string) => {
    if (!balance) return '0';
    const value = BigInt(balance);
    return (Number(value) / 1e12).toFixed(4); // Convert from plancks to tokens
  };

  return (
    <header className="luxury-gradient text-white relative overflow-hidden">
      {/* Decorative line */}
      <div className="absolute top-0 left-0 right-0 h-1 luxury-gold-gradient"></div>

      <div className="container mx-auto px-8 py-8">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="animate-fade-in-up">
            <h1 className="text-5xl font-light mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              DAO
            </h1>
            <p className="text-sm tracking-widest uppercase" style={{ color: 'var(--color-luxury-gold)', fontWeight: 300, letterSpacing: '0.2em' }}>
              Decentralized Autonomous Organization
            </p>
          </div>

          <div className="flex gap-8 items-center">
            {/* Chain Info */}
            <div className="border border-white/20 backdrop-blur-sm rounded-none px-6 py-4 min-w-[200px] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-xs tracking-wider uppercase mb-2" style={{ color: 'var(--color-luxury-gold)', letterSpacing: '0.15em' }}>
                Network Status
              </div>
              {isChainLoading ? (
                <div className="text-sm font-light">Loading...</div>
              ) : (
                <div className="space-y-1">
                  <div className="text-sm font-light" style={{ fontFamily: 'var(--font-heading)' }}>
                    {chainInfo.chainName}
                  </div>
                  <div className="text-xs font-light opacity-80">Block #{chainInfo.blockNumber}</div>
                  <div className="text-xs font-light opacity-80">Nodes: {chainInfo.connectedAccounts}</div>
                </div>
              )}
            </div>

            {/* Wallet Connection */}
            <div className="border border-white/20 backdrop-blur-sm rounded-none px-6 py-4 min-w-[280px] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {!isConnected ? (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="luxury-gold-gradient text-black px-8 py-3 rounded-none font-medium tracking-wider uppercase text-sm hover:opacity-90 transition-all disabled:opacity-50 w-full"
                  style={{ letterSpacing: '0.1em' }}
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs tracking-wider uppercase" style={{ color: 'var(--color-luxury-gold)', letterSpacing: '0.15em' }}>
                    Wallet
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      {accounts.length > 1 ? (
                        <select
                          value={selectedAccount?.address}
                          onChange={(e) => {
                            const account = accounts.find(acc => acc.address === e.target.value);
                            if (account) selectAccount(account);
                          }}
                          className="bg-white/10 text-white rounded-none px-3 py-2 text-sm border border-white/20 w-full font-light"
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          {accounts.map((account) => (
                            <option key={account.address} value={account.address} className="text-black">
                              {account.meta.name} - {formatAddress(account.address)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="font-mono text-sm font-light">{formatAddress(selectedAccount?.address || '')}</div>
                      )}
                      <div className="text-xs font-light mt-2 opacity-80">
                        {formatBalance(selectedAccount?.balance)} Tokens
                      </div>
                    </div>
                    <button
                      onClick={disconnectWallet}
                      className="border border-white/30 hover:border-white/60 px-4 py-2 rounded-none text-xs font-medium tracking-wider uppercase transition-all"
                      style={{ letterSpacing: '0.1em' }}
                    >
                      Exit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Block Hash */}
        {!isChainLoading && (
          <div className="mt-6 text-xs font-mono font-light border-t border-white/10 pt-4 opacity-60 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Block Hash: {chainInfo.blockHash}
          </div>
        )}
      </div>
    </header>
  );
}
