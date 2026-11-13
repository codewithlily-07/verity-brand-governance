import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, AlertTriangle, MessageSquare, Send,
  Shield, Lock, Hash, ArrowLeft, Clock, FileCheck
} from 'lucide-react';
import { getSubmissionDetail, submitReviewDecision, addComment } from '../lib/api';

export function ReviewApprovalPage({ submissionId, setActivePage, role }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [decisionReason, setDecisionReason] = useState('');
  const [overrideUsed, setOverrideUsed] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [commentText, setCommentText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [stampSuccess, setStampSuccess] = useState(false);

  const loadData = async () => {
    if (!submissionId) return;
    setLoading(true);
    try {
      const data = await getSubmissionDetail(submissionId);
      setDetail(data);
      if (data.versions?.length > 0) {
        setSelectedVersionId(data.versions[data.versions.length - 1].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [submissionId]);

  const activeVersion = detail?.versions?.find(v => v.id === selectedVersionId) || detail?.versions?.[0];
  const findings = activeVersion?.analysis_run?.findings || [];
  const unresolvedHigh = findings.filter(f => f.severity === 'high' && f.status === 'open');

  const handleDecision = async (decision) => {
    if (!selectedVersionId) return;
    setActionLoading(true);
    try {
      await submitReviewDecision(submissionId, {
        version_id: selectedVersionId,
        decision,
        reviewer_name: role === 'reviewer' ? 'Elena Vance' : 'Creator User',
        reviewer_role: role,
        reason: decisionReason,
        override_used: overrideUsed,
        override_reason: overrideReason
      });

      if (decision === 'approve') {
        setStampSuccess(true);
      }
      loadData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addComment(submissionId, {
        submission_version_id: selectedVersionId,
        user_name: role === 'reviewer' ? 'Elena Vance' : 'Creator User',
        user_role: role,
        comment_text: commentText
      });
      setCommentText('');
      loadData();
    } catch (err) {
      alert('Error adding comment: ' + err.message);
    }
  };

  if (loading || !detail) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-gray-500">
        Loading review & approval workspace...
      </div>
    );
  }

  const isApproved = detail.status === 'Approved';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200">
        <div>
          <button
            onClick={() => setActivePage('results')}
            className="text-xs text-gray-500 hover:text-ink flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Analysis</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">Final Human Authority Gate</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              isApproved ? 'bg-teal/20 text-teal border border-teal/40' : 'bg-amber/20 text-amber-800'
            }`}>
              {detail.status}
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink mt-1">{detail.title}</h1>
          <p className="text-xs text-gray-500 mt-0.5">Author: {detail.author_name} • Channel: {detail.content_type}</p>
        </div>

        {/* Version Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-gray-600">Review Version:</span>
          <select
            value={selectedVersionId}
            onChange={(e) => setSelectedVersionId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-300 font-mono font-bold bg-white text-ink"
          >
            {detail.versions?.map((v) => (
              <option key={v.id} value={v.id}>
                v{v.version_number} ({v.content_hash.slice(0, 8)}...)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Content & Findings Inspection */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Version Cryptographic Lock Box */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 text-xs">
              <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gold" />
                <span>Version-Bound Snapshot (v{activeVersion?.version_number})</span>
              </span>
              <span className="font-mono text-gray-500 text-[11px] flex items-center gap-1">
                <Hash className="w-3 h-3" />
                SHA-256: {activeVersion?.content_hash}
              </span>
            </div>

            <div className="p-4 bg-mist/60 rounded-xl border border-gray-200 text-sm leading-relaxed whitespace-pre-wrap text-ink font-sans">
              {activeVersion?.content}
            </div>

            {stampSuccess && (
              <div className="mt-4 p-4 rounded-xl bg-teal/15 border-2 border-teal text-teal flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle className="w-5 h-5" />
                  <span>Approved for Publication — Verity Seal Applied!</span>
                </div>
                <span className="text-xs font-mono">v{activeVersion?.version_number} locked</span>
              </div>
            )}
          </div>

          {/* Unresolved High Severity Summary */}
          {unresolvedHigh.length > 0 && (
            <div className="p-4 rounded-xl bg-coral/10 border border-coral/30 text-xs text-coral">
              <div className="flex items-center gap-2 font-bold mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>{unresolvedHigh.length} Unresolved High-Severity Finding(s)</span>
              </div>
              <p className="text-coral/90 leading-relaxed">
                Platform policy strictly disables approval until all high-severity findings are resolved in the correction workspace, or an explicit reviewer override is recorded with justification.
              </p>
            </div>
          )}

          {/* Past Review Decisions */}
          {detail.decisions?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-serif text-base font-bold text-ink mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-gold" />
                <span>Decision Audit Log</span>
              </h3>

              <div className="space-y-3">
                {detail.decisions.map((d) => (
                  <div key={d.id} className="p-3 bg-mist/60 rounded-xl border border-gray-100 text-xs">
                    <div className="flex items-center justify-between font-medium mb-1">
                      <span className="capitalize font-bold text-ink flex items-center gap-1.5">
                        {d.decision === 'approve' ? '✓ Approved' : d.decision === 'reject' ? '✕ Rejected' : '⚠ Changes Requested'}
                      </span>
                      <span className="text-gray-400 font-mono text-[10px]">
                        Hash: {d.content_hash.slice(0, 8)}...
                      </span>
                    </div>
                    <p className="text-gray-600 italic">"{d.reason || 'No comments specified.'}"</p>
                    <span className="text-[10px] text-gray-400 block mt-1">
                      By {d.reviewer_name} ({d.reviewer_role}) • {new Date(d.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Col: Review Actions & Comments Thread */}
        <div className="space-y-6">
          
          {/* Review Decision Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-xs">
            <h3 className="font-serif text-base font-bold text-ink mb-1">Reviewer Actions</h3>
            <p className="text-gray-500 mb-4">
              Current user: <strong>{role === 'reviewer' ? 'Elena Vance (Reviewer)' : 'Creator User (Creator)'}</strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Decision Notes / Required Reason
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide feedback for creator or record audit reason..."
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-gold focus:outline-none"
                />
              </div>

              {/* Override Checkbox if high-severity items are open */}
              {unresolvedHigh.length > 0 && (
                <div className="p-3 bg-mist rounded-xl border border-gray-200">
                  <label className="flex items-start gap-2 cursor-pointer font-medium text-ink">
                    <input
                      type="checkbox"
                      checked={overrideUsed}
                      onChange={(e) => setOverrideUsed(e.target.checked)}
                      className="mt-0.5 rounded text-gold focus:ring-gold"
                    />
                    <span>Authorize Reviewer Override</span>
                  </label>

                  {overrideUsed && (
                    <input
                      type="text"
                      placeholder="Mandatory override explanation..."
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      className="mt-2 w-full p-2 rounded border border-gray-300 text-xs"
                      required
                    />
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleDecision('approve')}
                  disabled={actionLoading || (unresolvedHigh.length > 0 && (!overrideUsed || !overrideReason.trim()))}
                  className="w-full py-2.5 rounded-xl bg-teal text-white font-bold transition-all shadow-sm hover:bg-teal/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  title={unresolvedHigh.length > 0 && !overrideUsed ? 'Unresolved high severity violations block approval' : 'Approve current version'}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve Version {activeVersion?.version_number}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDecision('request_changes')}
                    disabled={actionLoading || !decisionReason.trim()}
                    className="py-2 rounded-xl bg-mist text-ink hover:bg-gray-200 font-semibold transition-all disabled:opacity-50"
                  >
                    Request Changes
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDecision('reject')}
                    disabled={actionLoading || !decisionReason.trim()}
                    className="py-2 rounded-xl text-coral hover:bg-coral/10 border border-coral/30 font-semibold transition-all disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Comments Thread */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-xs flex flex-col h-[350px]">
            <h3 className="font-serif text-base font-bold text-ink mb-3 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-gold" />
              <span>Review Thread</span>
            </h3>

            <div className="flex-grow overflow-y-auto space-y-3 pr-1 mb-4">
              {detail.comments?.length === 0 ? (
                <p className="text-gray-400 italic text-center py-8">No comments yet. Start the conversation below.</p>
              ) : (
                detail.comments.map((c) => (
                  <div key={c.id} className="p-3 bg-mist/60 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between font-medium mb-1">
                      <span className="font-bold text-ink">{c.user_name}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-gray-700">{c.comment_text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-grow px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-gold focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-navy text-gold hover:bg-navy-2 transition-colors"
                title="Send comment"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}

