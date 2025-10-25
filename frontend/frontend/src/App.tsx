import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { NotificationProvider } from './components/NotificationProvider';
import { Home } from './pages/Home';
import { Membership } from './pages/Membership';
import { Governance } from './pages/Governance';
import { About } from './pages/About';
import { Faucet } from './pages/Faucet';

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen">
      {/* Show navigation on all pages except home */}
      {!isHome && <Navigation />}

      {/* Add padding-top to non-home pages to account for fixed navigation */}
      <div style={!isHome ? { paddingTop: '80px' } : {}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/faucet" element={<Faucet />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>

      {/* Footer (only on non-home pages) */}
      {!isHome && (
        <footer
          className="py-12 text-center text-sm font-light border-t"
          style={{
            color: 'var(--color-luxury-gray)',
            backgroundColor: 'var(--color-luxury-cream)',
            borderColor: 'var(--color-luxury-light-gray)'
          }}
        >
          <div className="space-y-2">
            <p className="tracking-wide">Built with Polkadot • ink! Smart Contracts • React</p>
            <p className="text-xs opacity-70">Decentralized Autonomous Organization</p>
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </Router>
  );
}

export default App;
