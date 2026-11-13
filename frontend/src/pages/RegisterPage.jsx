import React, { useState } from 'react';
import { Shield, Eye, EyeOff, ArrowRight, Lock, Mail, Building, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { registerUser } from '../lib/api';

export function RegisterPage({ setActivePage, onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const pwdScore = calculatePasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      setErrorMessage('Please accept the Terms of Service to continue.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await registerUser(name, email, orgName, password);
      if (onRegisterSuccess) {
        onRegisterSuccess(data.user);
      }
      setActivePage('dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-ivory">
      
      {/* Left Column: Brand & Security Overview */}
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
            Start governing brand communications with confidence.
          </h1>
          <p className="text-gray-300 text-sm mt-4 leading-relaxed max-w-md">
            Deploy an isolated organization workspace with dedicated guidelines, approved fact catalogs, and cryptographic reviewer sign-offs.
          </p>

          <div className="mt-8 space-y-3 max-w-md text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
              <span>Multi-tenant data isolation on every query</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
              <span>Three-layer analysis (Deterministic + Retrieval + AI)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
              <span>Server-side PDF compliance report exports</span>
            </div>
          </div>
        </div>

        <div className="pt-8 text-xs text-gray-400 border-t border-navy-2 flex items-center justify-between">
          <span>Enterprise SaaS Grade</span>
          <span>Team COGNEXA</span>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-bold text-ink">Create an organisation account</h2>
            <p className="text-xs text-gray-500 mt-1">Get started with your dedicated brand governance workspace.</p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 bg-coral/10 border border-coral/30 rounded-xl flex items-start gap-2.5 text-xs text-coral">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Compliance"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-ink"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Corporate Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@organisation.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-ink"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Organisation Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Acme Global Inc."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-ink"
                />
                <Building className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password (min 8 chars)</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-ink"
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

              {/* Password strength bar */}
              {password && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  {[1, 2, 3, 4].map(step => (
                    <div 
                      key={step} 
                      className={`h-1 flex-1 rounded-full ${
                        pwdScore >= step 
                          ? pwdScore === 4 ? 'bg-emerald-500' : pwdScore >= 2 ? 'bg-gold' : 'bg-coral' 
                          : 'bg-gray-200'
                      }`} 
                    />
                  ))}
                  <span className="text-[10px] text-gray-400 ml-1">
                    {pwdScore <= 1 ? 'Weak' : pwdScore <= 3 ? 'Medium' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-ink"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-gold focus:ring-gold"
              />
              <label htmlFor="terms" className="text-[11px] text-gray-600 cursor-pointer">
                I agree to the <span className="font-semibold text-ink">Terms of Service</span> and acknowledge pre-publication review data retention policies.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-2.5 px-4 bg-midnight hover:bg-navy text-gold hover:text-white font-medium text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Creating workspace...</span>
              ) : (
                <>
                  <span>Create Organisation Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <button
                onClick={() => setActivePage('login')}
                className="text-gold font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

