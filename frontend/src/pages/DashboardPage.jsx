import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, CheckCircle, AlertTriangle, Clock, ArrowRight,
  Shield, RefreshCw, XCircle, Play, Eye
} from 'lucide-react';
import { getSubmissions, runGuidedDemo } from '../lib/api';

export function StatusChip({ status }) {
  const s = status || 'Draft';
  switch (s) {
    case 'Draft':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[13px] font-medium bg-[#E5E7EB] text-[#374151]">
          <FileText className="w-3.5 h-3.5 text-[#374151]" />
          <span>Draft</span>
        </span>
      );
    case 'Submitted':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[13px] font-medium bg-[#FBF1CF] text-[#8A6A00]">
          <Clock className="w-3.5 h-3.5 text-[#8A6A00]" />
          <span>Submitted</span>
        </span>
      );
    case 'In Review':
    case 'in_review':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[13px] font-medium bg-[#EDE9FE] text-[#6D28D9]">
          <Clock className="w-3.5 h-3.5 text-[#6D28D9]" />
          <span>In review</span>
        </span>
      );
    case 'Changes Requested':
    case 'changes_requested':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[13px] font-medium bg-[#FEF3C7] text-[#B45309]">
          <AlertTriangle className="w-3.5 h-3.5 text-[#B45309]" />
          <span>Changes requested</span>
        </span>
      );
    case 'Resubmitted':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[13px] font-medium bg-[#CCFBF1] text-[#0F766E]">
          <RefreshCw className="w-3.5 h-3.5 text-[#0F766E]" />
          <span>Resubmitted</span>
        </span>
      );
    case 'Approved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[13px] font-medium bg-[#D1FAE5] text-[#065F46]">
          <CheckCircle className="w-3.5 h-3.5 text-[#065F46]" />
          <span>Approved</span>
        </span>
      );
    case 'Rejected':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[13px] font-medium bg-[#FEE2E2] text-[#B91C1C]">
          <XCircle className="w-3.5 h-3.5 text-[#B91C1C]" />
          <span>Rejected</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[13px] font-medium bg-[#E5E7EB] text-[#374151]">
          <span>{s}</span>
        </span>
      );
  }
}

export function DashboardPage({ setActivePage, setSelectedSubmissionId }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoMsg, setDemoMsg] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getSubmissions();
      setSubmissions(data || []);
    } catch (err) {
      console.error('Failed to load submissions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunDemo = async () => {
    setDemoLoading(true);
    setDemoMsg(null);
    try {
      const res = await runGuidedDemo();
      setDemoMsg(`Guided demo completed! Created ${res.submissions?.length || 4} sample reviews through real analysis pipeline.`);
      await loadData();
    } catch (err) {
      setDemoMsg(`Error launching demo: ${err.message}`);
    } finally {
      setDemoLoading(false);
    }
  };

  const total = submissions.length;
  const inReview = submissions.filter(s => ['In Review', 'Submitted', 'Resubmitted'].includes(s.status)).length;
  const approved = submissions.filter(s => s.status === 'Approved').length;
  const changesRequested = submissions.filter(s => s.status === 'Changes Requested').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Demonstration Workspace Banner */}
      <div className="bg-white rounded-[14px] border border-[#E6DDC8] p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_1px_2px_rgba(10,18,48,0.06),0_8px_24px_rgba(10,18,48,0.06)]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#F6F1E7] border border-[#E6DDC8] flex items-center justify-center text-[#D4AF37] flex-shrink-0">
            <Shield className="w-5 h-5 text-[#8A6A00]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-[#0A1230] text-base sm:text-lg">
                Demonstration Workspace: Verity Learning
              </h2>
              <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46] border border-[#065F46]/20">
                Active Test Brand
              </span>
            </div>
            <p className="text-[14px] text-[#5B6478] mt-0.5">
              Isolated judge session with seeded brand guidelines, rules R1–R7, and verified facts F-01–F-03.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleRunDemo}
            disabled={demoLoading}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#0A1230] hover:bg-[#F6F1E7] text-[#0A1230] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            title="Submit Samples A–D through the real analysis engine"
          >
            <Play className={`w-3.5 h-3.5 ${demoLoading ? 'animate-spin' : ''}`} />
            <span>{demoLoading ? 'Running Pipeline...' : 'Run Guided Demo'}</span>
          </button>

          <button
            onClick={() => setActivePage('new-review')}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-[#0A1230] transition-all flex items-center gap-1.5 shadow-sm hover:opacity-95"
            style={{
              background: 'linear-gradient(135deg, #F3D98B, #D4AF37 50%, #A67C00)'
            }}
          >
            <Plus className="w-4 h-4 text-[#0A1230]" />
            <span>Review New Content</span>
          </button>
        </div>
      </div>

      {demoMsg && (
        <div className="mb-6 p-4 rounded-xl bg-[#F6F1E7] border border-[#D4AF37]/50 text-xs text-[#0A1230] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#065F46]" />
            <span className="font-medium">{demoMsg}</span>
          </div>
          <button onClick={() => setDemoMsg(null)} className="text-[#5B6478] hover:text-[#0A1230] text-xs">Dismiss</button>
        </div>
      )}

      {/* How it works one-line strip */}
      <div className="bg-white rounded-[14px] border border-[#E6DDC8] px-5 py-3.5 mb-8 flex items-center justify-between text-xs text-[#5B6478] overflow-x-auto shadow-[0_1px_2px_rgba(10,18,48,0.04)]">
        <span className="font-bold text-[#0A1230] whitespace-nowrap">Governance Flow:</span>
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-4 h-4 rounded-full bg-[#F6F1E7] border border-[#E6DDC8] text-[#0A1230] flex items-center justify-center font-bold text-[10px]">1</span>
          Setup Brand Hub
        </span>
        <span className="text-[#E6DDC8]">→</span>
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-4 h-4 rounded-full bg-[#F6F1E7] border border-[#E6DDC8] text-[#0A1230] flex items-center justify-center font-bold text-[10px]">2</span>
          Submit Copy
        </span>
        <span className="text-[#E6DDC8]">→</span>
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-4 h-4 rounded-full bg-[#F6F1E7] border border-[#E6DDC8] text-[#0A1230] flex items-center justify-center font-bold text-[10px]">3</span>
          3-Layer Engine
        </span>
        <span className="text-[#E6DDC8]">→</span>
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-4 h-4 rounded-full bg-[#F6F1E7] border border-[#E6DDC8] text-[#0A1230] flex items-center justify-center font-bold text-[10px]">4</span>
          Evidence & Diff
        </span>
        <span className="text-[#E6DDC8]">→</span>
        <span className="flex items-center gap-1.5 text-[#065F46] font-semibold whitespace-nowrap">
          <span className="w-4 h-4 rounded-full bg-[#D1FAE5] text-[#065F46] flex items-center justify-center font-bold text-[10px]">5</span>
          Human Approval
        </span>
      </div>

      {/* 4 Solid White Stat Cards with Coloured Left Border */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        
        {/* 1. Total Submissions */}
        <div className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] border-l-4 border-l-[#0A1230] shadow-[0_1px_2px_rgba(10,18,48,0.06),0_8px_24px_rgba(10,18,48,0.06)]">
          <span className="text-[14px] font-medium text-[#5B6478] block">Total submissions</span>
          <p className="font-serif text-[32px] leading-tight font-bold text-[#0A1230] mt-1.5">{total}</p>
          <span className="text-[13px] text-[#5B6478] mt-1 block">In workspace</span>
        </div>

        {/* 2. Awaiting Review */}
        <div className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] border-l-4 border-l-[#D97706] shadow-[0_1px_2px_rgba(10,18,48,0.06),0_8px_24px_rgba(10,18,48,0.06)]">
          <span className="text-[14px] font-medium text-[#5B6478] block">Awaiting review</span>
          <p className="font-serif text-[32px] leading-tight font-bold text-[#0A1230] mt-1.5">{inReview}</p>
          <span className="text-[13px] text-[#5B6478] mt-1 block">Needs reviewer decision</span>
        </div>

        {/* 3. Approved */}
        <div className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] border-l-4 border-l-[#065F46] shadow-[0_1px_2px_rgba(10,18,48,0.06),0_8px_24px_rgba(10,18,48,0.06)]">
          <span className="text-[14px] font-medium text-[#5B6478] block">Approved</span>
          <p className="font-serif text-[32px] leading-tight font-bold text-[#0A1230] mt-1.5">{approved}</p>
          <span className="text-[13px] text-[#5B6478] mt-1 block">Passed human sign-off</span>
        </div>

        {/* 4. Changes Requested */}
        <div className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] border-l-4 border-l-[#B91C1C] shadow-[0_1px_2px_rgba(10,18,48,0.06),0_8px_24px_rgba(10,18,48,0.06)]">
          <span className="text-[14px] font-medium text-[#5B6478] block">Changes requested</span>
          <p className="font-serif text-[32px] leading-tight font-bold text-[#0A1230] mt-1.5">{changesRequested}</p>
          <span className="text-[13px] text-[#5B6478] mt-1 block">Returned to creator</span>
        </div>

      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-[14px] border border-[#E6DDC8] shadow-[0_1px_2px_rgba(10,18,48,0.06),0_8px_24px_rgba(10,18,48,0.06)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E6DDC8] flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#0A1230]">Recent Content Reviews</h3>
            <p className="text-[14px] text-[#5B6478] mt-0.5">Click any submission to view evidence, inspect diffs, or execute review approvals.</p>
          </div>
          <button
            onClick={loadData}
            className="p-2 text-[#5B6478] hover:text-[#0A1230] rounded-lg transition-colors border border-transparent hover:border-[#E6DDC8]"
            title="Refresh submissions"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[15px] text-[#5B6478]">
            <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading submissions from database...
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F6F1E7] border border-[#E6DDC8] flex items-center justify-center mx-auto mb-3 text-[#D4AF37]">
              <FileText className="w-6 h-6 text-[#8A6A00]" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#0A1230] mb-1">No reviews yet</h4>
            <p className="text-[14px] text-[#5B6478] mb-5 max-w-md mx-auto">
              Submit a draft for pre-publication governance scanning or launch the guided test demo to evaluate the multi-layer pipeline.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleRunDemo}
                disabled={demoLoading}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#0A1230] hover:bg-[#F6F1E7] text-[#0A1230] text-xs font-semibold shadow-sm transition-all"
              >
                Run guided demo
              </button>
              <button
                onClick={() => setActivePage('new-review')}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-[#0A1230] shadow-sm transition-all"
                style={{
                  background: 'linear-gradient(135deg, #F3D98B, #D4AF37 50%, #A67C00)'
                }}
              >
                Run your first review
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[15px]">
              <thead className="bg-[#FAF8F3] text-[13px] font-semibold uppercase tracking-wider text-[#5B6478] border-b border-[#E6DDC8]">
                <tr>
                  <th className="px-6 py-3.5">Title & Campaign</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Versions</th>
                  <th className="px-6 py-3.5">Findings</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DDC8]/60 font-sans text-[#2B3345]">
                {submissions.map((sub) => {
                  return (
                    <tr 
                      key={sub.id} 
                      className="hover:bg-[#F6F1E7]/40 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedSubmissionId(sub.id);
                        setActivePage('review');
                      }}
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#0A1230] block text-[15px]">{sub.title}</span>
                        <span className="text-[13px] text-[#5B6478]">{sub.campaign || 'General'} • By {sub.author_name}</span>
                      </td>
                      <td className="px-6 py-4 capitalize text-[14px] text-[#2B3345]">
                        {sub.content_type}
                      </td>
                      <td className="px-6 py-4">
                        <StatusChip status={sub.status} />
                      </td>
                      <td className="px-6 py-4 text-[14px] font-mono text-[#5B6478]">
                        v{sub.version_count || 1}
                      </td>
                      <td className="px-6 py-4 text-[14px]">
                        {sub.findings_count > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#B91C1C]" title="High Severity" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" title="Medium Severity" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#4B5563]" title="Low Severity" />
                            <span className="font-semibold text-[#B91C1C] ml-1">
                              {sub.findings_count} {sub.findings_count === 1 ? 'finding' : 'findings'}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[13px] font-medium bg-[#D1FAE5] text-[#065F46]">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Clean</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubmissionId(sub.id);
                            setActivePage('review');
                          }}
                          className="px-3.5 py-1.5 rounded-lg border border-[#0A1230] bg-white hover:bg-[#F6F1E7] text-[#0A1230] font-semibold text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#0A1230]" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
