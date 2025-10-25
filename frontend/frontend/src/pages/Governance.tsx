import { useState } from 'react';
import { useContract } from '../hooks/useContract';
import { useWallet } from '../hooks/useWallet';
import { Roles } from '../utils/constants';
import { useNotification } from '../components/NotificationProvider';

export function Governance() {
  const { requestRole, requestSpending, executeProposal, isLoading } = useContract();
  const { isConnected } = useWallet();
  const { showNotification } = useNotification();

  const [activeSection, setActiveSection] = useState<'role' | 'spending' | 'execute'>('role');

  const [roleRequest, setRoleRequest] = useState({
    role: Roles.Mentor,
    description: ''
  });

  const [spendingRequest, setSpendingRequest] = useState({
    beneficiary: '',
    amount: '',
    description: ''
  });

  const [proposalId, setProposalId] = useState('');

  const handleRequestRole = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await requestRole(roleRequest.role, roleRequest.description);
      showNotification('Role request submitted successfully', 'success');
      setRoleRequest({ role: Roles.Mentor, description: '' });
    } catch (err: any) {
      console.error('Failed to request role:', err);

      if (err.message?.includes('insufficient') || err.message?.includes('balance')) {
        showNotification('Insufficient funds to pay transaction fees', 'error');
      } else {
        showNotification('Failed to submit role request. Please try again.', 'error');
      }
    }
  };

  const handleRequestSpending = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const amount = BigInt(spendingRequest.amount);
      await requestSpending(
        spendingRequest.beneficiary,
        amount,
        spendingRequest.description
      );
      showNotification('Spending proposal submitted successfully', 'success');
      setSpendingRequest({ beneficiary: '', amount: '', description: '' });
    } catch (err: any) {
      console.error('Failed to request spending:', err);

      if (err.message?.includes('insufficient') || err.message?.includes('balance')) {
        showNotification('Insufficient funds to pay transaction fees', 'error');
      } else {
        showNotification('Failed to submit spending proposal. Please try again.', 'error');
      }
    }
  };

  const handleExecuteProposal = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await executeProposal(Number(proposalId));
      showNotification('Proposal executed successfully', 'success');
      setProposalId('');
    } catch (err: any) {
      console.error('Failed to execute proposal:', err);

      if (err.message?.includes('insufficient') || err.message?.includes('balance')) {
        showNotification('Insufficient funds to pay transaction fees', 'error');
      } else {
        showNotification('Failed to execute proposal. Please try again.', 'error');
      }
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
            Governance
          </h1>
          <p className="text-lg font-light mb-8" style={{ color: 'var(--color-luxury-gray)' }}>
            Please connect your wallet to participate in governance.
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
            Governance
          </h1>
          <div className="w-24 h-px mx-auto" style={{ backgroundColor: 'var(--color-luxury-gold)' }} />
        </div>

        {/* Content Card */}
        <div className="bg-white luxury-shadow p-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Section Tabs */}
          <div className="flex justify-center gap-8 mb-12 flex-wrap">
            <button
              onClick={() => setActiveSection('role')}
              className={`text-sm tracking-wider uppercase transition-all pb-2 ${
                activeSection === 'role' ? 'border-b-2' : 'opacity-50 hover:opacity-75'
              }`}
              style={activeSection === 'role' ? {
                borderColor: 'var(--color-luxury-gold)',
                color: 'var(--color-luxury-black)',
                letterSpacing: '0.15em'
              } : {
                borderColor: 'transparent',
                color: 'var(--color-luxury-gray)',
                letterSpacing: '0.15em'
              }}
            >
              Role
            </button>
            <button
              onClick={() => setActiveSection('spending')}
              className={`text-sm tracking-wider uppercase transition-all pb-2 ${
                activeSection === 'spending' ? 'border-b-2' : 'opacity-50 hover:opacity-75'
              }`}
              style={activeSection === 'spending' ? {
                borderColor: 'var(--color-luxury-gold)',
                color: 'var(--color-luxury-black)',
                letterSpacing: '0.15em'
              } : {
                borderColor: 'transparent',
                color: 'var(--color-luxury-gray)',
                letterSpacing: '0.15em'
              }}
            >
              Spending
            </button>
            <button
              onClick={() => setActiveSection('execute')}
              className={`text-sm tracking-wider uppercase transition-all pb-2 ${
                activeSection === 'execute' ? 'border-b-2' : 'opacity-50 hover:opacity-75'
              }`}
              style={activeSection === 'execute' ? {
                borderColor: 'var(--color-luxury-gold)',
                color: 'var(--color-luxury-black)',
                letterSpacing: '0.15em'
              } : {
                borderColor: 'transparent',
                color: 'var(--color-luxury-gray)',
                letterSpacing: '0.15em'
              }}
            >
              Execute
            </button>
          </div>

          {/* Role Request Section */}
          {activeSection === 'role' && (
            <form onSubmit={handleRequestRole}>
              {/* Form Fields - Centered */}
              <div className="w-1/5 mx-auto">
                <div className="mb-8">
                  <label className="block text-sm tracking-widest uppercase mb-4" style={{ color: 'var(--color-luxury-gray)', letterSpacing: '0.15em' }}>
                    Role Type
                  </label>
                  <select
                    value={roleRequest.role}
                    onChange={(e) => setRoleRequest({ ...roleRequest, role: e.target.value as any })}
                    className="border-b w-full py-3 px-0 font-light text-xl leading-tight focus:outline-none transition-all cursor-pointer"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--color-luxury-black)',
                      borderBottomColor: 'var(--color-luxury-light-gray)'
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = 'var(--color-luxury-gold)'}
                    onBlur={(e) => e.target.style.borderBottomColor = 'var(--color-luxury-light-gray)'}
                  >
                    <option value="Mentor">Mentor</option>
                    <option value="Council">Council</option>
                  </select>
                </div>

                <div className="mb-12">
                  <label className="block text-sm tracking-widest uppercase mb-4" style={{ color: 'var(--color-luxury-gray)', letterSpacing: '0.15em' }}>
                    Statement
                  </label>
                  <textarea
                    value={roleRequest.description}
                    onChange={(e) => setRoleRequest({ ...roleRequest, description: e.target.value })}
                    className="border w-full py-4 px-4 font-light text-base leading-relaxed focus:outline-none transition-all resize-none"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--color-luxury-black)',
                      borderColor: 'var(--color-luxury-light-gray)',
                      minHeight: '150px'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-luxury-gold)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-luxury-light-gray)'}
                    required
                    placeholder="Articulate your qualifications and vision for this role..."
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="luxury-gold-gradient text-black py-4 px-12 font-medium tracking-widest uppercase text-xs hover:opacity-90 transition-all disabled:opacity-50"
                  style={{ letterSpacing: '0.2em' }}
                >
                  {isLoading ? 'Processing...' : 'Submit Request'}
                </button>
              </div>

              <div className="mt-8 border-l-2 pl-4 py-2" style={{ borderColor: 'var(--color-luxury-gold)' }}>
                <p className="text-xs font-light" style={{ color: 'var(--color-luxury-gray)' }}>
                  Premium membership required. Requests are submitted as governance proposals.
                </p>
              </div>
            </form>
          )}

          {/* Spending Request Section */}
          {activeSection === 'spending' && (
            <form onSubmit={handleRequestSpending}>
              {/* Form Fields - Centered */}
              <div className="w-1/5 mx-auto">
                <div className="mb-8">
                  <label className="block text-sm tracking-widest uppercase mb-4" style={{ color: 'var(--color-luxury-gray)', letterSpacing: '0.15em' }}>
                    Beneficiary Address
                  </label>
                  <input
                    type="text"
                    value={spendingRequest.beneficiary}
                    onChange={(e) => setSpendingRequest({ ...spendingRequest, beneficiary: e.target.value })}
                    className="border-b w-full py-3 px-0 font-mono text-base font-light leading-tight focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--color-luxury-black)',
                      borderBottomColor: 'var(--color-luxury-light-gray)'
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = 'var(--color-luxury-gold)'}
                    onBlur={(e) => e.target.style.borderBottomColor = 'var(--color-luxury-light-gray)'}
                    required
                    placeholder="5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-sm tracking-widest uppercase mb-4" style={{ color: 'var(--color-luxury-gray)', letterSpacing: '0.15em' }}>
                    Amount (Tokens)
                  </label>
                  <input
                    type="number"
                    value={spendingRequest.amount}
                    onChange={(e) => setSpendingRequest({ ...spendingRequest, amount: e.target.value })}
                    className="border-b w-full py-3 px-0 font-light text-xl leading-tight focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--color-luxury-black)',
                      borderBottomColor: 'var(--color-luxury-light-gray)'
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = 'var(--color-luxury-gold)'}
                    onBlur={(e) => e.target.style.borderBottomColor = 'var(--color-luxury-light-gray)'}
                    required
                    placeholder="1000"
                    min="0"
                  />
                </div>

                <div className="mb-12">
                  <label className="block text-sm tracking-widest uppercase mb-4" style={{ color: 'var(--color-luxury-gray)', letterSpacing: '0.15em' }}>
                    Justification
                  </label>
                  <textarea
                    value={spendingRequest.description}
                    onChange={(e) => setSpendingRequest({ ...spendingRequest, description: e.target.value })}
                    className="border w-full py-4 px-4 font-light text-base leading-relaxed focus:outline-none transition-all resize-none"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--color-luxury-black)',
                      borderColor: 'var(--color-luxury-light-gray)',
                      minHeight: '150px'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-luxury-gold)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-luxury-light-gray)'}
                    required
                    placeholder="Detail the purpose and expected impact of this proposal..."
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="luxury-gold-gradient text-black py-4 px-12 font-medium tracking-widest uppercase text-xs hover:opacity-90 transition-all disabled:opacity-50"
                  style={{ letterSpacing: '0.2em' }}
                >
                  {isLoading ? 'Processing...' : 'Submit Proposal'}
                </button>
              </div>

              <div className="mt-8 border-l-2 pl-4 py-2" style={{ borderColor: 'var(--color-luxury-gold)' }}>
                <p className="text-xs font-light" style={{ color: 'var(--color-luxury-gray)' }}>
                  Council and Mentor roles required for spending proposals.
                </p>
              </div>
            </form>
          )}

          {/* Execute Proposal Section */}
          {activeSection === 'execute' && (
            <form onSubmit={handleExecuteProposal}>
              {/* Form Fields - Centered */}
              <div className="w-1/5 mx-auto">
                <div className="mb-12">
                  <label className="block text-sm tracking-widest uppercase mb-4" style={{ color: 'var(--color-luxury-gray)', letterSpacing: '0.15em' }}>
                    Proposal ID
                  </label>
                  <input
                    type="number"
                    value={proposalId}
                    onChange={(e) => setProposalId(e.target.value)}
                    className="border-b w-full py-3 px-0 font-light text-xl leading-tight focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--color-luxury-black)',
                      borderBottomColor: 'var(--color-luxury-light-gray)'
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = 'var(--color-luxury-gold)'}
                    onBlur={(e) => e.target.style.borderBottomColor = 'var(--color-luxury-light-gray)'}
                    required
                    placeholder="Enter proposal identifier"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-4 px-12 font-medium tracking-widest uppercase text-xs transition-all disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--color-luxury-black)',
                    color: 'var(--color-luxury-white)',
                    letterSpacing: '0.2em'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-luxury-gray)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-luxury-black)'}
                >
                  {isLoading ? 'Processing...' : 'Execute Proposal'}
                </button>
              </div>

              <div className="mt-8 border-l-2 pl-4 py-2" style={{ borderColor: '#d97706' }}>
                <p className="text-xs font-light" style={{ color: '#92400e' }}>
                  Ensure the proposal is approved. Council and Mentor privileges required.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
