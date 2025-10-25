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
        className="relative min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        {/* Top Navigation for Home Page Only */}
        <div className="absolute top-0 left-0 right-0 z-50 px-4">
          {/* Logo at top center */}
          <div className="text-center pt-6 pb-4 md:pt-8 md:pb-6">
            <h1
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-black tracking-wider"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-edh-white)',
                letterSpacing: '0.1em'
              }}
            >
              ECOLE DES HOMMES
            </h1>
          </div>

          {/* Top right icons - hidden on very small screens */}
          <div className="hidden sm:flex absolute top-4 md:top-8 right-4 md:right-8 items-center gap-3 md:gap-6">
            <button className="hover:opacity-70 transition-all">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="hover:opacity-70 transition-all">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button className="hover:opacity-70 transition-all">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Overlay Content - Centered Vertically */}
        <div className="flex items-center justify-center min-h-screen pt-32 pb-24 sm:pt-24 sm:pb-24">
          <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl mx-auto animate-fade-in-up">
            <p
              className="text-sm sm:text-base md:text-xl lg:text-2xl font-light mb-6 md:mb-8 tracking-wider uppercase leading-relaxed"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-edh-white)',
                letterSpacing: '0.08em'
              }}
            >
              POUR CEUX QUI MARCHENT SEULS<br />
              VENEZ AVANCER À NOS CÔTÉS
            </p>

            <Link
              to="/membership"
              className="inline-block px-6 md:px-12 py-3 md:py-4 font-medium tracking-wider uppercase text-xs md:text-sm border-2 hover:bg-white hover:text-black transition-all"
              style={{
                borderColor: 'var(--color-edh-white)',
                color: 'var(--color-edh-white)',
                letterSpacing: '0.1em'
              }}
            >
              COMMENCER L'EXPÉRIENCE
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div
            className="w-8 h-8 md:w-10 md:h-10 border-2 rounded-full flex items-center justify-center"
            style={{ borderColor: 'var(--color-edh-white)' }}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div
        className="min-h-screen flex items-center justify-center px-8 py-24"
        style={{ backgroundColor: 'var(--color-edh-white)' }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          {/* Membership */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div
              className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2"
              style={{ borderColor: 'var(--color-edh-black)' }}
            >
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="var(--color-edh-black)"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3
              className="text-xl font-bold mb-4 tracking-wider uppercase"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-edh-black)', letterSpacing: '0.1em' }}
            >
              Membership
            </h3>
            <p
              className="font-light text-sm leading-relaxed mb-6"
              style={{ color: 'var(--color-edh-gray)' }}
            >
              Select from curated subscription tiers, each designed to unlock distinct privileges within our community.
            </p>
            <Link
              to="/membership"
              className="inline-block border-b-2 pb-1 text-sm tracking-wider uppercase hover:opacity-70 transition-opacity"
              style={{
                borderColor: 'var(--color-edh-black)',
                color: 'var(--color-edh-black)',
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
              style={{ borderColor: 'var(--color-edh-black)' }}
            >
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="var(--color-edh-black)"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3
              className="text-xl font-bold mb-4 tracking-wider uppercase"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-edh-black)', letterSpacing: '0.1em' }}
            >
              Governance
            </h3>
            <p
              className="font-light text-sm leading-relaxed mb-6"
              style={{ color: 'var(--color-edh-gray)' }}
            >
              Exercise your voice through proposal submission and voting. Shape the future of our organization.
            </p>
            <Link
              to="/governance"
              className="inline-block border-b-2 pb-1 text-sm tracking-wider uppercase hover:opacity-70 transition-opacity"
              style={{
                borderColor: 'var(--color-edh-black)',
                color: 'var(--color-edh-black)',
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
              style={{ borderColor: 'var(--color-edh-black)' }}
            >
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="var(--color-edh-black)"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3
              className="text-xl font-bold mb-4 tracking-wider uppercase"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-edh-black)', letterSpacing: '0.1em' }}
            >
              Faucet
            </h3>
            <p
              className="font-light text-sm leading-relaxed mb-6"
              style={{ color: 'var(--color-edh-gray)' }}
            >
              Claim free tokens to begin your journey. Get started with 10,000 tokens for testing.
            </p>
            <Link
              to="/faucet"
              className="inline-block border-b-2 pb-1 text-sm tracking-wider uppercase hover:opacity-70 transition-opacity"
              style={{
                borderColor: 'var(--color-edh-black)',
                color: 'var(--color-edh-black)',
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
              style={{ borderColor: 'var(--color-edh-black)' }}
            >
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="var(--color-edh-black)"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3
              className="text-xl font-bold mb-4 tracking-wider uppercase"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-edh-black)', letterSpacing: '0.1em' }}
            >
              Community
            </h3>
            <p
              className="font-light text-sm leading-relaxed mb-6"
              style={{ color: 'var(--color-edh-gray)' }}
            >
              Join a collective of visionaries, builders, and leaders shaping the decentralized future.
            </p>
            <Link
              to="/about"
              className="inline-block border-b-2 pb-1 text-sm tracking-wider uppercase hover:opacity-70 transition-opacity"
              style={{
                borderColor: 'var(--color-edh-black)',
                color: 'var(--color-edh-black)',
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
