import React from 'react';
import { ShieldAlert, RefreshCw, Home, Copy, Check } from 'lucide-react';

/**
 * Verity Enterprise Error Boundary
 * Catches unhandled runtime errors in React trees, displays a dignified,
 * brand-compliant recovery screen, and logs unique error references for support.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      copied: false,
    };
  }

  static getDerivedStateFromError(error) {
    const errorId = 'ERR-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    return { hasError: true, error, errorId };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error(`[Verity ErrorBoundary ${this.state.errorId || 'ERR'}]`, error, errorInfo);
  }

  handleCopyDiagnostics = () => {
    const diagnostics = JSON.stringify({
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    }, null, 2);

    navigator.clipboard.writeText(diagnostics);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, errorId: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.href = '/dashboard';
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <div className="min-h-[450px] w-full flex items-center justify-center p-6 bg-[#0A1226]/5 rounded-3xl">
          <div className="max-w-lg w-full bg-white rounded-3xl border border-[#E6DDC8] shadow-2xl p-8 text-center text-[#2B3345]">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#D64550]/10 border border-[#D64550]/30 flex items-center justify-center text-[#D64550]">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
              Runtime Exception Intercepted
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#0A1230] mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-[#5B6478] mb-6 leading-relaxed">
              Verity safely isolated this view exception to protect your workspace state. No data or draft copy was lost.
            </p>

            {/* Error ID tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF8F2] border border-[#E6DDC8] text-xs font-mono text-[#0A1230] mb-6">
              <span className="text-[#8A5A12] font-semibold">Incident Reference:</span>
              <span>{this.state.errorId}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0A1230] text-[#F7F2E7] hover:bg-[#14203D] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#E6DDC8] bg-[#FAF8F2] text-[#0A1230] hover:bg-[#F6F1E7] font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Home className="w-4 h-4 text-[#8A5A12]" />
                <span>Go to Dashboard</span>
              </button>
            </div>

            {/* Copy Diagnostics Toggle */}
            <button
              type="button"
              onClick={this.handleCopyDiagnostics}
              className="text-xs text-[#5B6478] hover:text-[#0A1230] font-medium flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
            >
              {this.state.copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#085C42]" />
                  <span className="text-[#085C42] font-semibold">Diagnostics copied to clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Technical Diagnostics</span>
                </>
              )}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
