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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-ivory">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
        
        <button
          onClick={() => setActivePage('login')}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-ink mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to sign in</span>
        </button>

        {step === 1 && (
          <div>
            <div className="w-10 h-10 rounded-full bg-champagne/30 border border-gold/40 flex items-center justify-center mb-4">
              <Key className="w-5 h-5 text-gold" />
            </div>

            <h2 className="font-serif text-2xl font-bold text-ink">Reset password</h2>
            <p className="text-xs text-gray-500 mt-1">
              Enter your email address and we will issue a secure password reset token.
            </p>

            {errorMessage && (
              <div className="mt-4 p-3 bg-coral/10 border border-coral/30 rounded-xl flex items-start gap-2 text-xs text-coral">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleRequestToken} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Corporate Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organisation.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-ink"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-midnight hover:bg-navy text-gold hover:text-white font-medium text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Generating token...' : 'Request Reset Token'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="w-10 h-10 rounded-full bg-champagne/30 border border-gold/40 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5 text-gold" />
            </div>

            <h2 className="font-serif text-2xl font-bold text-ink">Set new password</h2>
            <p className="text-xs text-gray-500 mt-1">
              Enter the reset token and choose a new secure password.
            </p>

            {issuedTokenNotice && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                <p className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Reset Token Generated:
                </p>
                <p className="font-mono text-[10px] mt-1 break-all bg-white p-1.5 rounded border border-emerald-100">
                  {issuedTokenNotice}
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="mt-4 p-3 bg-coral/10 border border-coral/30 rounded-xl flex items-start gap-2 text-xs text-coral">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Reset Token</label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste reset token here"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">New Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-ink"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-midnight hover:bg-navy text-gold hover:text-white font-medium text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Updating password...' : 'Update Password'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>

            <h2 className="font-serif text-2xl font-bold text-ink">Password updated</h2>
            <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto">
              Your password has been reset successfully. You can now sign in with your new credentials.
            </p>

            <button
              onClick={() => setActivePage('login')}
              className="mt-6 w-full py-2.5 px-4 bg-midnight hover:bg-navy text-gold hover:text-white font-medium text-xs rounded-lg transition-all shadow-md"
            >
              Sign In Now
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

