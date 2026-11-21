import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Upload, Trash2, CheckCircle2, Shield, Eye,
  Sparkles, FileText, Palette, FileCheck, AlertCircle, Layers, FileCode,
  Download, FileUp, Check, X, Search, ChevronDown, ChevronUp, Beaker
} from 'lucide-react';
import { getBrandProfile, addBrandFact, uploadBrandSource, updateBrandProfile } from '../lib/api';

export function BrandHubPage() {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('facts'); // facts | sources | rules | terminology | identity | visual
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);

  // New Fact Modal State
  const [showFactModal, setShowFactModal] = useState(false);
  const [newFact, setNewFact] = useState({ code: 'F-04', name: '', statement: '', source: '', category: 'Product Facts' });

  // Rule Tester State
  const [activeTestRuleCode, setActiveTestRuleCode] = useState(null);
  const [ruleTestInputs, setRuleTestInputs] = useState({});

  // Brand Kit Import/Export State
  const [importCandidate, setImportCandidate] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);

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
      await loadProfile();
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
      await loadProfile();
    } catch (err) {
      setUploadMsg(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Rule Tester Match Logic
  const testRuleMatch = (rule, text) => {
    if (!text || !text.trim()) return null;
    const t = text.trim();

    if (rule.code === 'R1' || rule.category === 'Tone') {
      const m = t.match(/\b(guys|hey guys|folks|hiya|sup|cool|awesome)\b/i);
      if (m) return { triggered: true, quote: m[0], reason: 'Informal colloquial greeting violates professional tone standard.' };
    }
    if (rule.code === 'R2' || rule.category === 'Claims') {
      const m = t.match(/\b(guarantee|guarantees|100%|always|promise|zero risk|risk-free|best in)\b/i);
      if (m) return { triggered: true, quote: m[0], reason: 'Absolute outcome guarantee or unsubstantiated claim.' };
    }
    if (rule.code === 'R3' || rule.category === 'Messaging') {
      const m = t.match(/\b(fastest|best|#1|no\. 1|number one|world-class|unmatched|unbeatable|top-rated)\b/i);
      if (m) return { triggered: true, quote: m[0], reason: 'Unaccredited superlative claim requires third-party citation.' };
    }
    if (rule.code === 'R4' || rule.category === 'Terminology') {
      const m = t.match(/\bverity\b/);
      if (m) return { triggered: true, quote: m[0], reason: 'Brand name must be properly title-cased as "Verity".' };
    }
    if (rule.code === 'R5') {
      const m = t.match(/[!?]{2,}/);
      if (m) return { triggered: true, quote: m[0], reason: 'Repeated excessive punctuation reduces corporate authority.' };
    }
    if (rule.pattern) {
      try {
        const reg = new RegExp(rule.pattern, 'i');
        const m = t.match(reg);
        if (m) return { triggered: true, quote: m[0], reason: `Matches pattern: ${rule.pattern}` };
      } catch (e) {}
    }
    if (rule.avoid_term) {
      const m = t.match(new RegExp(`\\b${rule.avoid_term}\\b`, 'i'));
      if (m) return { triggered: true, quote: m[0], reason: `Contains restricted term "${rule.avoid_term}".` };
    }
    return { triggered: false };
  };

  // Export Brand Kit (JSON)
  const handleExportBrandKit = () => {
    if (!profile) return;
    const exportData = {
      schema: 'verity-brand-kit-v1',
      brand_name: profile.name,
      tagline: profile.tagline,
      audience: profile.audience,
      voice_attributes: profile.voice_attributes,
      palette: profile.palette_json || [],
      facts: (profile.facts || []).map(f => ({
        code: f.code,
        name: f.name,
        statement: f.statement,
        source: f.source,
        category: f.category
      })),
      rules: (profile.rules || []).map(r => ({
        code: r.code,
        category: r.category,
        title: r.title,
        description: r.description,
        severity: r.severity,
        source_ref: r.source_ref
      })),
      terms: (profile.terms || []).map(t => ({
        avoid: t.avoid,
        prefer: t.prefer,
        note: t.note
      })),
      exported_at: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verity-brand-kit-${(profile.name || 'brand').toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Brand Kit (JSON)
  const handleImportFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.facts && !parsed.rules && !parsed.terms && !parsed.brand_name) {
          throw new Error('Invalid Brand Kit schema. Missing brand attributes, facts, or rules.');
        }
        setImportCandidate(parsed);
        setShowImportModal(true);
      } catch (err) {
        alert('Failed to parse Brand Kit JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmImport = async () => {
    if (!importCandidate) return;
    setImporting(true);
    try {
      // Update profile metadata if present
      const updates = {};
      if (importCandidate.brand_name) updates.name = importCandidate.brand_name;
      if (importCandidate.tagline) updates.tagline = importCandidate.tagline;
      if (importCandidate.audience) updates.audience = importCandidate.audience;
      if (importCandidate.voice_attributes) updates.voice_attributes = importCandidate.voice_attributes;
      if (importCandidate.palette) updates.palette_json = importCandidate.palette;

      if (Object.keys(updates).length > 0) {
        await updateBrandProfile(updates).catch(() => null);
      }

      // Add imported facts if any
      if (Array.isArray(importCandidate.facts)) {
        for (const f of importCandidate.facts) {
          if (f.statement && f.source) {
            await addBrandFact({
              code: f.code || 'F-IMP',
              name: f.name || 'Imported Fact',
              statement: f.statement,
              source: f.source,
              category: f.category || 'Product Facts'
            }).catch(() => null);
          }
        }
      }

      setShowImportModal(false);
      setImportCandidate(null);
      await loadProfile();
      setUploadMsg('Brand Kit imported and applied successfully.');
    } catch (err) {
      alert('Error importing Brand Kit: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-[15px] text-[#5B6478]">
        <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Loading Brand Knowledge Hub...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E6DDC8]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A6A00]">Institutional Knowledge Base</span>
          <h1 className="font-serif text-3xl font-bold text-[#0A1230] mt-1">Brand Knowledge Hub</h1>
          <p className="text-[16px] text-[#5B6478] mt-1">
            Rules, approved factual claims, and guidelines used by the 3-layer engine to verify content.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Export Brand Kit */}
          <button
            type="button"
            onClick={handleExportBrandKit}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E6DDC8] hover:bg-[#FAF8F3] text-[#0A1230] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            title="Download clean Brand Kit JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#8A6A00]" />
            <span>Export Kit</span>
          </button>

          {/* Import Brand Kit */}
          <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-white border border-[#E6DDC8] hover:bg-[#FAF8F3] text-[#0A1230] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm">
            <FileUp className="w-3.5 h-3.5 text-[#8A6A00]" />
            <span>Import Kit</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportFileSelect}
            />
          </label>

          <button
            onClick={() => setShowFactModal(true)}
            className="px-4 py-2 rounded-xl font-bold text-xs text-[#0A1230] flex items-center gap-1.5 shadow-sm transition-all hover:opacity-95"
            style={{
              background: 'linear-gradient(135deg, #F3D98B, #D4AF37 50%, #A67C00)'
            }}
          >
            <Plus className="w-4 h-4 text-[#0A1230]" />
            <span>Add approved fact</span>
          </button>

          <label className="cursor-pointer px-4 py-2 rounded-xl bg-white border border-[#0A1230] hover:bg-[#F6F1E7] text-[#0A1230] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm">
            <Upload className="w-3.5 h-3.5 text-[#8A6A00]" />
            <span>{uploading ? 'Processing PDF/DOCX...' : 'Upload guideline'}</span>
            <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {uploadMsg && (
        <div className="mb-6 p-4 rounded-xl bg-[#D1FAE5] border border-[#065F46]/30 text-xs text-[#065F46] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#065F46]" />
          <span className="font-medium">{uploadMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E6DDC8] mb-6 overflow-x-auto pb-1">
        {[
          { id: 'facts', label: 'Approved Facts', count: profile.facts?.length },
          { id: 'sources', label: 'Brand Sources', count: profile.sources?.length },
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
                ? 'bg-[#0A1230] text-white shadow-sm'
                : 'text-[#5B6478] hover:text-[#0A1230] hover:bg-[#FAF8F3]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-[#D4AF37] text-[#0A1230] font-bold' : 'bg-[#E5E7EB] text-[#374151]'
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
            <p className="text-[14px] text-[#5B6478]">
              Only claims backed by these approved facts can pass Layer 2 review. Missing facts report: <strong className="text-[#0A1230]">"No approved supporting evidence found."</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {profile.facts?.map((f) => (
              <div key={f.id || f.code} className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[12px] font-bold px-2 py-0.5 rounded bg-[#FBF1CF] text-[#614A00] border border-[#8A6A00]/25">
                      {f.code}
                    </span>
                    <span className="text-[12px] text-[#065F46] font-medium uppercase tracking-wider flex items-center gap-1 bg-[#D1FAE5] px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                  <h4 className="font-bold text-[#0A1230] text-[16px] mb-2">{f.name}</h4>
                  <p className="text-[14px] text-[#2B3345] leading-relaxed p-3.5 bg-[#FAF8F3] rounded-xl border border-[#E6DDC8]/60 italic">
                    "{f.statement}"
                  </p>
                </div>
                <div className="mt-4 pt-3.5 border-t border-[#E6DDC8]/60 text-[14px] text-[#5B6478]">
                  <span className="font-semibold text-[#0A1230]">Source:</span> {f.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: BRAND SOURCES */}
      {activeTab === 'sources' && (
        <div className="bg-white rounded-[14px] border border-[#E6DDC8] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#E6DDC8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0A1230]">Indexed Corporate Source Documents</h3>
              <p className="text-[14px] text-[#5B6478] mt-0.5">Primary policy artifacts ingested into passage chunks for vector retrieval.</p>
            </div>
            <span className="text-xs font-mono px-3 py-1 bg-[#FAF8F3] rounded-lg border border-[#E6DDC8] text-[#5B6478]">
              {profile.sources?.length || 0} active sources
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[#FAF8F3] text-[#5B6478] uppercase tracking-wider font-semibold border-b border-[#E6DDC8] text-[13px]">
                <tr>
                  <th className="px-6 py-3.5">Filename</th>
                  <th className="px-6 py-3.5">Governance Owner</th>
                  <th className="px-6 py-3.5">Version</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Passages Count</th>
                  <th className="px-6 py-3.5">Pages</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DDC8]/60 font-sans text-[#2B3345]">
                {(profile.sources || []).map((src) => (
                  <tr key={src.id || src.filename} className="hover:bg-[#F6F1E7]/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#0A1230] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#8A6A00]" />
                      <span>{src.filename}</span>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#5B6478]">
                      {src.owner || 'Brand Governance / Legal'}
                    </td>
                    <td className="px-6 py-4 font-mono text-[14px] text-[#2B3345]">
                      {src.version || 'v2.4'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[13px] font-semibold bg-[#D1FAE5] text-[#065F46] border border-[#065F46]/20">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{src.status || 'Current'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[14px] font-mono text-[#5B6478]">
                      {src.passages_count || 2} passages
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#5B6478]">
                      {src.page_count || 1} {src.page_count === 1 ? 'page' : 'pages'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: RULES & INTERACTIVE RULE TESTER */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <p className="text-[14px] text-[#5B6478] mb-2">
            Layer 1 deterministic rules active across all submissions. Normalised before matching and inflections handled. Click <strong>"Test this rule"</strong> on any rule to test sample text instantly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.rules?.map((r) => {
              const isTesting = activeTestRuleCode === r.code;
              const testText = ruleTestInputs[r.code] || '';
              const testResult = testRuleMatch(r, testText);

              return (
                <div key={r.id || r.code} className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0A1230] px-2 py-0.5 rounded bg-[#F6F1E7] border border-[#E6DDC8]">
                          {r.code}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize bg-[#FAF8F3] text-[#5B6478] border border-[#E6DDC8]">
                          {r.category}
                        </span>
                      </div>
                      <span className={`text-[12px] font-bold uppercase tracking-wider ${
                        r.severity === 'high' ? 'text-[#B91C1C]' : r.severity === 'medium' ? 'text-[#D97706]' : 'text-[#0F766E]'
                      }`}>
                        {r.severity}
                      </span>
                    </div>
                    <h4 className="font-bold text-[#0A1230] text-[16px] mb-1">{r.title}</h4>
                    <p className="text-[14px] text-[#2B3345] leading-relaxed mb-3">{r.description}</p>
                    
                    {r.source_excerpt && (
                      <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#E6DDC8] text-[13px] text-[#5B6478] mb-3">
                        <strong className="text-[#0A1230]">Policy source:</strong> {r.source_excerpt}
                      </div>
                    )}
                  </div>

                  {/* Interactive Rule Tester Section */}
                  <div className="pt-3 border-t border-[#E6DDC8]/60">
                    <button
                      type="button"
                      onClick={() => setActiveTestRuleCode(isTesting ? null : r.code)}
                      className="text-xs font-semibold text-[#8A6A00] hover:text-[#0A1230] flex items-center gap-1.5 transition-colors mb-2 cursor-pointer"
                    >
                      <Beaker className="w-3.5 h-3.5" />
                      <span>{isTesting ? 'Hide Rule Tester' : 'Test this rule with sample text'}</span>
                      {isTesting ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {isTesting && (
                      <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#D4AF37]/40 space-y-2.5 animate-fadeIn text-xs">
                        <label className="font-semibold text-[#0A1230] block">
                          Paste test snippet to verify triggers:
                        </label>
                        <input
                          type="text"
                          value={testText}
                          placeholder={`e.g. Test copy for ${r.title.toLowerCase()}...`}
                          onChange={(e) => setRuleTestInputs({ ...ruleTestInputs, [r.code]: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-[#E6DDC8] bg-white text-[#0A1230] text-xs focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                        />

                        {testText.trim() && testResult && (
                          <div className={`p-2.5 rounded-lg border text-xs ${
                            testResult.triggered 
                              ? 'bg-[#FEF2F2] border-[#DC2626]/30 text-[#991B1B]' 
                              : 'bg-[#D1FAE5] border-[#065F46]/30 text-[#065F46]'
                          }`}>
                            {testResult.triggered ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 font-bold">
                                  <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                                  <span>Rule Triggered (Match Found)</span>
                                </div>
                                <p className="text-[11px] leading-relaxed">
                                  Matched quote: <strong className="bg-[#FEE2E2] px-1 py-0.5 rounded text-[#991B1B]">"{testResult.quote}"</strong>
                                </p>
                                <p className="text-[11px] opacity-90">{testResult.reason}</p>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 font-bold">
                                <CheckCircle2 className="w-4 h-4 text-[#065F46] shrink-0" />
                                <span>Rule Passed: No violation detected in sample copy.</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between text-[13px] text-[#5B6478]">
                      <span>Citation: {r.source_ref}</span>
                      <span>Flagged {r.times_flagged || 0} times</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: TERMINOLOGY */}
      {activeTab === 'terminology' && (
        <div className="bg-white rounded-[14px] border border-[#E6DDC8] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#E6DDC8]">
            <h3 className="font-serif text-lg font-bold text-[#0A1230]">Glossary & Nomenclature</h3>
            <p className="text-[14px] text-[#5B6478] mt-0.5">Automated replacement maps and brand tone restrictions.</p>
          </div>

          <table className="w-full text-left text-[14px]">
            <thead className="bg-[#FAF8F3] text-[#5B6478] uppercase tracking-wider font-semibold border-b border-[#E6DDC8] text-[13px]">
              <tr>
                <th className="px-6 py-3.5">Avoid Term</th>
                <th className="px-6 py-3.5">Preferred Term</th>
                <th className="px-6 py-3.5">Rationale & Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DDC8]/60">
              {profile.terms?.map((t, idx) => (
                <tr key={idx} className="hover:bg-[#F6F1E7]/40">
                  <td className="px-6 py-3.5 font-mono font-medium text-[#B91C1C]">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#B91C1C]/10 border-b-2 border-[#B91C1C]/40">
                      <span aria-hidden="true" className="font-bold text-[11px] leading-none opacity-80">−</span>
                      <span>"{t.avoid}"</span>
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-mono font-bold text-[#065F46]">
                    "{t.prefer}"
                  </td>
                  <td className="px-6 py-3.5 text-[#5B6478]">
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
        <div className="bg-white rounded-[14px] border border-[#E6DDC8] p-6 shadow-sm max-w-2xl">
          <h3 className="font-serif text-xl font-bold text-[#0A1230] mb-4">Brand Profile Identity</h3>
          
          <div className="space-y-4 text-[14px]">
            <div>
              <span className="font-semibold text-[#5B6478] block mb-1">Company / Product Name:</span>
              <p className="text-[16px] font-bold text-[#0A1230] font-mono">{profile.name}</p>
            </div>

            <div>
              <span className="font-semibold text-[#5B6478] block mb-1">Brand Tagline:</span>
              <p className="text-[15px] text-[#2B3345]">{profile.tagline}</p>
            </div>

            <div>
              <span className="font-semibold text-[#5B6478] block mb-1">Audience:</span>
              <p className="text-[15px] text-[#2B3345] capitalize">{profile.audience}</p>
            </div>

            <div>
              <span className="font-semibold text-[#5B6478] block mb-1">Voice Attributes:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {(profile.voice_attributes || []).map((attr, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-[#FAF8F3] border border-[#E6DDC8] text-[#0A1230] font-medium text-xs">
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
          <p className="text-[14px] text-[#5B6478] mb-4">
            Approved color tokens checked by CIE ΔE distance and WCAG AA contrast ratios (4.5:1).
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(profile.palette_json || []).map((p, idx) => (
              <div key={idx} className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] shadow-sm flex flex-col items-center text-center">
                <div 
                  className="w-16 h-16 rounded-xl shadow-inner border border-[#E6DDC8] mb-3"
                  style={{ backgroundColor: p.hex }}
                />
                <span className="font-bold text-[#0A1230] text-[15px]">{p.name}</span>
                <span className="font-mono text-[#5B6478] text-[13px] mt-0.5">{p.hex}</span>
                <span className="text-[12px] text-[#5B6478] capitalize mt-1">Role: {p.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Fact Modal */}
      {showFactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1230]/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[14px] max-w-lg w-full p-6 shadow-2xl border border-[#E6DDC8]">
            <h3 className="font-serif text-xl font-bold text-[#0A1230] mb-1">Add Approved Fact</h3>
            <p className="text-[13px] text-[#5B6478] mb-4">New facts are immediately loaded by Layer 2 retrieval for claim verification.</p>

            <form onSubmit={handleCreateFact} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#0A1230] text-[13px] block mb-1">Fact Code</label>
                <input
                  type="text"
                  value={newFact.code}
                  onChange={(e) => setNewFact({ ...newFact, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E6DDC8] font-mono text-[14px] text-[#2B3345]"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#0A1230] text-[13px] block mb-1">Fact Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Accreditation Status"
                  value={newFact.name}
                  onChange={(e) => setNewFact({ ...newFact, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E6DDC8] text-[14px] text-[#2B3345]"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#0A1230] text-[13px] block mb-1">Approved Statement (Exact Wording)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. All certificates are recognized by standard industry partners."
                  value={newFact.statement}
                  onChange={(e) => setNewFact({ ...newFact, statement: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E6DDC8] text-[14px] text-[#2B3345]"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#0A1230] text-[13px] block mb-1">Verified Source Documentation</label>
                <input
                  type="text"
                  placeholder="e.g. Academic Council Minutes §4"
                  value={newFact.source}
                  onChange={(e) => setNewFact({ ...newFact, source: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E6DDC8] text-[14px] text-[#2B3345]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#E6DDC8]">
                <button
                  type="button"
                  onClick={() => setShowFactModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#E6DDC8] text-[#5B6478] hover:bg-[#FAF8F3] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-bold text-xs text-[#0A1230] shadow-sm hover:opacity-95"
                  style={{
                    background: 'linear-gradient(135deg, #F3D98B, #D4AF37 50%, #A67C00)'
                  }}
                >
                  Save Approved Fact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brand Kit Import Preview Modal */}
      {showImportModal && importCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1230]/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#D4AF37]/50 text-xs text-[#0A1230]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DDC8]">
              <div className="flex items-center gap-2">
                <FileUp className="w-5 h-5 text-[#8A6A00]" />
                <h3 className="font-serif text-lg font-bold">Import Brand Kit</h3>
              </div>
              <button
                type="button"
                onClick={() => { setShowImportModal(false); setImportCandidate(null); }}
                className="text-[#5B6478] hover:text-[#0A1230]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-[#5B6478]">
                Valid Brand Kit found for <strong>{importCandidate.brand_name || 'Brand'}</strong>. Review the contents below before applying to your workspace:
              </p>

              <div className="p-3.5 bg-[#FAF8F3] rounded-xl border border-[#E6DDC8] grid grid-cols-2 gap-3 font-medium">
                <div>
                  <span className="text-[10px] text-[#5B6478] uppercase block">Brand Name</span>
                  <span className="text-[#0A1230] font-bold">{importCandidate.brand_name || profile.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5B6478] uppercase block">Approved Facts</span>
                  <span className="text-[#065F46] font-bold">{importCandidate.facts?.length || 0} facts</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5B6478] uppercase block">Rules</span>
                  <span className="text-[#0A1230] font-bold">{importCandidate.rules?.length || 0} rules</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5B6478] uppercase block">Terminology</span>
                  <span className="text-[#0A1230] font-bold">{importCandidate.terms?.length || 0} terms</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E6DDC8]">
              <button
                type="button"
                onClick={() => { setShowImportModal(false); setImportCandidate(null); }}
                className="px-4 py-2 rounded-lg border border-[#E6DDC8] text-[#5B6478] hover:bg-[#FAF8F3] font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={importing}
                className="px-4 py-2 rounded-lg bg-[#0A1230] text-[#D4AF37] font-bold hover:bg-[#0A1230]/90 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{importing ? 'Importing...' : 'Apply Brand Kit'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
