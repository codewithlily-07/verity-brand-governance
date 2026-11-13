import React, { useState } from 'react';
import { Shield, Eye, EyeOff, ArrowRight, Lock, Mail, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { loginUser } from '../lib/api';

export function LoginPage({ setActivePage, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const data = await loginUser(email, password);
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
      setActivePage('dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-ivory">
      
      {/* Left Column: Brand Identity & Value Props */}
      <div className="lg:w-1/2 bg-midnight text-ivory p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-navy-2/80">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => setActivePage('landing')}>
            <div className="w-10 h-10 rounded-full bg-navy-2 border-2 border-gold flex items-center justify-center shadow-glow">
              <svg className="w-6 h-6 text-gold" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="4" strokeDasharray="6 4" />
                <path d="M30 48 L46 66 L72 32" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white block">VERITY</span>
              <span className="text-[10px] tracking-widest text-gold-light uppercase font-sans font-medium -mt-1 block">Brand Governance</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight max-w-md">
            Consistent. Compliant. Trustworthy.
          </h1>
          <p className="text-gray-300 text-sm mt-4 leading-relaxed max-w-md">
            Enterprise pre-publication brand governance. Detect guideline drift, verify approved facts, and protect your brand equity with audited human review.
          </p>

          <div className="mt-10 space-y-4 max-w-md">
            <div className="flex items-start gap-3 bg-navy-2/60 p-3.5 rounded-xl border border-gray-700/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Evidence-Backed Verification</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Every finding cites your approved brand guidelines or states explicit absence of evidence.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-navy-2/60 p-3.5 rounded-xl border border-gray-700/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Intent-Preserving Diff</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Non-destructive side-by-side corrections reusing approved corporate phrasing.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-navy-2/60 p-3.5 rounded-xl border border-gray-700/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Cryptographic Human Approvals</p>
                <p className="text-[11px] text-gray-400 mt-0.5">SHA-256 bound sign-offs ensuring unreviewed copy never slips into production.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 text-xs text-gray-400 border-t border-navy-2 flex items-center justify-between">
          <span>Enterprise Security & Multi-Tenancy</span>
          <span>Team COGNEXA</span>
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold text-ink">Sign in to your account</h2>
            <p className="text-xs text-gray-500 mt-1">Enter your credentials to access your brand governance workspace.</p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3.5 bg-coral/10 border border-coral/30 rounded-xl flex items-start gap-2.5 text-xs text-coral">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Corporate Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organisation.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-ink"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={() => setActivePage('forgot-password')}
                  className="text-[11px] text-gold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-ink"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-ink focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-midnight hover:bg-navy text-gold hover:text-white font-medium text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Don't have an enterprise account?{' '}
              <button
                onClick={() => setActivePage('register')}
                className="text-gold font-semibold hover:underline"
              >
                Register organisation
              </button>
            </p>
          </div>

          <div className="mt-4 p-3 bg-champagne/20 rounded-xl border border-gold/30 text-center">
            <p className="text-[11px] text-gray-700">
              Evaluating for a hackathon or review?{' '}
              <button
                onClick={() => setActivePage('dashboard')}
                className="text-gold font-bold hover:underline inline-flex items-center gap-0.5"
              >
                Explore Demo Workspace <ArrowRight className="w-3 h-3 inline" />
              </button>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

