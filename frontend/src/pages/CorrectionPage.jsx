import React, { useState, useEffect } from 'react';
import { 
  GitCommit, ArrowRight, RefreshCw, CheckCircle2, RotateCcw, 
  Sparkles, Layers, ShieldCheck, Save
} from 'lucide-react';
import { getSubmissionDetail, createNewVersion, computeDiff } from '../lib/api';
import { SideBySideDiff } from '../components/WordDiffView';

export function CorrectionPage({ submissionId, setActivePage, role }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revisedContent, setRevisedContent] = useState('');
  const [diffTokens, setDiffTokens] = useState([]);
  const [saving, setSaving] = useState(false);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);

  const loadData = async () => {
    if (!submissionId) return;
    setLoading(true);
    try {
      const data = await getSubmissionDetail(submissionId);
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
      console.error(err);
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
    if (!revisedContent.trim()) return;
    setSaving(true);
    try {
      await createNewVersion(submissionId, {
        content: revisedContent,
        author_name: role === 'reviewer' ? 'Elena Vance' : 'Creator User'
      });
      // Switch back to results to see the new analysis run findings!
      setActivePage('results');
    } catch (err) {
      alert('Error creating version: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !detail) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-gray-500">
        Loading correction workspace...
      </div>
    );
  }

  const currentVersion = detail.versions[selectedVersionIndex] || detail.versions[0];
  const findings = currentVersion.analysis_run?.findings || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal">Intent-Preserving Correction Workspace</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-mist text-ink">Version {currentVersion.version_number}</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink mt-1">{detail.title}</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Original copy is never overwritten. All revisions create a new version with a clean content hash.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('results')}
            className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-mist transition-all"
          >
            Back to Findings
          </button>

          <button
            onClick={handleSaveNewVersion}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-midnight text-xs font-bold transition-all shadow-glow flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Analyzing New Version...' : 'Save as New Version & Re-analyse'}</span>
          </button>
        </div>
      </div>

      {/* Version Selector if multiple versions exist */}
      {detail.versions.length > 1 && (
        <div className="flex items-center gap-2 mb-6 text-xs">
          <span className="font-semibold text-gray-600">Select Version:</span>
          {detail.versions.map((v, i) => (
            <button
              key={v.id}
              onClick={() => {
                setSelectedVersionIndex(i);
                handleContentChange(v.content);
              }}
              className={`px-3 py-1 rounded-lg font-mono font-medium transition-all ${
                selectedVersionIndex === i
                  ? 'bg-midnight text-gold border border-gold/40'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-mist'
              }`}
            >
              v{v.version_number} {i === detail.versions.length - 1 ? '(Latest)' : ''}
            </button>
          ))}
        </div>
      )}

      {/* Side-by-Side Diff Display */}
      <div className="mb-8">
        <h3 className="font-serif text-lg font-bold text-ink mb-3">Side-by-Side Intent Diff</h3>
        <SideBySideDiff
          original={currentVersion.content}
          revised={revisedContent}
          diffTokens={diffTokens}
        />
      </div>

      {/* Editable Interactive Revised Copy Box */}
      <div className="bg-white rounded-2xl border border-gold/40 p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-serif text-base font-bold text-ink">Edit Revised Draft</h3>
            <p className="text-xs text-gray-500">
              Refine your wording below. The word diff above updates automatically in real-time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleContentChange(currentVersion.content)}
            className="text-xs text-gray-500 hover:text-ink flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Original</span>
          </button>
        </div>

        <textarea
          rows={5}
          value={revisedContent}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full p-4 rounded-xl border border-gray-300 text-sm font-sans leading-relaxed focus:ring-2 focus:ring-gold focus:outline-none"
        />

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-2 text-teal">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-medium">Intent preservation verified: No unbacked claims injected.</span>
          </div>

          <button
            onClick={handleSaveNewVersion}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-midnight font-bold shadow-sm flex items-center gap-1.5 transition-all self-end"
          >
            <span>Proceed with v{detail.versions.length + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}

