import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, AlertTriangle, MessageSquare, Send,
  Shield, Lock, Hash, ArrowLeft, Clock, FileCheck, Layers, ChevronRight
} from 'lucide-react';
import { getSubmissionDetail, getSubmissions, submitReviewDecision, addComment } from '../lib/api';

export function ReviewApprovalPage({ submissionId, setActivePage, role }) {
  const [detail, setDetail] = useState(null);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [currentSubId, setCurrentSubId] = useState(submissionId);
  const [loading, setLoading] = useState(true);
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [decisionReason, setDecisionReason] = useState('');
  const [overrideUsed, setOverrideUsed] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [commentText, setCommentText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [stampSuccess, setStampSuccess] = useState(false);

  const loadData = async (targetId) => {
    setLoading(true);
    try {
      const subs = await getSubmissions();
      setAllSubmissions(subs || []);

      let activeId = targetId;
      if (!activeId && subs && subs.length > 0) {
        activeId = subs[0].id;
        setCurrentSubId(activeId);
      }

      if (activeId) {
        const data = await getSubmissionDetail(activeId);
        setDetail(data);
        if (data.versions?.length > 0) {
          setSelectedVersionId(data.versions[data.versions.length - 1].id);
        }
      } else {
        setDetail(null);
      }
    } catch (err) {
      console.error('Error loading review details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(submissionId || currentSubId);
  }, [submissionId]);

  const handleSwitchSubmission = (newId) => {
    setCurrentSubId(newId);
    loadData(newId);
  };

  const activeVersion = detail?.versions?.find(v => v.id === selectedVersionId) || detail?.versions?.[0];
  const findings = activeVersion?.analysis_run?.findings || [];
  const unresolvedHigh = findings.filter(f => f.severity === 'high' && f.status === 'open');

  const isReviewerOrAdmin = role === 'reviewer' || role === 'admin' || role === 'owner';

  const handleDecision = async (decision) => {
    if (!selectedVersionId || !currentSubId) return;
    if (!isReviewerOrAdmin) {
      alert("Access Denied: Only authorized Reviewers or Admins can submit approval or rejection decisions. Please switch your role to 'Reviewer' in the top navbar.");
      return;
    }
    setActionLoading(true);
    try {
      await submitReviewDecision(currentSubId, {
        version_id: selectedVersionId,
        decision,
        reviewer_name: role === 'reviewer' ? 'Elena Vance (Reviewer)' : `${role.toUpperCase()} User`,
        reviewer_role: role,
        reason: decisionReason,
        override_used: overrideUsed,
        override_reason: overrideReason
      });

      if (decision === 'approve') {
        setStampSuccess(true);
      }
      loadData(currentSubId);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !currentSubId) return;
    try {
      await addComment(currentSubId, {
        submission_version_id: selectedVersionId,
        user_name: role === 'reviewer' ? 'Elena Vance (Reviewer)' : 'Creator User',
        user_role: role,
        comment_text: commentText
      });
      setCommentText('');
      loadData(currentSubId);
    } catch (err) {
      alert('Error adding comment: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-gray-500">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Loading Review & Approval Centre...</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-champagne/30 border border-gold/40 flex items-center justify-center mx-auto mb-4">
          <FileCheck className="w-8 h-8 text-gold" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink">Review Queue Empty</h2>
        <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto">
          No content submissions currently require review. Submit a new document or load demonstration samples to evaluate the governance workflow.
        </p>
        <button
          onClick={() => setActivePage('new-review')}
          className="mt-6 px-6 py-2.5 rounded-xl bg-midnight hover:bg-navy text-gold hover:text-white font-medium text-xs shadow transition-all"
        >
          Submit Content for Review
        </button>
      </div>
    );
  }

  const isApproved = detail.status === 'Approved';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200">
        <div>
          <button
            onClick={() => setActivePage('results')}
            className="text-xs text-gray-500 hover:text-ink flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Analysis Results</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">Human Authority Gate</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              isApproved 
                ? 'bg-teal/20 text-teal border border-teal/40' 
                : detail.status === 'Rejected' 
                  ? 'bg-coral/20 text-coral border border-coral/30'
                  : 'bg-amber/20 text-amber-800'
            }`}>
              {detail.status}
            </span>
          </div>

          <h1 className="font-serif text-3xl font-bold text-ink mt-1">{detail.title}</h1>
          <p className="text-xs text-gray-500 mt-0.5">Author: {detail.author_name} • Channel: {detail.content_type}</p>
        </div>

        {/* Submission & Version Selectors */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {allSubmissions.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-600">Draft:</span>
              <select
                value={currentSubId}
                onChange={(e) => handleSwitchSubmission(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-gray-300 font-medium bg-white text-ink shadow-sm"
              >
                {allSubmissions.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-600">Version:</span>
            <select
              value={selectedVersionId}
              onChange={(e) => setSelectedVersionId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-300 font-mono font-bold bg-white text-ink shadow-sm"
            >
              {detail.versions?.map((v) => (
                <option key={v.id} value={v.id}>
                  v{v.version_number} ({v.content_hash.slice(0, 8)}...)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Content, Version Hash & Findings Inspection */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Version Metadata & Hash Stamp */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold shrink-0" />
              <span className="font-semibold text-ink">
                Version {activeVersion?.version_number} Cryptographic Hash:
              </span>
              <span className="font-mono text-[11px] bg-mist px-2 py-0.5 rounded border border-gray-200 text-gray-700">
                {activeVersion?.content_hash}
              </span>
            </div>

            {isApproved && (
              <div className="flex items-center gap-1.5 text-teal font-bold px-3 py-1 bg-teal/10 rounded-lg border border-teal/30">
                <CheckCircle className="w-4 h-4" />
                <span>Verified Sign-off Applied</span>
              </div>
            )}
          </div>

          {/* Submitted Content Viewer */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Evaluated Content Draft (Version {activeVersion?.version_number})
            </h2>
            <div className="p-4 bg-mist/40 rounded-xl border border-gray-200 text-sm leading-relaxed text-ink whitespace-pre-wrap font-sans">
              {activeVersion?.content}
            </div>
          </div>

          {/* Finding Checks Overview */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4 flex items-center justify-between">
              <span>Automated Verification Checks ({findings.length})</span>
              {unresolvedHigh.length > 0 && (
                <span className="text-coral font-bold text-xs flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {unresolvedHigh.length} High-Severity Blocker(s)
                </span>
              )}
            </h2>

            {findings.length === 0 ? (
              <div className="p-4 bg-teal/10 border border-teal/20 rounded-xl text-xs text-teal font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Zero violations detected. Content is clean and compliant with active brand rules.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {findings.map((f) => (
                  <div key={f.id} className="p-3.5 bg-mist/50 rounded-xl border border-gray-200 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                          f.severity === 'high' ? 'bg-coral/20 text-coral' : 'bg-amber/20 text-amber-800'
                        }`}>
                          {f.severity}
                        </span>
                        <span className="font-bold text-ink">{f.title}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
                        {f.status}
                      </span>
                    </div>
                    <p className="text-gray-700 italic">"{f.quote}"</p>
                    <p className="text-gray-500 mt-1 text-[11px]">{f.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historical Review Decisions */}
          {detail.decisions?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-xs">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Decision Audit Trail
              </h2>
              <div className="space-y-3">
                {detail.decisions.map((d) => (
                  <div key={d.id} className="p-3 bg-mist/60 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-1 font-semibold">
                      <span className={`uppercase text-[10px] font-bold ${
                        d.decision === 'approve' ? 'text-teal' : 'text-coral'
                      }`}>
                        Decision: {d.decision}
                      </span>
                      <span className="font-mono text-[10px] text-gray-400">
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
            <h3 className="font-serif text-base font-bold text-ink mb-1">Reviewer Sign-off</h3>
            <p className="text-gray-500 mb-4">
              Current Persona: <strong className="text-ink">{role.toUpperCase()}</strong>{' '}
              {!isReviewerOrAdmin && (
                <span className="text-coral block mt-0.5 text-[11px]">
                  (Reviewer role required for sign-off. Switch role in navbar)
                </span>
              )}
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
                <div className="p-3 bg-amber/10 rounded-xl border border-amber/30 text-amber-900">
                  <label className="flex items-start gap-2 cursor-pointer font-medium text-xs">
                    <input
                      type="checkbox"
                      checked={overrideUsed}
                      onChange={(e) => setOverrideUsed(e.target.checked)}
                      className="mt-0.5 rounded text-gold focus:ring-gold"
                    />
                    <span>Authorize Compliance Override</span>
                  </label>

                  {overrideUsed && (
                    <input
                      type="text"
                      placeholder="Mandatory override audit explanation..."
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      className="mt-2 w-full p-2 rounded border border-amber-300 text-xs bg-white"
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
                  disabled={
                    actionLoading || 
                    !isReviewerOrAdmin ||
                    (unresolvedHigh.length > 0 && (!overrideUsed || !overrideReason.trim()))
                  }
                  className="w-full py-2.5 rounded-xl bg-teal text-white font-bold transition-all shadow-sm hover:bg-teal/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  title={
                    !isReviewerOrAdmin 
                      ? 'Switch to Reviewer role to approve' 
                      : unresolvedHigh.length > 0 && !overrideUsed 
                        ? 'Unresolved high severity violations block approval' 
                        : 'Approve current version'
                  }
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve Version {activeVersion?.version_number}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDecision('request_changes')}
                    disabled={actionLoading || !decisionReason.trim() || !isReviewerOrAdmin}
                    className="py-2 rounded-xl bg-mist text-ink hover:bg-gray-200 font-semibold transition-all disabled:opacity-50"
                  >
                    Request Changes
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDecision('reject')}
                    disabled={actionLoading || !decisionReason.trim() || !isReviewerOrAdmin}
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
                placeholder="Write a review comment..."
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
