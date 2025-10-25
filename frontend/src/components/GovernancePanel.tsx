import { useState } from 'react';
import { useContract } from '../hooks/useContract';
import { useWallet } from '../hooks/useWallet';
import { Roles } from '../utils/constants';

export function GovernancePanel() {
  const { requestRole, requestSpending, executeProposal, isLoading, error } = useContract();
  const { isConnected } = useWallet();

  const [activeTab, setActiveTab] = useState<'role' | 'spending' | 'execute'>('role');

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
      alert('Role request submitted successfully!');
      setRoleRequest({ role: Roles.Mentor, description: '' });
    } catch (err) {
      console.error('Failed to request role:', err);
      alert('Failed to request role. Check console for details.');
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
      alert('Spending proposal submitted successfully!');
      setSpendingRequest({ beneficiary: '', amount: '', description: '' });
    } catch (err) {
      console.error('Failed to request spending:', err);
      alert('Failed to request spending. Check console for details.');
    }
  };

  const handleExecuteProposal = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await executeProposal(Number(proposalId));
      alert('Proposal executed successfully!');
      setProposalId('');
    } catch (err) {
      console.error('Failed to execute proposal:', err);
      alert('Failed to execute proposal. Check console for details.');
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white luxury-shadow rounded-none p-8">
        <h2 className="text-3xl font-light mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-luxury-black)' }}>
          Governance
        </h2>
        <p className="font-light" style={{ color: 'var(--color-luxury-gray)' }}>
          Please connect your wallet to participate in governance.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white luxury-shadow rounded-none p-8">
      <h2 className="text-3xl font-light mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-luxury-black)' }}>
        Governance
      </h2>

      {error && (
        <div className="border-l-4 px-4 py-3 mb-6" style={{ borderColor: '#dc2626', backgroundColor: '#fee2e2', color: '#991b1b' }}>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b" style={{ borderColor: 'var(--color-luxury-light-gray)' }}>
        <button
          onClick={() => setActiveTab('role')}
          className={`px-6 py-3 font-light tracking-wider uppercase text-sm transition-all ${
            activeTab === 'role'
              ? 'border-b-2'
              : 'opacity-50 hover:opacity-75'
          }`}
          style={activeTab === 'role' ? {
            borderColor: 'var(--color-luxury-gold)',
            color: 'var(--color-luxury-black)',
            letterSpacing: '0.1em'
          } : {
            borderColor: 'transparent',
            color: 'var(--color-luxury-gray)',
            letterSpacing: '0.1em'
          }}
        >
          Role
        </button>
        <button
          onClick={() => setActiveTab('spending')}
          className={`px-6 py-3 font-light tracking-wider uppercase text-sm transition-all ${
            activeTab === 'spending'
              ? 'border-b-2'
              : 'opacity-50 hover:opacity-75'
          }`}
          style={activeTab === 'spending' ? {
            borderColor: 'var(--color-luxury-gold)',
            color: 'var(--color-luxury-black)',
            letterSpacing: '0.1em'
          } : {
            borderColor: 'transparent',
            color: 'var(--color-luxury-gray)',
            letterSpacing: '0.1em'
          }}
        >
          Spending
        </button>
        <button
          onClick={() => setActiveTab('execute')}
          className={`px-6 py-3 font-light tracking-wider uppercase text-sm transition-all ${
            activeTab === 'execute'
              ? 'border-b-2'
              : 'opacity-50 hover:opacity-75'
          }`}
          style={activeTab === 'execute' ? {
            borderColor: 'var(--color-luxury-gold)',
            color: 'var(--color-luxury-black)',
            letterSpacing: '0.1em'
          } : {
            borderColor: 'transparent',
            color: 'var(--color-luxury-gray)',
            letterSpacing: '0.1em'
          }}
        >
          Execute
        </button>
      </div>

      {/* Role Request Tab */}
      {activeTab === 'role' && (
        <form onSubmit={handleRequestRole}>
          <div className="mb-6">
            <label className="block text-xs tracking-wider uppercase mb-3" style={{ color: 'var(--color-luxury-gray)', letterSpacing: '0.1em' }}>
              Role Type
            </label>
            <select
              value={roleRequest.role}
              onChange={(e) => setRoleRequest({ ...roleRequest, role: e.target.value as any })}
              className="border-b-2 w-full py-3 px-0 font-light leading-tight focus:outline-none transition-all cursor-pointer"
              style={{
                backgroundColor: 'var(--color-luxury-cream)',
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

          <div className="mb-8">
            <label className="block text-xs tracking-wider uppercase mb-3" style={{ color: 'var(--color-luxury-gray)', letterSpacing: '0.1em' }}>
              Statement
            </label>
            <textarea
              value={roleRequest.description}
              onChange={(e) => setRoleRequest({ ...roleRequest, description: e.target.value })}
              className="border-2 w-full py-3 px-4 font-light leading-relaxed focus:outline-none transition-all resize-none"
              style={{
                backgroundColor: 'var(--color-luxury-cream)',
                color: 'var(--color-luxury-black)',
                borderColor: 'var(--color-luxury-light-gray)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-luxury-gold)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-luxury-light-gray)'}
              rows={4}
              required
              placeholder="Articulate your qualifications and vision for this role..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full luxury-gold-gradient text-black py-4 px-6 rounded-none font-medium tracking-wider uppercase text-sm hover:opacity-90 transition-all disabled:opacity-50"
            style={{ letterSpacing: '0.12em' }}
          >
            {isLoading ? 'Processing...' : 'Submit Request'}
          </button>

          <div className="mt-6 border-l-4 p-4" style={{ borderColor: 'var(--color-luxury-gold)', backgroundColor: 'var(--color-luxury-cream)' }}>
            <p className="text-xs font-light" style={{ color: 'var(--color-luxury-gray)' }}>
              <strong style={{ fontWeight: 500 }}>Note:</strong> Premium membership required. Requests are submitted as governance proposals.
            </p>
          </div>
        </form>
      )}

      {/* Spending Request Tab */}
      {activeTab === 'spending' && (
        <form onSubmit={handleRequestSpending}>
          <div className="mb-6">
            <label className="block text-xs tracking-wider uppercase mb-3" style={{ color: 'var(--color-luxury-gray)', letterSpacing: '0.1em' }}>
              Beneficiary Address
            </label>
            <input
              type="text"
              value={spendingRequest.beneficiary}
              onChange={(e) => setSpendingRequest({ ...spendingRequest, beneficiary: e.target.value })}
              className="border-b-2 w-full py-3 px-0 font-mono text-sm font-light leading-tight focus:outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-luxury-cream)',
                color: 'var(--color-luxury-black)',
                borderBottomColor: 'var(--color-luxury-light-gray)'
              }}
              onFocus={(e) => e.target.style.borderBottomColor = 'var(--color-luxury-gold)'}
              onBlur={(e) => e.target.style.borderBottomColor = 'var(--color-luxury-light-gray)'}
              required
              placeholder="5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs tracking-wider uppercase mb-3" style={{ color: 'var(--color-luxury-gray)', letterSpacing: '0.1em' }}>
              Amount (Tokens)
            </label>
            <input
              type="number"
              value={spendingRequest.amount}
              onChange={(e) => setSpendingRequest({ ...spendingRequest, amount: e.target.value })}
              className="border-b-2 w-full py-3 px-0 font-light leading-tight focus:outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-luxury-cream)',
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

          <div className="mb-8">
            <label className="block text-xs tracking-wider uppercase mb-3" style={{ color: 'var(--color-luxury-gray)', letterSpacing: '0.1em' }}>
              Justification
            </label>
            <textarea
              value={spendingRequest.description}
              onChange={(e) => setSpendingRequest({ ...spendingRequest, description: e.target.value })}
              className="border-2 w-full py-3 px-4 font-light leading-relaxed focus:outline-none transition-all resize-none"
              style={{
                backgroundColor: 'var(--color-luxury-cream)',
                color: 'var(--color-luxury-black)',
                borderColor: 'var(--color-luxury-light-gray)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-luxury-gold)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-luxury-light-gray)'}
              rows={4}
              required
              placeholder="Detail the purpose and expected impact of this proposal..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full luxury-gold-gradient text-black py-4 px-6 rounded-none font-medium tracking-wider uppercase text-sm hover:opacity-90 transition-all disabled:opacity-50"
            style={{ letterSpacing: '0.12em' }}
          >
            {isLoading ? 'Processing...' : 'Submit Proposal'}
          </button>

          <div className="mt-6 border-l-4 p-4" style={{ borderColor: 'var(--color-luxury-gold)', backgroundColor: 'var(--color-luxury-cream)' }}>
            <p className="text-xs font-light" style={{ color: 'var(--color-luxury-gray)' }}>
              <strong style={{ fontWeight: 500 }}>Note:</strong> Council and Mentor roles required for spending proposals.
            </p>
          </div>
        </form>
      )}

      {/* Execute Proposal Tab */}
      {activeTab === 'execute' && (
        <form onSubmit={handleExecuteProposal}>
          <div className="mb-8">
            <label className="block text-xs tracking-wider uppercase mb-3" style={{ color: 'var(--color-luxury-gray)', letterSpacing: '0.1em' }}>
              Proposal ID
            </label>
            <input
              type="number"
              value={proposalId}
              onChange={(e) => setProposalId(e.target.value)}
              className="border-b-2 w-full py-3 px-0 font-light leading-tight focus:outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-luxury-cream)',
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-none font-medium tracking-wider uppercase text-sm transition-all disabled:opacity-50"
            style={{
              backgroundColor: 'var(--color-luxury-black)',
              color: 'var(--color-luxury-white)',
              letterSpacing: '0.12em'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-luxury-gray)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-luxury-black)'}
          >
            {isLoading ? 'Processing...' : 'Execute Proposal'}
          </button>

          <div className="mt-6 border-l-4 p-4" style={{ borderColor: '#d97706', backgroundColor: '#fef3c7' }}>
            <p className="text-xs font-light" style={{ color: '#92400e' }}>
              <strong style={{ fontWeight: 500 }}>Caution:</strong> Ensure the proposal is approved. Council and Mentor privileges required.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
