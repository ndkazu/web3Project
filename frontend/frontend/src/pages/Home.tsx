import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section with Parallax Effect */}
      <div
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        {/* Overlay Content */}
        <div className="relative z-10 text-center px-8 max-w-4xl mx-auto animate-fade-in-up">
          <h1
            className="text-7xl md:text-9xl font-light mb-8 tracking-wider"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-luxury-white)',
              textShadow: '2px 2px 20px rgba(0,0,0,0.5)'
            }}
          >
            DAO
          </h1>

          <p
            className="text-xl md:text-2xl font-light mb-4 tracking-widest uppercase"
            style={{
              color: 'var(--color-luxury-gold)',
              letterSpacing: '0.3em',
              textShadow: '1px 1px 10px rgba(0,0,0,0.5)'
            }}
          >
            Decentralized Autonomous Organization
          </p>

          <p
            className="text-base md:text-lg font-light mb-12 max-w-2xl mx-auto leading-relaxed"
            style={{
              color: 'var(--color-luxury-white)',
              opacity: 0.9
            }}
          >
            For those who walk alone, come forward to our side
          </p>

          <Link
            to="/membership"
            className="inline-block luxury-gold-gradient text-black px-12 py-4 font-medium tracking-widest uppercase text-sm hover:opacity-90 transition-all"
            style={{ letterSpacing: '0.15em' }}
          >
            Commence Experience
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div
            className="w-8 h-12 border-2 rounded-full flex items-start justify-center p-2"
            style={{ borderColor: 'var(--color-luxury-gold)' }}
          >
            <div
              className="w-1 h-3 rounded-full"
              style={{ backgroundColor: 'var(--color-luxury-gold)' }}
            />
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div
        className="min-h-screen flex items-center justify-center px-8 py-24"
        style={{ backgroundColor: 'var(--color-luxury-cream)' }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          {/* Membership */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div
              className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2"
              style={{ borderColor: 'var(--color-luxury-gold)' }}
            >
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="var(--color-luxury-gold)"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3
              className="text-2xl font-light mb-4 tracking-wider uppercase"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-luxury-black)', letterSpacing: '0.1em' }}
            >
              Membership
            </h3>
            <p
              className="font-light text-sm leading-relaxed mb-6"
              style={{ color: 'var(--color-luxury-gray)' }}
            >
              Select from curated subscription tiers, each designed to unlock distinct privileges within our community.
            </p>
            <Link
              to="/membership"
              className="inline-block border-b-2 pb-1 text-sm tracking-wider uppercase hover:opacity-70 transition-opacity"
              style={{
                borderColor: 'var(--color-luxury-gold)',
                color: 'var(--color-luxury-black)',
                letterSpacing: '0.1em'
              }}
            >
              Discover More
            </Link>
          </div>

          {/* Governance */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div
              className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2"
              style={{ borderColor: 'var(--color-luxury-gold)' }}
            >
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="var(--color-luxury-gold)"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3
              className="text-2xl font-light mb-4 tracking-wider uppercase"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-luxury-black)', letterSpacing: '0.1em' }}
            >
              Governance
            </h3>
            <p
              className="font-light text-sm leading-relaxed mb-6"
              style={{ color: 'var(--color-luxury-gray)' }}
            >
              Exercise your voice through proposal submission and voting. Shape the future of our organization.
            </p>
            <Link
              to="/governance"
              className="inline-block border-b-2 pb-1 text-sm tracking-wider uppercase hover:opacity-70 transition-opacity"
              style={{
                borderColor: 'var(--color-luxury-gold)',
                color: 'var(--color-luxury-black)',
                letterSpacing: '0.1em'
              }}
            >
              Discover More
            </Link>
          </div>

          {/* Faucet */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div
              className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2"
              style={{ borderColor: 'var(--color-luxury-gold)' }}
            >
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="var(--color-luxury-gold)"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3
              className="text-2xl font-light mb-4 tracking-wider uppercase"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-luxury-black)', letterSpacing: '0.1em' }}
            >
              Faucet
            </h3>
            <p
              className="font-light text-sm leading-relaxed mb-6"
              style={{ color: 'var(--color-luxury-gray)' }}
            >
              Claim free tokens to begin your journey. Get started with 10,000 tokens for testing.
            </p>
            <Link
              to="/faucet"
              className="inline-block border-b-2 pb-1 text-sm tracking-wider uppercase hover:opacity-70 transition-opacity"
              style={{
                borderColor: 'var(--color-luxury-gold)',
                color: 'var(--color-luxury-black)',
                letterSpacing: '0.1em'
              }}
            >
              Claim Now
            </Link>
          </div>

          {/* Community */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div
              className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2"
              style={{ borderColor: 'var(--color-luxury-gold)' }}
            >
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="var(--color-luxury-gold)"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3
              className="text-2xl font-light mb-4 tracking-wider uppercase"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-luxury-black)', letterSpacing: '0.1em' }}
            >
              Community
            </h3>
            <p
              className="font-light text-sm leading-relaxed mb-6"
              style={{ color: 'var(--color-luxury-gray)' }}
            >
              Join a collective of visionaries, builders, and leaders shaping the decentralized future.
            </p>
            <Link
              to="/about"
              className="inline-block border-b-2 pb-1 text-sm tracking-wider uppercase hover:opacity-70 transition-opacity"
              style={{
                borderColor: 'var(--color-luxury-gold)',
                color: 'var(--color-luxury-black)',
                letterSpacing: '0.1em'
              }}
            >
              Discover More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
