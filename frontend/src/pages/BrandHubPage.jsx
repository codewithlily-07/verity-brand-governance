import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Upload, Trash2, CheckCircle2, Shield, Eye,
  Sparkles, FileText, Palette, FileCheck, AlertCircle
} from 'lucide-react';
import { getBrandProfile, addBrandFact, uploadBrandSource } from '../lib/api';

export function BrandHubPage() {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('facts'); // facts | rules | terminology | guidelines | visual
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);

  // New Fact Modal State
  const [showFactModal, setShowFactModal] = useState(false);
  const [newFact, setNewFact] = useState({ code: 'F-04', name: '', statement: '', source: '', category: 'Product Facts' });

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await getBrandProfile();
      setProfile(data);
    } catch (err) {
      console.error('Failed to load brand profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleCreateFact = async (e) => {
    e.preventDefault();
    if (!newFact.statement || !newFact.source) return;
    try {
      await addBrandFact(newFact);
      setShowFactModal(false);
      setNewFact({ code: `F-0${(profile?.facts?.length || 3) + 2}`, name: '', statement: '', source: '', category: 'Product Facts' });
      loadProfile();
    } catch (err) {
      alert('Error adding fact: ' + err.message);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg(null);
    try {
      const res = await uploadBrandSource(file);
      setUploadMsg(`Successfully indexed "${res.filename}" into ${res.passages_created} guideline passages!`);
      loadProfile();
    } catch (err) {
      setUploadMsg(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-gray-500">
        Loading Brand Knowledge Hub...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">Institutional Knowledge Base</span>
          <h1 className="font-serif text-3xl font-bold text-ink mt-1">Brand Knowledge Hub</h1>
          <p className="text-xs text-gray-600 mt-1">
            Rules, approved factual claims, and guidelines used by the 3-layer engine to verify content.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-4 py-2 rounded-xl bg-navy hover:bg-navy-2 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm">
            <Upload className="w-3.5 h-3.5 text-gold" />
            <span>{uploading ? 'Processing PDF/DOCX...' : 'Upload Guideline Doc'}</span>
            <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {uploadMsg && (
        <div className="mb-6 p-4 rounded-xl bg-champagne/60 border border-gold/40 text-xs text-ink flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal" />
          <span>{uploadMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
        {[
          { id: 'facts', label: 'Approved Facts', count: profile.facts?.length },
          { id: 'rules', label: 'Deterministic Rules', count: profile.rules?.length },
          { id: 'terminology', label: 'Terminology Glossary', count: profile.terms?.length },
          { id: 'identity', label: 'Identity & Voice' },
          { id: 'visual', label: 'Visual Palette' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-midnight text-ivory shadow'
                : 'text-gray-600 hover:text-ink hover:bg-mist'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === tab.id ? 'bg-gold text-midnight font-bold' : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: APPROVED FACTS */}
      {activeTab === 'facts' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-600">
              Only claims backed by these approved facts can pass Layer 2 review. Missing facts report: <strong>"No approved supporting evidence found."</strong>
            </p>
            <button
              onClick={() => setShowFactModal(true)}
              className="px-3 py-1.5 rounded-lg bg-gold hover:bg-gold-light text-midnight text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Approved Fact</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.facts?.map((f) => (
              <div key={f.id || f.code} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-gold px-2 py-0.5 rounded bg-champagne">
                      {f.code}
                    </span>
                    <span className="text-[11px] text-teal font-medium uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <h4 className="font-bold text-ink text-sm mb-2">{f.name}</h4>
                  <p className="text-xs text-ink/90 leading-relaxed p-3 bg-mist/60 rounded-xl border border-gray-100 italic">
                    "{f.statement}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                  <span className="font-medium text-gray-700">Source:</span> {f.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: RULES */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-600 mb-2">
            Layer 1 deterministic rules active across all submissions. Normalised before matching and inflections handled.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.rules?.map((r) => (
              <div key={r.id || r.code} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-midnight px-2 py-0.5 rounded bg-gray-100">
                        {r.code}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize bg-mist text-gray-700">
                        {r.category}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${
                      r.severity === 'high' ? 'text-coral' : r.severity === 'medium' ? 'text-amber-700' : 'text-sky-800'
                    }`}>
                      {r.severity}
                    </span>
                  </div>
                  <h4 className="font-bold text-ink text-sm mb-1">{r.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">{r.description}</p>
                  
                  {r.source_excerpt && (
                    <div className="p-2.5 bg-mist rounded-lg border border-gray-200 text-[11px] text-gray-600">
                      <strong>Policy source:</strong> {r.source_excerpt}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Citation: {r.source_ref}</span>
                  <span className="text-gray-400">Flagged {r.times_flagged} times</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: TERMINOLOGY */}
      {activeTab === 'terminology' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-ink text-sm">Glossary & Nomenclature</h3>
            <p className="text-xs text-gray-500 mt-0.5">Automated replacement maps and brand tone restrictions.</p>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-mist text-gray-600 uppercase tracking-wider font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Avoid Term</th>
                <th className="px-6 py-3">Preferred Term</th>
                <th className="px-6 py-3">Rationale & Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {profile.terms?.map((t, idx) => (
                <tr key={idx} className="hover:bg-mist/30">
                  <td className="px-6 py-3 font-mono font-medium text-coral line-through">
                    "{t.avoid}"
                  </td>
                  <td className="px-6 py-3 font-mono font-bold text-teal">
                    "{t.prefer}"
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {t.note || 'Standard brand vocabulary standard.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: IDENTITY */}
      {activeTab === 'identity' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm max-w-2xl">
          <h3 className="font-serif text-lg font-bold text-ink mb-4">Brand Profile Identity</h3>
          
          <div className="space-y-4 text-xs">
            <div>
              <span className="font-semibold text-gray-500 block mb-1">Company / Product Name:</span>
              <p className="text-sm font-bold text-ink font-mono">{profile.name}</p>
            </div>

            <div>
              <span className="font-semibold text-gray-500 block mb-1">Brand Tagline:</span>
              <p className="text-sm text-ink">{profile.tagline}</p>
            </div>

            <div>
              <span className="font-semibold text-gray-500 block mb-1">Audience:</span>
              <p className="text-sm text-ink capitalize">{profile.audience}</p>
            </div>

            <div>
              <span className="font-semibold text-gray-500 block mb-1">Voice Attributes:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {(profile.voice_attributes || []).map((attr, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-champagne text-ink font-medium text-xs">
                    {attr}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: VISUAL PALETTE */}
      {activeTab === 'visual' && (
        <div>
          <p className="text-xs text-gray-600 mb-4">
            Approved color tokens checked by CIE ΔE distance and WCAG AA contrast ratios (4.5:1).
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(profile.palette_json || []).map((p, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col items-center text-center">
                <div 
                  className="w-16 h-16 rounded-xl shadow-inner border border-gray-300 mb-3"
                  style={{ backgroundColor: p.hex }}
                />
                <span className="font-bold text-ink text-xs">{p.name}</span>
                <span className="font-mono text-gray-500 text-xs mt-0.5">{p.hex}</span>
                <span className="text-[10px] text-gray-400 capitalize mt-1">Role: {p.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Fact Modal */}
      {showFactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
            <h3 className="font-serif text-lg font-bold text-ink mb-1">Add Approved Fact</h3>
            <p className="text-xs text-gray-500 mb-4">New facts are immediately loaded by Layer 2 retrieval for claim verification.</p>

            <form onSubmit={handleCreateFact} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Fact Code</label>
                <input
                  type="text"
                  value={newFact.code}
                  onChange={(e) => setNewFact({ ...newFact, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Fact Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Accreditation Status"
                  value={newFact.name}
                  onChange={(e) => setNewFact({ ...newFact, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Approved Statement (Exact Wording)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. All certificates are recognized by standard industry partners."
                  value={newFact.statement}
                  onChange={(e) => setNewFact({ ...newFact, statement: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Verified Source Documentation</label>
                <input
                  type="text"
                  placeholder="e.g. Academic Council Minutes §4"
                  value={newFact.source}
                  onChange={(e) => setNewFact({ ...newFact, source: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowFactModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gold hover:bg-gold-light text-midnight font-bold shadow-sm"
                >
                  Save Approved Fact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

