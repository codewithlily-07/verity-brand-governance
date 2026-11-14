import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, ArrowLeft, Lock, Mail, AlertCircle, Shield } from 'lucide-react';
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-[#060B1F] text-[#F5F1E6] select-none">
      
      {/* Centered Dark Glass Card */}
      <div className="w-full max-w-md bg-[#0A1230]/95 border border-[#D4AF37]/45 rounded-2xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl relative">
        
        {/* Top Back Link */}
        <button
          onClick={() => setActivePage('landing')}
          className="flex items-center gap-1.5 text-xs text-[#9AA6C7] hover:text-[#F3D98B] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        {/* Brand Crest */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-10 flex items-center justify-center mb-2">
            <svg viewBox="0 0 260 190" className="w-full h-full drop-shadow-[0_0_12px_rgba(212,175,55,0.7)]" fill="none">
              <defs>
                <linearGradient id="loginCenterV1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8A5A12"/>
                  <stop offset="35%" stopColor="#D4AF37"/>
                  <stop offset="60%" stopColor="#F3D98B"/>
                  <stop offset="100%" stopColor="#B9822A"/>
                </linearGradient>
                <linearGradient id="loginCenterV2" x1="0%" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#9A6A1A"/>
                  <stop offset="50%" stopColor="#F3CC6B"/>
                  <stop offset="100%" stopColor="#FFF6D0"/>
                </linearGradient>
              </defs>
              <path d="M10 46 C38 26 82 38 112 96 L126 160 C88 134 40 96 10 46 Z" fill="url(#loginCenterV1)"/>
              <path d="M30 52 C56 46 84 62 104 100 C78 82 52 66 30 52 Z" fill="#F3D98B" opacity=".6"/>
              <path d="M120 164 C122 104 160 40 248 6 C196 44 170 98 150 158 C140 162 130 164 120 164 Z" fill="url(#loginCenterV2)"/>
              <path d="M138 140 C150 96 178 52 228 20 C190 58 168 100 152 146 Z" fill="#FFFFFF" opacity=".35"/>
            </svg>
          </div>
          <span className="font-cinzel text-xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#F3D98B] via-[#D4AF37] to-[#F3D98B] leading-none">
            VERITY
          </span>
          <span className="text-[8px] font-mono tracking-[0.45em] text-[#D4AF37]/80 uppercase mt-1">
            BRAND GOVERNANCE
          </span>

          <h2 className="font-cinzel text-2xl font-bold text-white tracking-wide mt-5">
            Sign In to Workspace
          </h2>
          <p className="text-xs text-[#9AA6C7] mt-1 font-sans">
            Enter your credentials to access your brand governance portal.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red/10 border border-red/30 rounded-xl flex items-start gap-2.5 text-xs text-red">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#F5F1E6] mb-1.5">
              Corporate Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organisation.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#060B1F] border border-[#18285A] rounded-xl focus:outline-none focus:border-[#F3D98B] focus:ring-1 focus:ring-[#F3D98B] text-white placeholder-gray-500 transition-colors"
              />
              <Mail className="w-4 h-4 text-[#9AA6C7] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#F5F1E6]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setActivePage('forgot-password')}
                className="text-[11px] text-[#F3D98B] hover:underline"
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
                className="w-full pl-9 pr-9 py-2.5 text-xs bg-[#060B1F] border border-[#18285A] rounded-xl focus:outline-none focus:border-[#F3D98B] focus:ring-1 focus:ring-[#F3D98B] text-white placeholder-gray-500 transition-colors"
              />
              <Lock className="w-4 h-4 text-[#9AA6C7] absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#9AA6C7] hover:text-white focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-gold-sweep w-full mt-3 py-2.5 px-4 bg-gradient-to-r from-[#D4AF37] via-[#F3D98B] to-[#D4AF37] hover:brightness-110 text-[#060B1F] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 text-[#060B1F]" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-[#18285A]" />
          <span className="absolute px-3 bg-[#0A1230] text-[11px] font-mono text-[#9AA6C7] uppercase">
            or
          </span>
        </div>

        {/* Instant Demo Option */}
        <button
          type="button"
          onClick={() => setActivePage('dashboard')}
          className="w-full py-2.5 px-4 bg-transparent hover:bg-[#D4AF37]/10 text-[#F3D98B] border border-[#D4AF37]/60 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span>Continue with Demo Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Register Link */}
        <div className="mt-6 pt-5 border-t border-[#18285A] text-center">
          <p className="text-xs text-[#9AA6C7]">
            Don't have an enterprise account?{' '}
            <button
              onClick={() => setActivePage('register')}
              className="text-[#F3D98B] font-semibold hover:underline ml-1"
            >
              Register organisation
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
