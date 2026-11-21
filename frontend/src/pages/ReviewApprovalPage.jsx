import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, XCircle, AlertTriangle, MessageSquare, Send,
  Shield, Lock, Hash, ArrowLeft, Clock, FileCheck, Layers, 
  ChevronRight, RefreshCw, CheckCircle2, UserCheck, Search, Download
} from 'lucide-react';
import { 
  getSubmissionDetail, getSubmissions, submitReviewDecision, 
  addComment, switchRole, verifySubmissionIntegrity, getAuditTrail 
} from '../lib/api';
import { StatusChip } from './DashboardPage';

export function ReviewApprovalPage({ submissionId, setActivePage, role, onRoleChange }) {
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
  const [commentLoading, setCommentLoading] = useState(false);
  const [conflictError, setConflictError] = useState(null);
  const [stampSuccess, setStampSuccess] = useState(false);
  const [integrityResult, setIntegrityResult] = useState(null);
  const [verifyingIntegrity, setVerifyingIntegrity] = useState(false);

  const actionLoadingRef = useRef(false);
  const commentLoadingRef = useRef(false);

  // Top level tabs: 'review' | 'history'
  const [mainTab, setMainTab] = useState('review');
  const [historySubTab, setHistorySubTab] = useState('submissions'); // 'submissions' | 'audit'
  const [auditEvents, setAuditEvents] = useState([]);
  const [historySearch, setHistorySearch] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('all');

  const loadData = async (targetId) => {
    setLoading(true);
    try {
      const [subs, audits] = await Promise.all([
        getSubmissions(),
        getAuditTrail()
      ]);
      setAllSubmissions(subs || []);
      setAuditEvents(audits || []);

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
    setIntegrityResult(null);
    loadData(newId);
  };

  const handleSwitchToReviewerRole = async () => {
    try {
      await switchRole('reviewer');
      if (onRoleChange) onRoleChange('reviewer');
      alert("Role switched to Authorised Reviewer (reviewer@verity.internal). You now hold sign-off authority.");
    } catch (err) {
      alert("Failed to switch role: " + err.message);
    }
  };

  const handleVerifyIntegrity = async () => {
    if (!currentSubId) return;
    setVerifyingIntegrity(true);
    try {
      const res = await verifySubmissionIntegrity(currentSubId);
      setIntegrityResult(res);
    } catch (err) {
      alert("Integrity verification failed: " + err.message);
    } finally {
      setVerifyingIntegrity(false);
    }
  };

  const activeVersion = detail?.versions?.find(v => v.id === selectedVersionId) || detail?.versions?.[0];
  const findings = activeVersion?.analysis_run?.findings || [];
  const unresolvedHigh = findings.filter(f => f.severity === 'high' && f.status === 'open');

  const isReviewerOrAdmin = role === 'reviewer' || role === 'admin' || role === 'owner';

  const handleDecision = async (decision) => {
    if (actionLoadingRef.current || actionLoading) return;

    const explicitVersionId = selectedVersionId || activeVersion?.id;
    if (!explicitVersionId || !currentSubId) {
      alert("Error: Explicit version_id is required. Please select the specific version on screen to review.");
      return;
    }
    if (!decisionReason.trim()) {
      alert("A decision note is required for all review actions. Please provide an audit reason.");
      return;
    }
    if (!isReviewerOrAdmin) {
      alert("Access Denied: Only authorized Reviewers or Admins can submit decisions. Please switch to Reviewer.");
      return;
    }

    actionLoadingRef.current = true;
    setActionLoading(true);
    setConflictError(null);

    try {
      await submitReviewDecision(currentSubId, {
        version_id: explicitVersionId,
        decision,
        reviewer_name: role === 'reviewer' ? 'Elena Vance (Authorised Reviewer)' : `${role.toUpperCase()} User`,
        reviewer_role: role,
        reason: decisionReason,
        override_used: overrideUsed,
        override_reason: overrideReason
      });

      if (decision === 'approve') {
        setStampSuccess(true);
      }
      setDecisionReason('');
      await loadData(currentSubId);
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('409') || msg.toLowerCase().includes('stale') || msg.toLowerCase().includes('newer version') || msg.toLowerCase().includes('conflict')) {
        setConflictError(msg);
      } else {
        alert(msg);
      }
    } finally {
      setActionLoading(false);
      actionLoadingRef.current = false;
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !currentSubId || commentLoadingRef.current || commentLoading) return;
    
    commentLoadingRef.current = true;
    setCommentLoading(true);
    try {
      await addComment(currentSubId, {
        submission_version_id: selectedVersionId,
        user_name: role === 'reviewer' ? 'Elena Vance (Reviewer)' : `${role.toUpperCase()} User`,
        user_role: role,
        comment_text: commentText
      });
      setCommentText('');
      await loadData(currentSubId);
    } catch (err) {
      alert('Error adding comment: ' + err.message);
    } finally {
      setCommentLoading(false);
      commentLoadingRef.current = false;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[15px] text-[#5B6478]">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Loading Review & Approval Centre...</p>
      </div>
    );
  }

  // Filtered submissions for the history tab
  const filteredSubs = allSubmissions.filter(s => 
    s.title.toLowerCase().includes(historySearch.toLowerCase()) ||
    (s.campaign && s.campaign.toLowerCase().includes(historySearch.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Breadcrumb & Section Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-[#E6DDC8]">
        <div>
          <button
            onClick={() => setActivePage('dashboard')}
            className="text-xs text-[#5B6478] hover:text-[#0A1230] flex items-center gap-1 mb-2 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A6A00]">Human Authority Gate</span>
            {detail && <StatusChip status={detail.status} />}
          </div>

          <h1 className="font-serif text-3xl font-bold text-[#0A1230] mt-1">Review Centre</h1>
        </div>

        {/* Top Tabs: Active Review vs History */}
        <div className="flex items-center gap-2 bg-[#FAF8F3] p-1.5 rounded-xl border border-[#E6DDC8]">
          <button
            onClick={() => setMainTab('review')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              mainTab === 'review'
                ? 'bg-[#0A1230] text-white shadow-sm'
                : 'text-[#5B6478] hover:text-[#0A1230]'
            }`}
          >
            Review & Sign-Off
          </button>
          <button
            onClick={() => setMainTab('history')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mainTab === 'history'
                ? 'bg-[#0A1230] text-white shadow-sm'
                : 'text-[#5B6478] hover:text-[#0A1230]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>History & Audit Ledger</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#E5E7EB] text-[#374151]">
              {allSubmissions.length}
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================
          TAB 1: REVIEW & SIGN-OFF
          ========================================================= */}
      {mainTab === 'review' && (
        <>
          {!detail ? (
            <div className="max-w-2xl mx-auto py-16 text-center bg-white rounded-[14px] border border-[#E6DDC8] p-8 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#F6F1E7] border border-[#E6DDC8] flex items-center justify-center mx-auto mb-4 text-[#8A6A00]">
                <FileCheck className="w-8 h-8 text-[#8A6A00]" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#0A1230]">Review Queue Empty</h2>
              <p className="text-[14px] text-[#5B6478] mt-2 max-w-md mx-auto">
                No content submissions currently require review. Submit a new document or run the guided demo from the dashboard to evaluate the governance workflow.
              </p>
              <button
                onClick={() => setActivePage('new-review')}
                className="mt-6 px-6 py-2.5 rounded-xl font-bold text-xs text-[#0A1230] shadow transition-all hover:opacity-95"
                style={{
                  background: 'linear-gradient(135deg, #F3D98B, #D4AF37 50%, #A67C00)'
                }}
              >
                Submit Content for Review
              </button>
            </div>
          ) : (
            <div>
              {/* Submission Title & Selectors Bar */}
              <div className="bg-white rounded-[14px] border border-[#E6DDC8] p-5 mb-6 shadow-[0_1px_2px_rgba(10,18,48,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#0A1230]">{detail.title}</h2>
                  <p className="text-[14px] text-[#5B6478] mt-0.5">
                    Author: <strong className="text-[#0A1230]">{detail.author_name}</strong> • Channel: <span className="capitalize font-medium text-[#0A1230]">{detail.content_type}</span> • Campaign: {detail.campaign || 'General'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  {allSubmissions.length > 1 && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-[#0A1230]">Draft:</span>
                      <select
                        value={currentSubId}
                        onChange={(e) => handleSwitchSubmission(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-[#E6DDC8] font-medium bg-white text-[#2B3345] shadow-sm text-xs focus:ring-1 focus:ring-[#D4AF37]"
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
                    <span className="font-semibold text-[#0A1230]">Version:</span>
                    <select
                      value={selectedVersionId}
                      onChange={(e) => setSelectedVersionId(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-[#E6DDC8] font-mono font-bold bg-white text-[#0A1230] shadow-sm text-xs focus:ring-1 focus:ring-[#D4AF37]"
                    >
                      {detail.versions?.map((v) => (
                        <option key={v.id} value={v.id}>
                          v{v.version_number} ({v.content_hash?.slice(0, 8)}...)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Main Review Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left 2 Cols: Content, Version Hash & Findings Inspection */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Version Metadata & Hash Stamp & Integrity Check */}
                  <div className="p-4 bg-white rounded-[14px] border border-[#E6DDC8] shadow-[0_1px_2px_rgba(10,18,48,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Shield className="w-4 h-4 text-[#8A6A00] shrink-0" />
                      <span className="font-semibold text-[#0A1230]">
                        Version {activeVersion?.version_number} SHA-256 Hash:
                      </span>
                      <span className="font-mono text-[12px] bg-[#FAF8F3] px-2.5 py-0.5 rounded border border-[#E6DDC8] text-[#2B3345]">
                        {activeVersion?.content_hash}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/submissions/${currentSubId}/audit.csv`}
                        download={`audit-${currentSubId?.slice(0, 8)}.csv`}
                        className="px-3 py-1.5 rounded-lg border border-[#E6DDC8] bg-white hover:bg-[#F6F1E7] text-[#0A1230] font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm"
                        title="Download submission audit trail CSV"
                      >
                        <Download className="w-3.5 h-3.5 text-[#8A6A00]" />
                        <span>Audit CSV</span>
                      </a>

                      <button
                        onClick={handleVerifyIntegrity}
                        disabled={verifyingIntegrity}
                        className="px-3 py-1.5 rounded-lg border border-[#0A1230] bg-white hover:bg-[#F6F1E7] text-[#0A1230] font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm"
                        title="Recompute SHA-256 on server to confirm database integrity"
                      >
                        <Hash className={`w-3.5 h-3.5 ${verifyingIntegrity ? 'animate-spin' : ''}`} />
                        <span>{verifyingIntegrity ? 'Verifying...' : 'Verify integrity'}</span>
                      </button>
                    </div>
                  </div>

                  {integrityResult && (
                    <div className="p-3.5 rounded-xl bg-[#D1FAE5] border border-[#065F46]/30 text-xs text-[#065F46] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#065F46] flex-shrink-0" />
                        <div>
                          <strong className="block font-bold">Cryptographic Integrity Verified</strong>
                          <span>Recomputed hash matches stored database version record exactly ({integrityResult.computed_hash?.slice(0, 16)}...).</span>
                        </div>
                      </div>
                      <button onClick={() => setIntegrityResult(null)} className="text-[#065F46] text-xs font-semibold hover:underline">Dismiss</button>
                    </div>
                  )}

                  {/* Submitted Content Viewer */}
                  <div className="bg-white rounded-[14px] border border-[#E6DDC8] p-6 shadow-[0_1px_2px_rgba(10,18,48,0.06)]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B6478] mb-3">
                      Evaluated Content Draft (Version {activeVersion?.version_number})
                    </h3>
                    <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E6DDC8] text-[16px] leading-relaxed text-[#2B3345] whitespace-pre-wrap font-sans">
                      {activeVersion?.content}
                    </div>
                  </div>

                  {/* Finding Checks Overview */}
                  <div className="bg-white rounded-[14px] border border-[#E6DDC8] p-6 shadow-[0_1px_2px_rgba(10,18,48,0.06)]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif text-lg font-bold text-[#0A1230]">
                        Automated Verification Checks
                      </h3>
                      {unresolvedHigh.length > 0 && (
                        <span className="text-[#B91C1C] font-bold text-xs flex items-center gap-1 bg-[#FEE2E2] px-2.5 py-1 rounded-full border border-[#B91C1C]/20">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {unresolvedHigh.length} High-Severity Blocker(s)
                        </span>
                      )}
                    </div>

                    {findings.length === 0 ? (
                      <div className="p-5 bg-[#D1FAE5]/60 border border-[#065F46]/20 rounded-xl text-[14px] text-[#065F46] font-medium flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#065F46] flex-shrink-0" />
                        <div>
                          <strong className="block font-bold">No findings, clean draft</strong>
                          <span>Zero violations detected. Content is 100% compliant with active brand rules and verified facts.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {findings.map((f) => {
                          let badgeBg = 'bg-[#EDE9FE] text-[#6D28D9] border-[#6D28D9]/20';
                          let labelText = 'Needs human review';
                          if (f.severity === 'high') {
                            badgeBg = 'bg-[#FEE2E2] text-[#B91C1C] border-[#B91C1C]/20';
                            labelText = 'Verified rule violation';
                          } else if (f.severity === 'medium') {
                            badgeBg = 'bg-[#FEF3C7] text-[#B45309] border-[#B45309]/20';
                            labelText = 'Source-backed concern';
                          }

                          return (
                            <div key={f.id} className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E6DDC8] text-xs">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${badgeBg}`}>
                                    {labelText}
                                  </span>
                                  <span className="font-bold text-[#0A1230] text-[14px]">{f.title}</span>
                                </div>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-[#E6DDC8] text-[#5B6478]">
                                  {f.status}
                                </span>
                              </div>
                              <p className="text-[#2B3345] italic text-[14px] bg-white p-2.5 rounded-lg border border-[#E6DDC8]/60">
                                "{f.quote}"
                              </p>
                              <p className="text-[#5B6478] mt-2 text-[13px] leading-relaxed">{f.explanation}</p>
                              {f.source_excerpt && (
                                <p className="text-[12px] text-[#8A6A00] mt-1 font-mono">
                                  Policy: {f.source_excerpt}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Historical Review Decisions */}
                  {detail.decisions?.length > 0 && (
                    <div className="bg-white rounded-[14px] border border-[#E6DDC8] p-6 shadow-[0_1px_2px_rgba(10,18,48,0.06)] text-xs">
                      <h3 className="font-serif text-lg font-bold text-[#0A1230] mb-3">
                        Decision Audit Trail
                      </h3>
                      <div className="space-y-3">
                        {detail.decisions.map((d) => (
                          <div key={d.id} className="p-3.5 bg-[#FAF8F3] rounded-xl border border-[#E6DDC8]">
                            <div className="flex items-center justify-between mb-1 font-semibold">
                              <span className={`uppercase text-[11px] font-bold ${
                                d.decision === 'approve' ? 'text-[#065F46]' : 'text-[#B91C1C]'
                              }`}>
                                Decision: {d.decision}
                              </span>
                              <span className="font-mono text-[11px] text-[#5B6478]">
                                Hash: {d.content_hash?.slice(0, 8)}...
                              </span>
                            </div>
                            <p className="text-[#2B3345] italic text-[13px]">"{d.reason || 'No comments specified.'}"</p>
                            <span className="text-[12px] text-[#5B6478] block mt-1">
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
                  
                  {/* Review Decision Card (Sign-off Panel) */}
                  <div className="bg-white rounded-[14px] border border-[#E6DDC8] p-6 shadow-[0_1px_2px_rgba(10,18,48,0.06),0_8px_24px_rgba(10,18,48,0.06)] text-xs">
                    <h3 className="font-serif text-lg font-bold text-[#0A1230] mb-1">Reviewer Sign-off</h3>
                    <p className="text-[13px] text-[#5B6478] mb-4">
                      Current Persona: <strong className="text-[#0A1230] font-semibold">{role.toUpperCase()}</strong>
                    </p>

                    {/* Non-Reviewer Banner with One-Click Role Switch */}
                    {!isReviewerOrAdmin && (
                      <div className="p-3.5 bg-[#FEF3C7] rounded-xl border border-[#B45309]/30 text-[#B45309] mb-4">
                        <p className="font-semibold text-xs mb-2">
                          You are acting as Content creator. Switch to Authorised reviewer to sign off.
                        </p>
                        <button
                          type="button"
                          onClick={handleSwitchToReviewerRole}
                          className="w-full py-2 px-3 rounded-lg bg-[#0A1230] text-white hover:bg-[#0A1230]/90 font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Switch to Authorised Reviewer</span>
                        </button>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="font-semibold text-[#0A1230] text-[13px] block mb-1">
                          Decision Notes / Required Reason <span className="text-[#B91C1C]">*</span>
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Provide specific feedback or record mandatory audit reason..."
                          value={decisionReason}
                          onChange={(e) => setDecisionReason(e.target.value)}
                          className="w-full p-3 rounded-xl border border-[#E6DDC8] text-[14px] text-[#2B3345] placeholder-[#6B7280] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                        />
                      </div>

                      {/* Override Checkbox if high-severity items are open */}
                      {unresolvedHigh.length > 0 && (
                        <div className="p-3.5 bg-[#FEF3C7] rounded-xl border border-[#B45309]/30 text-[#B45309]">
                          <label className="flex items-start gap-2 cursor-pointer font-bold text-xs">
                            <input
                              type="checkbox"
                              checked={overrideUsed}
                              onChange={(e) => setOverrideUsed(e.target.checked)}
                              className="mt-0.5 rounded text-[#D4AF37] focus:ring-[#D4AF37]"
                            />
                            <span>Authorize Compliance Override</span>
                          </label>

                          {overrideUsed && (
                            <input
                              type="text"
                              placeholder="Mandatory override audit explanation..."
                              value={overrideReason}
                              onChange={(e) => setOverrideReason(e.target.value)}
                              className="mt-2 w-full p-2.5 rounded-lg border border-[#B45309]/40 text-xs bg-white text-[#2B3345]"
                              required
                            />
                          )}
                        </div>
                      )}

                      {/* Concurrency Conflict Banner (409) */}
                      {conflictError && (
                        <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#DC2626]/40 text-xs text-[#991B1B] space-y-2">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                            <div>
                              <strong className="block font-bold">Version Conflict Detected (409)</strong>
                              <span>{conflictError}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              setConflictError(null);
                              await loadData(currentSubId);
                            }}
                            className="w-full py-1.5 px-2.5 rounded-lg bg-[#991B1B] text-white font-semibold text-xs hover:bg-[#7F1D1D] transition-colors"
                          >
                            Reload Latest Version
                          </button>
                        </div>
                      )}

                      {/* Action Buttons: Approve, Request Changes, Reject */}
                      <div className="space-y-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleDecision('approve')}
                          disabled={
                            actionLoading || 
                            !decisionReason.trim() ||
                            !isReviewerOrAdmin ||
                            (unresolvedHigh.length > 0 && (!overrideUsed || !overrideReason.trim()))
                          }
                          className="w-full py-3 rounded-xl font-bold text-sm text-[#0A1230] transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95"
                          style={{
                            background: 'linear-gradient(135deg, #F3D98B, #D4AF37 50%, #A67C00)'
                          }}
                          title={
                            !isReviewerOrAdmin 
                              ? 'Switch to Reviewer role to sign off' 
                              : !decisionReason.trim() 
                                ? 'Decision note is required'
                                : 'Approve current version'
                          }
                        >
                          <CheckCircle className="w-4 h-4 text-[#0A1230]" />
                          <span>Approve Version {activeVersion?.version_number}</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleDecision('request_changes')}
                            disabled={actionLoading || !decisionReason.trim() || !isReviewerOrAdmin}
                            className="py-2.5 rounded-xl bg-white border border-[#0A1230] text-[#0A1230] hover:bg-[#FAF8F3] font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            title={!decisionReason.trim() ? "Decision note required" : "Request changes"}
                          >
                            Request Changes
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDecision('reject')}
                            disabled={actionLoading || !decisionReason.trim() || !isReviewerOrAdmin}
                            className="py-2.5 rounded-xl bg-[#FEE2E2] text-[#B91C1C] hover:bg-[#FEE2E2]/80 border border-[#B91C1C]/40 font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            title={!decisionReason.trim() ? "Decision note required" : "Reject draft"}
                          >
                            Reject
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Comments Thread */}
                  <div className="bg-white rounded-[14px] border border-[#E6DDC8] p-6 shadow-[0_1px_2px_rgba(10,18,48,0.06)] text-xs flex flex-col h-[360px]">
                    <h3 className="font-serif text-base font-bold text-[#0A1230] mb-3 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-[#8A6A00]" />
                      <span>Review Thread</span>
                    </h3>

                    <div className="flex-grow overflow-y-auto space-y-3 pr-1 mb-4">
                      {detail.comments?.length === 0 ? (
                        <p className="text-[#5B6478] italic text-center py-8">No comments yet. Start the conversation below.</p>
                      ) : (
                        detail.comments.map((c) => (
                          <div key={c.id} className="p-3 bg-[#FAF8F3] rounded-xl border border-[#E6DDC8]">
                            <div className="flex items-center justify-between font-medium mb-1">
                              <span className="font-bold text-[#0A1230]">{c.user_name}</span>
                              <span className="text-[10px] text-[#5B6478]">
                                {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[#2B3345]">{c.comment_text}</p>
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
                        className="flex-grow px-3 py-2 rounded-xl border border-[#E6DDC8] text-xs text-[#2B3345] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={commentLoading || !commentText.trim()}
                        className="p-2.5 rounded-xl bg-[#0A1230] text-[#D4AF37] hover:bg-[#0A1230]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Send comment"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                </div>

              </div>
            </div>
          )}
        </>
      )}

      {/* =========================================================
          TAB 2: SUBMISSION HISTORY & AUDIT LEDGER (Integrated into Review Centre)
          ========================================================= */}
      {mainTab === 'history' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between border-b border-[#E6DDC8] pb-3">
            <div className="flex gap-2">
              <button
                onClick={() => setHistorySubTab('submissions')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  historySubTab === 'submissions'
                    ? 'bg-[#0A1230] text-white'
                    : 'text-[#5B6478] hover:text-[#0A1230]'
                }`}
              >
                Submissions ({allSubmissions.length})
              </button>
              <button
                onClick={() => setHistorySubTab('audit')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  historySubTab === 'audit'
                    ? 'bg-[#0A1230] text-white'
                    : 'text-[#5B6478] hover:text-[#0A1230]'
                }`}
              >
                Full Audit Ledger ({auditEvents.length})
              </button>
            </div>

            {historySubTab === 'submissions' && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#5B6478] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search title or campaign..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-[#E6DDC8] text-xs w-60 text-[#2B3345] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            )}
          </div>

          {/* Submissions Sub-Tab */}
          {historySubTab === 'submissions' && (
            <div className="bg-white rounded-[14px] border border-[#E6DDC8] shadow-[0_1px_2px_rgba(10,18,48,0.06)] overflow-hidden">
              {filteredSubs.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#5B6478]">No matching submissions found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[15px]">
                    <thead className="bg-[#FAF8F3] text-[13px] font-semibold uppercase tracking-wider text-[#5B6478] border-b border-[#E6DDC8]">
                      <tr>
                        <th className="px-6 py-3.5">Title</th>
                        <th className="px-6 py-3.5">Type</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5">Versions</th>
                        <th className="px-6 py-3.5">Findings</th>
                        <th className="px-6 py-3.5">Created</th>
                        <th className="px-6 py-3.5 text-right">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6DDC8]/60 font-sans text-[#2B3345]">
                      {filteredSubs.map((sub) => (
                        <tr
                          key={sub.id}
                          onClick={() => {
                            setCurrentSubId(sub.id);
                            loadData(sub.id);
                            setMainTab('review');
                          }}
                          className="hover:bg-[#F6F1E7]/40 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4">
                            <span className="font-semibold text-[#0A1230] block">{sub.title}</span>
                            <span className="text-xs text-[#5B6478]">{sub.campaign || 'General'}</span>
                          </td>
                          <td className="px-6 py-4 capitalize text-xs text-[#2B3345]">
                            {sub.content_type}
                          </td>
                          <td className="px-6 py-4">
                            <StatusChip status={sub.status} />
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-[#5B6478]">
                            v{sub.version_count || 1}
                          </td>
                          <td className="px-6 py-4 text-xs font-medium">
                            {sub.findings_count > 0 ? (
                              <span className="text-[#B91C1C] font-semibold">{sub.findings_count} findings</span>
                            ) : (
                              <span className="text-[#065F46] font-semibold">Clean</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs text-[#5B6478]">
                            {new Date(sub.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-xs font-bold text-[#8A6A00] flex items-center justify-end gap-1">
                              View <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Audit Ledger Sub-Tab */}
          {historySubTab === 'audit' && (
            <div className="bg-white rounded-[14px] border border-[#E6DDC8] shadow-[0_1px_2px_rgba(10,18,48,0.06)] overflow-hidden">
              <div className="p-4 border-b border-[#E6DDC8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif font-bold text-[#0A1230] text-sm">System Audit Trail</h3>
                  <p className="text-xs text-[#5B6478]">Every submission creation, version snapshot, and review decision is cryptographically logged.</p>
                </div>
                <a
                  href="/api/audit/export.csv"
                  download="verity-workspace-audit-ledger.csv"
                  className="px-3.5 py-1.5 rounded-lg border border-[#E6DDC8] bg-white hover:bg-[#FAF8F3] text-[#0A1230] font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-[#8A6A00]" />
                  <span>Export Audit (CSV)</span>
                </a>
              </div>

              <div className="divide-y divide-[#E6DDC8]/60 text-xs">
                {auditEvents.length === 0 ? (
                  <div className="p-8 text-center text-sm text-[#5B6478]">No audit events logged yet.</div>
                ) : (
                  auditEvents.map((evt) => (
                    <div key={evt.id} className="p-4 hover:bg-[#FAF8F3] transition-colors flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0A1230] bg-[#FBF1CF] border border-[#8A6A00]/20 px-2 py-0.5 rounded">
                            {evt.event_type}
                          </span>
                          <span className="text-[#5B6478]">•</span>
                          <span className="font-semibold text-[#0A1230]">{evt.actor_name} ({evt.actor_role})</span>
                          {evt.version_number && (
                            <span className="font-mono text-[11px] bg-[#FAF8F3] text-[#5B6478] px-1.5 py-0.5 rounded border border-[#E6DDC8]">
                              v{evt.version_number}
                            </span>
                          )}
                        </div>
                        <pre className="text-[11px] text-[#2B3345] font-mono bg-[#FAF8F3] p-2.5 rounded-lg mt-1 overflow-x-auto max-w-2xl border border-[#E6DDC8]">
                          {JSON.stringify(evt.details, null, 2)}
                        </pre>
                      </div>
                      <div className="text-right text-[#5B6478] whitespace-nowrap text-[11px]">
                        <Clock className="w-3.5 h-3.5 inline mr-1" />
                        {evt.timestamp ? new Date(evt.timestamp).toLocaleString() : ''}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
