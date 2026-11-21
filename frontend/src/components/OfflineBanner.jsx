import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';

/**
 * OfflineBanner
 * Monitors network connection status and surfaces dignified notification
 * so users never wonder why actions fail during connectivity drops.
 */
export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );
  const [justReconnected, setJustReconnected] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      setDismissed(false);
      const timer = setTimeout(() => setJustReconnected(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (dismissed || (!isOffline && !justReconnected)) {
    return null;
  }

  if (justReconnected) {
    return (
      <div 
        className="fixed bottom-4 right-4 z-50 px-4 py-3 rounded-2xl bg-[#085C42] text-white shadow-2xl flex items-center gap-3 text-xs font-semibold animate-fadeIn"
        role="status"
        aria-live="polite"
      >
        <Wifi className="w-4 h-4 text-emerald-200" />
        <span>Connection restored. Workspace synchronized.</span>
      </div>
    );
  }

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 bg-[#8A5A12] text-[#F7F2E7] px-4 py-2.5 shadow-xl flex items-center justify-between text-xs sm:text-sm font-sans"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center justify-center gap-2.5 mx-auto">
        <WifiOff className="w-4 h-4 text-[#F3D98B]" />
        <span>
          <strong className="text-white">You are offline.</strong> Changes will sync automatically when your network reconnects.
        </span>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="text-[#F3D98B] hover:text-white p-1 rounded-lg transition-colors cursor-pointer shrink-0"
        title="Dismiss offline alert"
        aria-label="Close offline banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
