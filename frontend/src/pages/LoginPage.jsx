import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Lock, Mail, AlertCircle, CheckCircle2, Sparkles, Shield } from 'lucide-react';
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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-[#040A1C] text-white select-none">
      
      {/* Left Column (60% on desktop): Simplified Hero Aesthetic */}
      <div className="lg:w-[58%] bg-[#071230] p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#18285A]">
        {/* Soft Radial Gold Aura */}
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
                  <linearGradient id="loginV1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8A5A12"/>
                    <stop offset="35%" stopColor="#E8B84B"/>
                    <stop offset="60%" stopColor="#FFF1B8"/>
                    <stop offset="100%" stopColor="#B9822A"/>
                  </linearGradient>
                  <linearGradient id="loginV2" x1="0%" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#9A6A1A"/>
                    <stop offset="50%" stopColor="#F3CC6B"/>
                    <stop offset="100%" stopColor="#FFF6D0"/>
                  </linearGradient>
                </defs>
                <path d="M10 46 C38 26 82 38 112 96 L126 160 C88 134 40 96 10 46 Z" fill="url(#loginV1)"/>
                <path d="M30 52 C56 46 84 62 104 100 C78 82 52 66 30 52 Z" fill="#FFF1B8" opacity=".6"/>
                <path d="M120 164 C122 104 160 40 248 6 C196 44 170 98 150 158 C140 162 130 164 120 164 Z" fill="url(#loginV2)"/>
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

          {/* Heading */}
          <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-wide leading-tight max-w-lg">
            Consistent. Compliant. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1B8] via-[#E8B84B] to-[#FFF1B8]">
              Trustworthy.
            </span>
          </h1>
          <p className="text-gray-300 text-sm mt-4 leading-relaxed max-w-lg font-sans">
            Enterprise pre-publication brand governance. Detect guideline drift, verify approved facts against vector knowledge vaults, and protect organizational trust.
          </p>

          {/* 3 Value Pillars */}
          <div className="mt-10 space-y-3.5 max-w-md">
            <div className="flex items-start gap-3.5 bg-[#0D1D4A]/60 p-3.5 rounded-xl border border-[#E8B84B]/20 backdrop-blur-md">
              <div className="w-5 h-5 rounded-full bg-[#E8B84B]/20 border border-[#E8B84B] flex items-center justify-center text-[#FFF1B8] shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Evidence-Backed Verification</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Every finding explicitly cites your approved guidelines or flags absence of proof.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 bg-[#0D1D4A]/60 p-3.5 rounded-xl border border-[#E8B84B]/20 backdrop-blur-md">
              <div className="w-5 h-5 rounded-full bg-[#E8B84B]/20 border border-[#E8B84B] flex items-center justify-center text-[#FFF1B8] shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Intent-Preserving Diff</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Non-destructive side-by-side corrections reusing canonical corporate terminology.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 bg-[#0D1D4A]/60 p-3.5 rounded-xl border border-[#E8B84B]/20 backdrop-blur-md">
              <div className="w-5 h-5 rounded-full bg-[#E8B84B]/20 border border-[#E8B84B] flex items-center justify-center text-[#FFF1B8] shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Cryptographic Human Approvals</p>
                <p className="text-[11px] text-gray-400 mt-0.5">SHA-256 bound sign-offs ensuring unapproved drafts never enter public release.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-8 text-xs text-gray-400 border-t border-[#18285A] flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <Shield className="w-3.5 h-3.5 text-[#E8B84B]" />
            SOC 2 Type II · WCAG 2.1 AA Compliant
          </span>
          <span className="font-mono text-[11px] text-[#E8B84B]">Team COGNEXA</span>
        </div>
      </div>

      {/* Right Column (42% on desktop): Dark Glass Form Card */}
      <div className="lg:w-[42%] p-8 sm:p-12 lg:p-16 flex items-center justify-center relative">
        <div className="w-full max-w-md bg-[#071230]/90 border border-[#E8B84B]/40 rounded-2xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          
          <div className="mb-7">
            <h2 className="font-cinzel text-2xl font-bold text-white tracking-wide">
              Welcome Back
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-sans">
              Enter your credentials to access your brand governance workspace.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Corporate Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organisation.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#040A1C] border border-[#18285A] rounded-xl focus:outline-none focus:border-[#FFF1B8] focus:ring-1 focus:ring-[#FFF1B8] text-white placeholder-gray-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setActivePage('forgot-password')}
                  className="text-[11px] text-[#FFF1B8] hover:underline"
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
                  className="w-full pl-9 pr-9 py-2.5 text-xs bg-[#040A1C] border border-[#18285A] rounded-xl focus:outline-none focus:border-[#FFF1B8] focus:ring-1 focus:ring-[#FFF1B8] text-white placeholder-gray-500 transition-colors"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold-sweep w-full mt-3 py-2.5 px-4 bg-gradient-to-r from-[#E8B84B] via-[#FFF1B8] to-[#E8B84B] hover:brightness-110 text-[#071230] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-[#071230]" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-[#18285A]" />
            <span className="absolute px-3 bg-[#071230] text-[11px] font-mono text-gray-400 uppercase">
              or
            </span>
          </div>

          {/* Instant Demo Option */}
          <button
            type="button"
            onClick={() => setActivePage('dashboard')}
            className="w-full py-2.5 px-4 bg-transparent hover:bg-[#E8B84B]/10 text-[#FFF1B8] border border-[#E8B84B]/50 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Continue with Demo Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Register Link */}
          <div className="mt-6 pt-5 border-t border-[#18285A] text-center">
            <p className="text-xs text-gray-400">
              Don't have an enterprise account?{' '}
              <button
                onClick={() => setActivePage('register')}
                className="text-[#FFF1B8] font-semibold hover:underline ml-1"
              >
                Register organisation
              </button>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
