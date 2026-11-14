import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Lock, Mail, Building, User, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-[#040A1C] text-white select-none">
      
      {/* Left Column (55%): Brand Identity & Architecture */}
      <div className="lg:w-[55%] bg-[#071230] p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#18285A]">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-[#E8B84B]/10 blur-[130px] rounded-full pointer-events-none" />
        
        <div>
          {/* Brand Crest & Logo */}
          <div 
            className="flex items-center gap-3.5 mb-10 cursor-pointer group inline-flex" 
            onClick={() => setActivePage('landing')}
          >
            <div className="relative w-10 h-8 flex items-center justify-center transition-transform group-hover:scale-105">
              <svg viewBox="0 0 260 190" className="w-full h-full drop-shadow-[0_0_12px_rgba(232,184,75,0.7)]" fill="none">
                <defs>
                  <linearGradient id="regV1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8A5A12"/>
                    <stop offset="35%" stopColor="#E8B84B"/>
                    <stop offset="60%" stopColor="#FFF1B8"/>
                    <stop offset="100%" stopColor="#B9822A"/>
                  </linearGradient>
                  <linearGradient id="regV2" x1="0%" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#9A6A1A"/>
                    <stop offset="50%" stopColor="#F3CC6B"/>
                    <stop offset="100%" stopColor="#FFF6D0"/>
                  </linearGradient>
                </defs>
                <path d="M10 46 C38 26 82 38 112 96 L126 160 C88 134 40 96 10 46 Z" fill="url(#regV1)"/>
                <path d="M30 52 C56 46 84 62 104 100 C78 82 52 66 30 52 Z" fill="#FFF1B8" opacity=".6"/>
                <path d="M120 164 C122 104 160 40 248 6 C196 44 170 98 150 158 C140 162 130 164 120 164 Z" fill="url(#regV2)"/>
                <path d="M138 140 C150 96 178 52 228 20 C190 58 168 100 152 146 Z" fill="#FFFFFF" opacity=".35"/>
              </svg>
            </div>
            <div>
              <span className="font-cinzel text-2xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1B8] via-[#E8B84B] to-[#FFF1B8] block leading-none">
                VERITY
              </span>
              <span className="text-[9px] font-mono tracking-[0.45em] text-[#E8B84B]/80 uppercase block mt-1">
                BRAND GOVERNANCE
              </span>
            </div>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-wide leading-tight max-w-lg">
            Deploy Unified <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1B8] via-[#E8B84B] to-[#FFF1B8]">
              Brand Governance
            </span>
          </h1>
          <p className="text-gray-300 text-sm mt-4 leading-relaxed max-w-lg font-sans">
            Provision an isolated workspace for your organization. Connect corporate guidelines, approved knowledge vaults, and audit logs.
          </p>

          {/* Feature Checklist */}
          <div className="mt-8 space-y-3 max-w-md">
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <div className="w-5 h-5 rounded-full bg-[#E8B84B]/20 border border-[#E8B84B] flex items-center justify-center text-[#FFF1B8] shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Multi-tenant workspace with isolated brand profiles</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <div className="w-5 h-5 rounded-full bg-[#E8B84B]/20 border border-[#E8B84B] flex items-center justify-center text-[#FFF1B8] shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Deterministic regex + vector semantic verification</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <div className="w-5 h-5 rounded-full bg-[#E8B84B]/20 border border-[#E8B84B] flex items-center justify-center text-[#FFF1B8] shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Role-based access: Creator, Reviewer, and Admin</span>
            </div>
          </div>
        </div>

        <div className="pt-8 text-xs text-gray-400 border-t border-[#18285A] flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <Shield className="w-3.5 h-3.5 text-[#E8B84B]" />
            SOC 2 Type II Certified Platform
          </span>
          <span className="font-mono text-[11px] text-[#E8B84B]">Team COGNEXA</span>
        </div>
      </div>

      {/* Right Column (45%): Registration Form Card */}
      <div className="lg:w-[45%] p-6 sm:p-10 lg:p-12 flex items-center justify-center relative">
        <div className="w-full max-w-md bg-[#071230]/90 border border-[#E8B84B]/40 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          
          <div className="mb-6">
            <h2 className="font-cinzel text-2xl font-bold text-white tracking-wide">
              Create Enterprise Account
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-sans">
              Get started with an isolated brand governance workspace.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eleanor Vance"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#040A1C] border border-[#18285A] rounded-xl focus:outline-none focus:border-[#FFF1B8] focus:ring-1 focus:ring-[#FFF1B8] text-white placeholder-gray-500 transition-colors"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Corporate Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eleanor@acme-corp.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#040A1C] border border-[#18285A] rounded-xl focus:outline-none focus:border-[#FFF1B8] focus:ring-1 focus:ring-[#FFF1B8] text-white placeholder-gray-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Organisation Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Acme Corporation"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#040A1C] border border-[#18285A] rounded-xl focus:outline-none focus:border-[#FFF1B8] focus:ring-1 focus:ring-[#FFF1B8] text-white placeholder-gray-500 transition-colors"
                />
                <Building className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-8 pr-7 py-2 text-xs bg-[#040A1C] border border-[#18285A] rounded-xl focus:outline-none focus:border-[#FFF1B8] focus:ring-1 focus:ring-[#FFF1B8] text-white placeholder-gray-500 transition-colors"
                  />
                  <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Confirm</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-8 pr-3 py-2 text-xs bg-[#040A1C] border border-[#18285A] rounded-xl focus:outline-none focus:border-[#FFF1B8] focus:ring-1 focus:ring-[#FFF1B8] text-white placeholder-gray-500 transition-colors"
                  />
                  <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            {/* Password strength meter */}
            {password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        pwdScore >= step
                          ? step <= 2
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                          : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#18285A] text-[#E8B84B] focus:ring-[#E8B84B]"
                />
                <span className="text-[11px] text-gray-400 leading-snug">
                  I agree to the <span className="text-[#FFF1B8] hover:underline">Terms of Service</span> and <span className="text-[#FFF1B8] hover:underline">Privacy Policy</span>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold-sweep w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-[#E8B84B] via-[#FFF1B8] to-[#E8B84B] hover:brightness-110 text-[#071230] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Provisioning Workspace...</span>
              ) : (
                <>
                  <span>Create Workspace</span>
                  <ArrowRight className="w-4 h-4 text-[#071230]" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-5 pt-4 border-t border-[#18285A] text-center">
            <p className="text-xs text-gray-400">
              Already have an enterprise account?{' '}
              <button
                onClick={() => setActivePage('login')}
                className="text-[#FFF1B8] font-semibold hover:underline ml-1"
              >
                Sign In
              </button>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
