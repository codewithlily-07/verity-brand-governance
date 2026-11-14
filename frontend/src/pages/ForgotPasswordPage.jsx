import React, { useState } from 'react';
import { Mail, Lock, Key, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { forgotPassword, resetPassword } from '../lib/api';

export function ForgotPasswordPage({ setActivePage }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = request token, 2 = enter token & new password, 3 = success
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [issuedTokenNotice, setIssuedTokenNotice] = useState(null);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await forgotPassword(email);
      if (res.reset_token) {
        setIssuedTokenNotice(res.reset_token);
        setToken(res.reset_token);
      }
      setStep(2);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to issue reset token.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token, newPassword);
      setStep(3);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid or expired reset token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-[#040A1C] text-white">
      <div className="w-full max-w-md bg-[#071230]/90 border border-[#E8B84B]/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl p-8">
        
        <button
          onClick={() => setActivePage('login')}
          className="flex items-center gap-1.5 text-xs text-[#FFF1B8]/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to sign in</span>
        </button>

        {step === 1 && (
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#0D1D4A] border border-[#E8B84B] flex items-center justify-center mb-4 text-[#FFF1B8] shadow-glow">
              <Key className="w-5 h-5" />
            </div>

            <h2 className="font-cinzel text-2xl font-bold text-white tracking-wide">Reset Password</h2>
            <p className="text-xs text-gray-400 mt-1 font-sans">
              Enter your corporate email address and we will issue a secure reset token.
            </p>

            {errorMessage && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleRequestToken} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Corporate Email</label>
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

              <button
                type="submit"
                disabled={isLoading}
                className="btn-gold-sweep w-full py-2.5 px-4 bg-gradient-to-r from-[#E8B84B] via-[#FFF1B8] to-[#E8B84B] hover:brightness-110 text-[#071230] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Generating token...' : 'Request Reset Token'}
                <ArrowRight className="w-3.5 h-3.5 text-[#071230]" />
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#0D1D4A] border border-[#E8B84B] flex items-center justify-center mb-4 text-[#FFF1B8] shadow-glow">
              <Lock className="w-5 h-5" />
            </div>

            <h2 className="font-cinzel text-2xl font-bold text-white tracking-wide">Set New Password</h2>
            <p className="text-xs text-gray-400 mt-1 font-sans">
              Enter the reset token and choose a new secure password.
            </p>

            {issuedTokenNotice && (
              <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                <p className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Reset Token Generated:
                </p>
                <p className="font-mono text-[10px] mt-1 break-all bg-[#040A1C] p-2 rounded border border-emerald-500/20 text-[#FFF1B8]">
                  {issuedTokenNotice}
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Reset Token</label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste reset token here"
                  className="w-full px-3 py-2 text-xs font-mono bg-[#040A1C] border border-[#18285A] rounded-xl focus:outline-none focus:border-[#FFF1B8] text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">New Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-xs bg-[#040A1C] border border-[#18285A] rounded-xl focus:outline-none focus:border-[#FFF1B8] text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-gold-sweep w-full py-2.5 px-4 bg-gradient-to-r from-[#E8B84B] via-[#FFF1B8] to-[#E8B84B] hover:brightness-110 text-[#071230] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Updating password...' : 'Update Password'}
                <ArrowRight className="w-3.5 h-3.5 text-[#071230]" />
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>

            <h2 className="font-cinzel text-2xl font-bold text-white tracking-wide">Password Updated</h2>
            <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto font-sans">
              Your password has been reset successfully. You can now sign in with your new credentials.
            </p>

            <button
              onClick={() => setActivePage('login')}
              className="btn-gold-sweep mt-6 w-full py-2.5 px-4 bg-gradient-to-r from-[#E8B84B] via-[#FFF1B8] to-[#E8B84B] hover:brightness-110 text-[#071230] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-glow"
            >
              Sign In Now
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
