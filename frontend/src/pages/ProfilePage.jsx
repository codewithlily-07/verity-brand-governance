import React, { useState, useEffect } from 'react';
import { User, Mail, Building, Shield, Key, CheckCircle2, LogOut, AlertCircle, ArrowLeft } from 'lucide-react';
import { getMe, updateProfile } from '../lib/api';

export function ProfilePage({ setActivePage, currentUser, onLogout, onProfileUpdated }) {
  const [profile, setProfile] = useState(currentUser || null);
  const [name, setName] = useState(currentUser?.name || '');
  const [role, setRole] = useState(currentUser?.role || 'creator');
  const [isLoading, setIsLoading] = useState(!currentUser);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMe();
        if (data) {
          setProfile(data);
          setName(data.name || '');
          setRole(data.role || 'creator');
        }
      } catch (e) {
        console.error('Failed to load profile:', e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      const updated = await updateProfile({ name, role });
      setProfile(prev => ({ ...prev, ...updated }));
      if (onProfileUpdated) onProfileUpdated(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      <button
        onClick={() => setActivePage('dashboard')}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-ink mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        
        {/* Banner */}
        <div className="bg-midnight p-6 sm:p-8 text-ivory flex items-center justify-between border-b border-navy-2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-navy-2 border-2 border-gold flex items-center justify-center text-gold font-serif text-2xl font-bold shadow-glow">
              {profile?.name ? profile.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-white">{profile?.name || 'Enterprise User'}</h1>
              <p className="text-xs text-gold-light mt-0.5">{profile?.organisation_name || 'Personal Organisation'}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-full bg-navy text-[10px] font-semibold text-gray-300 uppercase tracking-wider border border-gray-700">
                  {profile?.role || 'Creator'}
                </span>
                <span className="text-[11px] text-gray-400">
                  ID: <span className="font-mono text-[10px]">{profile?.id ? profile.id.slice(0, 8) : 'demo'}...</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-2/60 border border-gray-700 hover:border-coral hover:text-coral text-gray-300 text-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          
          {saveSuccess && (
            <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-3.5 bg-coral/10 border border-coral/30 rounded-xl flex items-center gap-2 text-xs text-coral">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5 max-w-lg">
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Display Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-ink"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={profile?.email || 'demo@cognexa.local'}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Managed by corporate administrator.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Assigned Governance Role</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-ink cursor-pointer"
                >
                  <option value="creator">Creator (Submits drafts, resolves diff findings)</option>
                  <option value="reviewer">Reviewer (Audits findings, requests changes, approves)</option>
                  <option value="admin">Admin (Configures rules, facts, terminology)</option>
                  <option value="owner">Owner (Full tenant administration)</option>
                </select>
                <Shield className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="py-2 px-5 bg-midnight hover:bg-navy text-gold hover:text-white font-medium text-xs rounded-lg transition-all shadow disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>

          </form>

        </div>

      </div>

      {/* Security & Multi-Tenancy Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="font-serif text-base font-bold text-ink mb-1 flex items-center gap-2">
          <Key className="w-4 h-4 text-gold" />
          <span>Security & Data Isolation</span>
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          VERITY enforces strict organization-level data boundaries.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-mist/60 rounded-xl border border-gray-100">
            <span className="font-semibold text-gray-700 block">Session Authentication</span>
            <span className="text-[11px] text-gray-500 mt-0.5 block">JWT Token with SHA-256 HMAC verification</span>
          </div>

          <div className="p-3 bg-mist/60 rounded-xl border border-gray-100">
            <span className="font-semibold text-gray-700 block">Multi-Tenant Scoping</span>
            <span className="text-[11px] text-gray-500 mt-0.5 block">Queries filtered by workspace and organisation UUID</span>
          </div>
        </div>
      </div>

    </div>
  );
}

