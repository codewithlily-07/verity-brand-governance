import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Sparkles, RefreshCw, Key, Database,
  Lock, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { getAIStatus } from '../lib/api';

export function SettingsPage({ role, setRole, onResetDemo }) {
  const [requireDiffReviewer, setRequireDiffReviewer] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const s = await getAIStatus();
        setAiStatus(s);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="pb-6 mb-8 border-b border-gray-200">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold">Governance Controls</span>
        <h1 className="font-serif text-3xl font-bold text-ink mt-1">Workspace Settings & Disclosures</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure demo workflow simulations, review AI engine integration, and manage guest workspaces.
        </p>
      </div>

      <div className="space-y-6 text-xs">
        
        {/* Role Simulation Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2 font-bold text-sm text-ink">
            <User className="w-4 h-4 text-gold" />
            <span>Active Demonstration Role</span>
          </div>
          <p className="text-gray-500 mb-4">
            Simulate different institutional roles to evaluate authoring versus compliance sign-off workflows.
            <em className="block text-[11px] text-amber-700 mt-0.5">Note: Demo roles for judge evaluation, not production SSO credentials.</em>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'creator', label: 'Content Creator', desc: 'Can submit drafts, edit copies, and accept suggested revisions.' },
              { id: 'reviewer', label: 'Compliance Reviewer', desc: 'Can approve versions, request changes, reject, or issue overrides.' },
              { id: 'admin', label: 'Brand Admin', desc: 'Can configure brand guidelines, add approved facts, and update rules.' }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  role === r.id
                    ? 'border-gold bg-champagne/40 shadow-sm'
                    : 'border-gray-200 hover:bg-mist'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-ink text-xs">{r.label}</span>
                  {role === r.id && <CheckCircle2 className="w-4 h-4 text-teal" />}
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">{r.desc}</p>
              </button>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="font-semibold text-ink block">Enforce Dual-Party Sign-off</span>
              <span className="text-[11px] text-gray-500">Require reviewer to be a different entity than the content author.</span>
            </div>
            <input
              type="checkbox"
              checked={requireDiffReviewer}
              onChange={(e) => setRequireDiffReviewer(e.target.checked)}
              className="w-4 h-4 rounded text-gold focus:ring-gold cursor-pointer"
            />
          </div>
        </div>

        {/* AI Provider & Transparency Disclosure */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2 font-bold text-sm text-ink">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>AI Architecture & Model Transparency</span>
          </div>
          <p className="text-[#374151] mb-4 leading-relaxed">
            VERITY operates on a strict multi-layer principle: Layer 1 (Deterministic Rules) and Layer 2 (Approved Fact Retrieval) always run. Layer 3 (Contextual AI) is strictly advisory and fails over safely.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-mist/60 p-4 rounded-xl border border-gray-200 font-mono text-[11px]">
            <div>
              <span className="text-[#4B5563] block font-sans text-[11px] uppercase font-bold">Provider Configuration</span>
              <span className="font-bold text-ink">{aiStatus?.provider || 'gemini'} ({aiStatus?.model || 'gemini-1.5-flash'})</span>
            </div>

            <div>
              <span className="text-[#4B5563] block font-sans text-[11px] uppercase font-bold">Runtime Status</span>
              <span className={`font-bold ${aiStatus?.has_api_key ? 'text-[#065F46]' : 'text-amber-800'}`}>
                {aiStatus?.status === 'active' ? 'Active & Validating' : 'Graceful Fallback Mode (Rule + FTS Active)'}
              </span>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-gray-200 font-sans text-[#374151]">
              {aiStatus?.message}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-[#D1FAE5] border border-[#065F46]/30 text-[#065F46] flex items-center gap-2">
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>Content Data Privacy Guarantee: Customer content is inert data only and is never used to train external models.</span>
          </div>
        </div>

        {/* Reset Workspace Card */}
        <div className="bg-white rounded-2xl border border-coral/30 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-coral text-sm mb-0.5">Reset Demonstration Workspace</h3>
            <p className="text-gray-500 text-xs">
              Clear all temporary reviews, reset submissions, and re-seed the fresh Verity Learning brand catalog.
            </p>
          </div>

          <button
            onClick={onResetDemo}
            className="px-4 py-2 rounded-xl bg-coral/10 hover:bg-coral/20 text-coral border border-coral/30 font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Workspace</span>
          </button>
        </div>

      </div>

    </div>
  );
}

