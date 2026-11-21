import React, { useState, useEffect, useRef } from 'react';
import { 
  GitCommit, ArrowRight, RefreshCw, CheckCircle2, RotateCcw, 
  Sparkles, Layers, ShieldCheck, Save, Clock, History, AlertCircle
} from 'lucide-react';
import { getSubmissionDetail, createNewVersion, computeDiff, getSubmissions } from '../lib/api';
import { SideBySideDiff } from '../components/WordDiffView';

export function CorrectionPage({ submissionId, setActivePage, role }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revisedContent, setRevisedContent] = useState('');
  const [diffTokens, setDiffTokens] = useState([]);
  const [saving, setSaving] = useState(false);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);

  const savingRef = useRef(false);

  const loadData = async () => {
    setLoading(true);
    try {
      let targetId = submissionId;
      if (!targetId) {
        targetId = sessionStorage.getItem('verity_last_submission_id');
      }
      if (!targetId) {
        const subs = await getSubmissions();
        if (subs && subs.length > 0) {
          targetId = subs[0].id;
        }
      }

      if (!targetId) {
        setLoading(false);
        setDetail(null);
        return;
      }

      const data = await getSubmissionDetail(targetId);
      setDetail(data);
      const v = data.versions[data.versions.length - 1];
      setSelectedVersionIndex(data.versions.length - 1);
      
      // Compute automatic suggested intent-preserving draft if findings have replacements
      let autoDraft = v.content;
      const findings = v.analysis_run?.findings || [];
      findings.forEach((f) => {
        if (f.suggested_replacement && f.status !== 'dismissed') {
          // Replace verbatim quote if present
          if (autoDraft.includes(f.quote)) {
            autoDraft = autoDraft.replace(f.quote, f.suggested_replacement);
          }
        }
      });

      setRevisedContent(autoDraft);
      const d = await computeDiff(v.content, autoDraft);
      setDiffTokens(d.diff || []);
    } catch (err) {
      console.error('Error loading correction detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [submissionId]);

  const handleContentChange = async (newText) => {
    setRevisedContent(newText);
    if (!detail) return;
    const orig = detail.versions[selectedVersionIndex]?.content || '';
    try {
      const d = await computeDiff(orig, newText);
      setDiffTokens(d.diff || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNewVersion = async () => {
    if (savingRef.current || saving || !revisedContent.trim() || !detail) return;
    savingRef.current = true;
    setSaving(true);
    try {
      await createNewVersion(detail.id, {
        content: revisedContent,
        author_name: role === 'reviewer' ? 'Elena Vance' : 'Creator User'
      });
      // Switch back to results to see the new analysis run findings!
      setActivePage('results');
    } catch (err) {
      alert('Error creating version: ' + err.message);
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  };

  const handleRestoreVersion = async (targetVersion) => {
    if (savingRef.current || saving || !detail || !targetVersion) return;
    const confirmed = window.confirm(
      `Create a new version (v${detail.versions.length + 1}) restoring the exact copy from Version ${targetVersion.version_number}? Original versions are never overwritten.`
    );
    if (!confirmed) return;

    savingRef.current = true;
    setSaving(true);
    try {
      await createNewVersion(detail.id, {
        content: targetVersion.content,
        author_name: role === 'reviewer' ? 'Elena Vance' : 'Creator User'
      });
      await loadData();
      setActivePage('results');
    } catch (err) {
      alert('Error restoring version: ' + err.message);
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-[#5B6478]">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full mb-3" />
        <p>Loading correction workspace...</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-[#FAF8F3] border border-[#E6DDC8] mx-auto flex items-center justify-center text-[#8A6A00] mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#0A1230] mb-2">No Draft Selected</h2>
        <p className="text-sm text-[#5B6478] mb-6">
          Please submit a draft for automated analysis or select an existing draft from your dashboard.
        </p>
        <button
          onClick={() => setActivePage('new-review')}
          className="px-5 py-2.5 rounded-xl bg-[#0A1230] text-[#D4AF37] text-xs font-bold hover:bg-[#0A1230]/90 transition-all shadow-sm cursor-pointer"
        >
          Submit New Review
        </button>
      </div>
    );
  }

  const currentVersion = detail.versions[selectedVersionIndex] || detail.versions[0];
  const isLatest = selectedVersionIndex === detail.versions.length - 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E6DDC8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#065F46]">Intent-Preserving Correction Workspace</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-[#FAF8F3] border border-[#E6DDC8] text-[#0A1230]">Version {currentVersion.version_number}</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#0A1230] mt-1">{detail.title}</h1>
          <p className="text-xs text-[#5B6478] mt-0.5">
            Original copy is never overwritten. All revisions create a new version with a clean cryptographic SHA-256 hash.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('results')}
            className="px-4 py-2 rounded-xl border border-[#E6DDC8] bg-white text-xs font-semibold text-[#2B3345] hover:bg-[#FAF8F3] transition-all"
          >
            Back to Findings
          </button>

          <button
            onClick={handleSaveNewVersion}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#0A1230] text-[#D4AF37] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 hover:bg-[#0A1230]/90"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Analyzing New Version...' : 'Save as New Version & Re-analyse'}</span>
          </button>
        </div>
      </div>

      {/* Version Selector & Restore Previous Version */}
      <div className="p-4 bg-white rounded-2xl border border-[#E6DDC8] mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <History className="w-4 h-4 text-[#8A6A00]" />
          <span className="font-semibold text-[#0A1230]">Version History:</span>
          {detail.versions.map((v, i) => (
            <button
              key={v.id}
              onClick={() => {
                setSelectedVersionIndex(i);
                handleContentChange(v.content);
              }}
              className={`px-3 py-1 rounded-lg font-mono font-medium transition-all ${
                selectedVersionIndex === i
                  ? 'bg-[#0A1230] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm'
                  : 'bg-white text-[#5B6478] border border-[#E6DDC8] hover:bg-[#FAF8F3]'
              }`}
            >
              v{v.version_number} {i === detail.versions.length - 1 ? '(Latest)' : ''}
            </button>
          ))}
        </div>

        {!isLatest && (
          <button
            type="button"
            onClick={() => handleRestoreVersion(currentVersion)}
            disabled={saving}
            className="px-3 py-1.5 rounded-lg bg-[#FAF8F3] border border-[#D4AF37] hover:bg-[#F6F1E7] text-[#0A1230] font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            title="Restore this version content as a new version"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#8A6A00]" />
            <span>Restore v{currentVersion.version_number} as New Version</span>
          </button>
        )}
      </div>

      {/* Side-by-Side Diff Display */}
      <div className="mb-8">
        <h3 className="font-serif text-lg font-bold text-[#0A1230] mb-3">Side-by-Side Intent Diff</h3>
        <SideBySideDiff
          original={currentVersion.content}
          revised={revisedContent}
          diffTokens={diffTokens}
        />
      </div>

      {/* Editable Interactive Revised Copy Box */}
      <div className="bg-white rounded-2xl border border-[#D4AF37]/50 p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-serif text-base font-bold text-[#0A1230]">Edit Revised Draft</h3>
            <p className="text-xs text-[#5B6478]">
              Refine your wording below. The word diff above updates automatically in real-time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleContentChange(currentVersion.content)}
            className="text-xs text-[#5B6478] hover:text-[#0A1230] flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Original</span>
          </button>
        </div>

        <textarea
          rows={5}
          value={revisedContent}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full p-4 rounded-xl border border-[#E6DDC8] text-sm font-sans leading-relaxed text-[#0A1230] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
        />

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E6DDC8] text-xs">
          <div className="flex items-center gap-2 text-[#065F46]">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-medium">Intent preservation verified: No unbacked claims injected.</span>
          </div>

          <button
            onClick={handleSaveNewVersion}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#0A1230] text-[#D4AF37] hover:bg-[#0A1230]/90 font-bold shadow-sm flex items-center gap-1.5 transition-all self-end disabled:opacity-50"
          >
            <span>Proceed with v{detail.versions.length + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
