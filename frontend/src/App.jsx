import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { PublicNavbar } from './components/PublicNavbar';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { FeedbackWidget } from './components/FeedbackWidget';
import { OnboardingWizard } from './components/OnboardingWizard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineBanner } from './components/OfflineBanner';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { BrandHubPage } from './pages/BrandHubPage';
import { NewReviewPage } from './pages/NewReviewPage';
import { AnalysisResultsPage } from './pages/AnalysisResultsPage';
import { CorrectionPage } from './pages/CorrectionPage';
import { ReviewApprovalPage } from './pages/ReviewApprovalPage';
import { GovernanceInsightsPage } from './pages/GovernanceInsightsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TrustPage } from './pages/TrustPage';
import { ProductPage } from './pages/ProductPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { QualityPage } from './pages/QualityPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { SealOfVerityIntro } from './components/animation/SealOfVerityIntro';
import { RolePickerModal } from './components/RolePickerModal';
import { initSession, resetDemo, getMe, logoutUser } from './lib/api';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [role, setRole] = useState('creator');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlId = params.get('id') || params.get('submission_id');
      if (urlId) return urlId;
      return sessionStorage.getItem('verity_last_submission_id') || null;
    }
    return null;
  });
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isRolePickerOpen, setIsRolePickerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isWakingServer, setIsWakingServer] = useState(false);

  // Sync initial URL pathname & deep link query parameters
  useEffect(() => {
    const rawPath = window.location.pathname.replace(/^\//, '').toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || params.get('submission_id');
    if (id) {
      setSelectedSubmissionId(id);
      sessionStorage.setItem('verity_last_submission_id', id);
    }

    const validPages = [
      'product', 'how-it-works', 'trust-security', 'resources', 'quality',
      'login', 'register', 'forgot-password', 'profile', 'dashboard',
      'brand-hub', 'new-review', 'results', 'correction', 'review',
      'insights', 'settings', 'trust', 'roadmap'
    ];
    if (rawPath === 'trust-security' || rawPath === 'trust') {
      setActivePage('trust-security');
    } else if (validPages.includes(rawPath)) {
      setActivePage(rawPath);
    }
  }, []);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const onPop = () => {
      const p = window.location.pathname.replace(/^\//, '').toLowerCase() || 'landing';
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id') || params.get('submission_id');
      if (id) {
        setSelectedSubmissionId(id);
        sessionStorage.setItem('verity_last_submission_id', id);
      }
      if (p === 'trust') setActivePage('trust-security');
      else setActivePage(p);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const handleOpenRolePicker = () => setIsRolePickerOpen(true);
    window.addEventListener('verity:open-role-picker', handleOpenRolePicker);
    return () => window.removeEventListener('verity:open-role-picker', handleOpenRolePicker);
  }, []);

  const handleSelectPersona = (chosenRole, targetPage) => {
    setRole(chosenRole);
    navigateTo(targetPage);
  };

  const navigateTo = (page, explicitId = null) => {
    setActivePage(page);
    const subId = explicitId || selectedSubmissionId;
    if (explicitId) {
      setSelectedSubmissionId(explicitId);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('verity_last_submission_id', explicitId);
      }
    }
    let urlPath = page === 'landing' ? '/' : `/${page}`;
    if (subId && ['results', 'correction', 'review'].includes(page)) {
      urlPath += `?id=${encodeURIComponent(subId)}`;
    }
    window.history.pushState(null, '', urlPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // If initialization takes longer than 2.5s (e.g. cloud instance cold start), show friendly message
    const timer = setTimeout(() => {
      if (isInitializing) setIsWakingServer(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, [isInitializing]);

  useEffect(() => {
    async function bootstrap() {
      try {
        await initSession();
        const user = await getMe();
        if (user) {
          setCurrentUser(user);
          if (user.role) setRole(user.role);
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        setIsInitializing(false);
        setIsWakingServer(false);
      }
    }
    bootstrap();
  }, []);

  const handleResetDemo = async () => {
    if (window.confirm('Reset this demo workspace back to fresh initial state? All test submissions will be cleared and brand rules/facts restored.')) {
      try {
        await resetDemo();
        alert('Workspace reset successfully! Submissions cleared.');
        window.location.reload();
      } catch (err) {
        alert('Reset failed: ' + err.message);
      }
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user?.role) setRole(user.role);
    navigateTo('dashboard');
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      setRole('creator');
      navigateTo('landing');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isPublicPage = [
    'landing', 'login', 'register', 'forgot-password', 
    'product', 'how-it-works', 'trust-security', 'resources', 'quality'
  ].includes(activePage);

  return (
    <ErrorBoundary>
      <div 
        className={`min-h-screen flex flex-col font-sans relative ${
          isPublicPage 
            ? (activePage === 'quality' ? 'bg-[#F7F2E7]' : 'bg-[#050A1F] text-[#F7F2E7]') + ' selection:bg-[#D4AF37]/30 selection:text-white' 
            : 'theme-light text-[#2B3345] selection:bg-[#D4AF37]/30 selection:text-[#0A1230]'
        }`}
        style={!isPublicPage ? { background: 'linear-gradient(180deg, #F6F1E7 0%, #FBF8F1 100%)' } : {}}
      >
        {/* Network Offline Safeguard Banner */}
        <OfflineBanner />

        {/* Friendly Cold Start Waking Banner */}
      {isWakingServer && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#0A1230] border-b border-[#D4AF37]/50 text-[#F7F2E7] px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center justify-center gap-3 mx-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping" />
            <span>
              <strong className="text-[#D4AF37]">Waking the server...</strong> Cloud free instances spin down after inactivity (approx 25–45s). Connecting your isolated demo session...
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsWakingServer(false)}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Dismiss notification"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Navigation Header */}
      {isPublicPage ? (
        <PublicNavbar 
          activePage={activePage} 
          setActivePage={navigateTo} 
          onOpenRolePicker={() => setIsRolePickerOpen(true)}
        />
      ) : (
        <Navbar
          activePage={activePage}
          setActivePage={navigateTo}
          role={role}
          setRole={setRole}
          onResetDemo={handleResetDemo}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          currentUser={currentUser}
          onLogout={handleLogout}
          onSelectSubmission={(id) => {
            setSelectedSubmissionId(id);
            navigateTo('results');
          }}
        />
      )}

      {/* Main View Router */}
      <main className="flex-grow">
        {activePage === 'landing' && <LandingPage setActivePage={navigateTo} />}
        {activePage === 'product' && <ProductPage setActivePage={navigateTo} />}
        {activePage === 'how-it-works' && <HowItWorksPage setActivePage={navigateTo} />}
        {(activePage === 'trust-security' || activePage === 'trust') && <TrustPage setActivePage={navigateTo} />}
        {activePage === 'resources' && <ResourcesPage setActivePage={navigateTo} />}
        {activePage === 'quality' && <QualityPage setActivePage={navigateTo} />}
        {activePage === 'login' && (
          <LoginPage 
            setActivePage={navigateTo} 
            onLoginSuccess={handleLoginSuccess} 
          />
        )}
        {activePage === 'register' && (
          <RegisterPage 
            setActivePage={navigateTo} 
            onRegisterSuccess={handleLoginSuccess} 
          />
        )}
        {activePage === 'forgot-password' && (
          <ForgotPasswordPage setActivePage={navigateTo} />
        )}
        {activePage === 'profile' && (
          <ProfilePage 
            setActivePage={navigateTo} 
            currentUser={currentUser} 
            onLogout={handleLogout}
            onProfileUpdated={(updated) => setCurrentUser(prev => ({ ...prev, ...updated }))}
          />
        )}
        {activePage === 'dashboard' && (
          <DashboardPage 
            setActivePage={navigateTo} 
            setSelectedSubmissionId={setSelectedSubmissionId} 
          />
        )}
        {activePage === 'brand-hub' && <BrandHubPage />}
        {activePage === 'new-review' && (
          <NewReviewPage 
            setActivePage={navigateTo} 
            setSelectedSubmissionId={setSelectedSubmissionId} 
            role={role} 
          />
        )}
        {activePage === 'results' && (
          <AnalysisResultsPage 
            submissionId={selectedSubmissionId} 
            setActivePage={navigateTo} 
            role={role} 
          />
        )}
        {activePage === 'correction' && (
          <CorrectionPage 
            submissionId={selectedSubmissionId} 
            setActivePage={navigateTo} 
            role={role} 
          />
        )}
        {activePage === 'review' && (
          <ReviewApprovalPage 
            submissionId={selectedSubmissionId} 
            setActivePage={navigateTo} 
            role={role} 
            onRoleChange={setRole}
          />
        )}
        {activePage === 'insights' && <GovernanceInsightsPage setActivePage={navigateTo} />}
        {activePage === 'settings' && (
          <SettingsPage 
            role={role} 
            setRole={setRole} 
            onResetDemo={handleResetDemo} 
          />
        )}
        {activePage === 'roadmap' && <RoadmapPage setActivePage={navigateTo} />}
      </main>

      {/* Global Interactive Overlays */}
      {activePage === 'landing' && <SealOfVerityIntro />}

      <RolePickerModal
        isOpen={isRolePickerOpen}
        onClose={() => setIsRolePickerOpen(false)}
        onSelectPersona={handleSelectPersona}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        setIsOpen={setIsCommandPaletteOpen}
        setActivePage={navigateTo}
        onResetDemo={handleResetDemo}
      />

      <OnboardingWizard
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        setActivePage={navigateTo}
      />

      <FeedbackWidget />

      {/* Footers: Marketing Footer on Public Pages, Slim One-Line Footer inside App */}
      {isPublicPage ? (
        <Footer setActivePage={navigateTo} />
      ) : (
        <footer className="py-4 border-t border-[#E6DDC8] bg-[#F6F1E7] text-center text-xs font-sans text-[#5B6478]">
          <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 VERITY · WCC Forge 48 · Team Cognexa</span>
            <span className="font-medium text-[#8A5A12]">AI findings are advisory; an authorised human reviewer owns final approval.</span>
            <span>Test Brand: Verity Learning (SQLite verity.db)</span>
          </div>
        </footer>
      )}
      </div>
    </ErrorBoundary>
  );
}
