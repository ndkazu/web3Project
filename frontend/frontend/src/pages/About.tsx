export function About() {
  return (
    <div className="min-h-screen px-8 py-24" style={{ backgroundColor: 'var(--color-luxury-cream)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1
            className="text-6xl font-light mb-6 tracking-wider"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-luxury-black)' }}
          >
            Community
          </h1>
          <div className="w-24 h-px mx-auto" style={{ backgroundColor: 'var(--color-luxury-gold)' }} />
        </div>

        {/* Content */}
        <div className="bg-white luxury-shadow p-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="max-w-2xl mx-auto">
            <p
              className="text-lg font-light leading-relaxed mb-8 text-center"
              style={{ color: 'var(--color-luxury-gray)' }}
            >
              A sophisticated Decentralized Autonomous Organization platform built on Polkadot.
              Join our community to subscribe, participate in governance, and shape the future through collective decision-making.
            </p>

            <div className="space-y-12 mt-16">
              {/* Philosophy */}
              <div>
                <h2
                  className="text-2xl font-light mb-4 tracking-wide"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-luxury-black)' }}
                >
                  Our Philosophy
                </h2>
                <p className="font-light leading-relaxed" style={{ color: 'var(--color-luxury-gray)' }}>
                  We believe in the power of decentralized governance to create more transparent,
                  equitable, and resilient organizations. Our platform empowers individuals to take
                  ownership of collective decisions and participate meaningfully in shaping our shared future.
                </p>
              </div>

              {/* Technology */}
              <div>
                <h2
                  className="text-2xl font-light mb-4 tracking-wide"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-luxury-black)' }}
                >
                  Technology
                </h2>
                <p className="font-light leading-relaxed mb-4" style={{ color: 'var(--color-luxury-gray)' }}>
                  Built on the Polkadot ecosystem using ink! smart contracts, our platform leverages
                  cutting-edge blockchain technology to ensure security, transparency, and scalability.
                </p>
                <ul className="space-y-2">
                  {[
                    'Substrate Contracts Node for robust execution',
                    'ink! Smart Contracts for secure governance logic',
                    'Polkadot.js for seamless blockchain interaction',
                    'React frontend for elegant user experience'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-3" style={{ color: 'var(--color-luxury-gold)' }}>—</span>
                      <span className="text-sm font-light" style={{ color: 'var(--color-luxury-gray)' }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Features */}
              <div>
                <h2
                  className="text-2xl font-light mb-4 tracking-wide"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-luxury-black)' }}
                >
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: 'Tiered Membership', desc: 'Flexible subscription plans for different needs' },
                    { title: 'Democratic Voting', desc: 'One member, one vote on key decisions' },
                    { title: 'Role Management', desc: 'Merit-based leadership positions' },
                    { title: 'Treasury Control', desc: 'Community-governed fund allocation' }
                  ].map((feature, i) => (
                    <div key={i} className="border-l-2 pl-4" style={{ borderColor: 'var(--color-luxury-gold)' }}>
                      <h3
                        className="text-sm font-medium tracking-wider uppercase mb-2"
                        style={{ color: 'var(--color-luxury-gold)', letterSpacing: '0.1em' }}
                      >
                        {feature.title}
                      </h3>
                      <p className="text-xs font-light" style={{ color: 'var(--color-luxury-gray)' }}>
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Network Info */}
              <div className="border-t pt-8" style={{ borderColor: 'var(--color-luxury-light-gray)' }}>
                <h3
                  className="text-xs tracking-widest uppercase mb-4 text-center"
                  style={{ color: 'var(--color-luxury-gold)', letterSpacing: '0.2em' }}
                >
                  Network Information
                </h3>
                <p className="text-xs font-light text-center" style={{ color: 'var(--color-luxury-gray)' }}>
                  Ensure your local substrate node is running on ws://127.0.0.1:9944
                </p>
                <p className="text-xs font-light text-center mt-2" style={{ color: 'var(--color-luxury-gray)' }}>
                  Connect using Talisman wallet for the best experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
