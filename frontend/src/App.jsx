import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { FeedbackWidget } from './components/FeedbackWidget';
import { OnboardingWizard } from './components/OnboardingWizard';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { BrandHubPage } from './pages/BrandHubPage';
import { NewReviewPage } from './pages/NewReviewPage';
import { AnalysisResultsPage } from './pages/AnalysisResultsPage';
import { CorrectionPage } from './pages/CorrectionPage';
import { ReviewApprovalPage } from './pages/ReviewApprovalPage';
import { SubmissionHistoryPage } from './pages/SubmissionHistoryPage';
import { GovernanceInsightsPage } from './pages/GovernanceInsightsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TrustPage } from './pages/TrustPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { initSession, resetDemo, getMe, logoutUser } from './lib/api';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [role, setRole] = useState('creator');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
      }
    }
    bootstrap();
  }, []);

  const handleResetDemo = async () => {
    if (window.confirm('Reset this demo workspace back to fresh initial state? All your edits will be restored to Verity Learning demo defaults.')) {
      try {
        await resetDemo();
        alert('Workspace reseeded successfully!');
        window.location.reload();
      } catch (err) {
        alert('Reset failed: ' + err.message);
      }
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user?.role) setRole(user.role);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      setRole('creator');
      setActivePage('landing');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory font-sans text-ink selection:bg-champagne selection:text-ink relative">
      
      {/* Navigation Header */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        role={role}
        setRole={setRole}
        onResetDemo={handleResetDemo}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSelectSubmission={(id) => {
          setSelectedSubmissionId(id);
          setActivePage('results');
        }}
      />

      {/* Main View Router */}
      <main className="flex-grow">
        {activePage === 'landing' && <LandingPage setActivePage={setActivePage} />}
        {activePage === 'login' && (
          <LoginPage 
            setActivePage={setActivePage} 
            onLoginSuccess={handleLoginSuccess} 
          />
        )}
        {activePage === 'register' && (
          <RegisterPage 
            setActivePage={setActivePage} 
            onRegisterSuccess={handleLoginSuccess} 
          />
        )}
        {activePage === 'forgot-password' && (
          <ForgotPasswordPage setActivePage={setActivePage} />
        )}
        {activePage === 'profile' && (
          <ProfilePage 
            setActivePage={setActivePage} 
            currentUser={currentUser} 
            onLogout={handleLogout}
            onProfileUpdated={(updated) => setCurrentUser(prev => ({ ...prev, ...updated }))}
          />
        )}
        {activePage === 'dashboard' && (
          <DashboardPage 
            setActivePage={setActivePage} 
            setSelectedSubmissionId={setSelectedSubmissionId} 
          />
        )}
        {activePage === 'brand-hub' && <BrandHubPage />}
        {activePage === 'new-review' && (
          <NewReviewPage 
            setActivePage={setActivePage} 
            setSelectedSubmissionId={setSelectedSubmissionId} 
            role={role} 
          />
        )}
        {activePage === 'results' && (
          <AnalysisResultsPage 
            submissionId={selectedSubmissionId} 
            setActivePage={setActivePage} 
            role={role} 
          />
        )}
        {activePage === 'correction' && (
          <CorrectionPage 
            submissionId={selectedSubmissionId} 
            setActivePage={setActivePage} 
            role={role} 
          />
        )}
        {activePage === 'review' && (
          <ReviewApprovalPage 
            submissionId={selectedSubmissionId} 
            setActivePage={setActivePage} 
            role={role} 
          />
        )}
        {activePage === 'submissions' && (
          <SubmissionHistoryPage 
            setActivePage={setActivePage} 
            setSelectedSubmissionId={setSelectedSubmissionId} 
          />
        )}
        {activePage === 'insights' && <GovernanceInsightsPage setActivePage={setActivePage} />}
        {activePage === 'settings' && (
          <SettingsPage 
            role={role} 
            setRole={setRole} 
            onResetDemo={handleResetDemo} 
          />
        )}
        {activePage === 'trust' && <TrustPage />}
        {activePage === 'roadmap' && <RoadmapPage setActivePage={setActivePage} />}
      </main>

      {/* Global Interactive Overlays */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        setIsOpen={setIsCommandPaletteOpen}
        setActivePage={setActivePage}
        onResetDemo={handleResetDemo}
      />

      <OnboardingWizard
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        setActivePage={setActivePage}
      />

      <FeedbackWidget />

      <Footer setActivePage={setActivePage} />
    </div>
  );
}
