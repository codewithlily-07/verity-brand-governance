import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, CheckCircle, AlertTriangle, Clock, ArrowRight,
  Shield, RefreshCw, XCircle, Play, Eye, Search, Filter,
  CheckCircle2, Circle, ChevronLeft, ChevronRight, SlidersHorizontal, Check
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

  // Search, Filter, Sort & Pagination State with URL params sync
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'findings' | 'title'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Initialize filters from URL on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('search')) setSearchQuery(params.get('search') || '');
      if (params.has('status')) setStatusFilter(params.get('status') || 'all');
      if (params.has('type')) setTypeFilter(params.get('type') || 'all');
      if (params.has('sort')) setSortBy(params.get('sort') || 'newest');
      if (params.has('page')) setCurrentPage(parseInt(params.get('page'), 10) || 1);
    } catch (e) {}
  }, []);

  // Sync state to URL params
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (searchQuery) url.searchParams.set('search', searchQuery);
      else url.searchParams.delete('search');

      if (statusFilter !== 'all') url.searchParams.set('status', statusFilter);
      else url.searchParams.delete('status');

      if (typeFilter !== 'all') url.searchParams.set('type', typeFilter);
      else url.searchParams.delete('type');

      if (sortBy !== 'newest') url.searchParams.set('sort', sortBy);
      else url.searchParams.delete('sort');

      if (currentPage > 1) url.searchParams.set('page', currentPage.toString());
      else url.searchParams.delete('page');

      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  }, [searchQuery, statusFilter, typeFilter, sortBy, currentPage]);

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

  // Real-world Getting Started Checklist calculations
  const hasSubmissions = submissions.length > 0;
  const hasResolvedFindings = submissions.some(s => s.version_count > 1 || s.status === 'Approved' || s.status === 'Changes Requested');
  const hasApprovedReview = approved > 0;

  const checklistItems = [
    {
      id: 'brand_hub',
      title: 'Configure Brand Knowledge Hub',
      desc: 'Verify rules R1–R7 and institutional facts F-01–F-03 are loaded.',
      completed: true,
      action: () => setActivePage('brand-hub')
    },
    {
      id: 'submit_draft',
      title: 'Submit marketing copy for review',
      desc: 'Run draft through the 3-layer deterministic & retrieval pipeline.',
      completed: hasSubmissions,
      action: () => setActivePage('new-review')
    },
    {
      id: 'resolve_findings',
      title: 'Inspect evidence & resolve findings',
      desc: 'Verify claims against approved facts and create clean versions.',
      completed: hasResolvedFindings,
      action: () => {
        if (submissions.length > 0) {
          setSelectedSubmissionId(submissions[0].id);
          setActivePage('results');
        } else {
          setActivePage('new-review');
        }
      }
    },
    {
      id: 'approve_draft',
      title: 'Sign off with cryptographic SHA-256 seal',
      desc: 'Execute reviewer approval to record tamper-evident audit decision.',
      completed: hasApprovedReview,
      action: () => {
        if (submissions.length > 0) {
          setSelectedSubmissionId(submissions[0].id);
          setActivePage('review');
        } else {
          setActivePage('new-review');
        }
      }
    }
  ];

  const completedCount = checklistItems.filter(i => i.completed).length;
  const progressPercent = Math.round((completedCount / checklistItems.length) * 100);

  // Filtered & Sorted Submissions
  const filteredSubmissions = submissions.filter(s => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (s.title || '').toLowerCase().includes(q);
      const matchCampaign = (s.campaign || '').toLowerCase().includes(q);
      const matchAuthor = (s.author_name || '').toLowerCase().includes(q);
      if (!matchTitle && !matchCampaign && !matchAuthor) return false;
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'in_review' && !['In Review', 'Submitted', 'Resubmitted'].includes(s.status)) return false;
      if (statusFilter === 'approved' && s.status !== 'Approved') return false;
      if (statusFilter === 'changes_requested' && s.status !== 'Changes Requested') return false;
      if (statusFilter === 'rejected' && s.status !== 'Rejected') return false;
    }

    // Type filter
    if (typeFilter !== 'all' && (s.content_type || '').toLowerCase() !== typeFilter.toLowerCase()) {
      return false;
    }

    return true;
  });

  // Sort
  filteredSubmissions.sort((a, b) => {
    if (sortBy === 'newest') return (new Date(b.created_at || 0)) - (new Date(a.created_at || 0));
    if (sortBy === 'oldest') return (new Date(a.created_at || 0)) - (new Date(b.created_at || 0));
    if (sortBy === 'findings') return (b.findings_count || 0) - (a.findings_count || 0);
    if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage) || 1;
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Demonstration Workspace Banner */}
      <div className="bg-white rounded-[14px] border border-[#E6DDC8] p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
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

      {/* Getting Started Checklist Card */}
      <div className="bg-white rounded-2xl border border-[#D4AF37]/40 p-6 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#E6DDC8]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8A6A00]">Evaluation Milestones</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FAF8F3] border border-[#D4AF37]/40 font-bold text-[#0A1230]">
                {completedCount} / {checklistItems.length} Complete ({progressPercent}%)
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0A1230] mt-0.5">Getting Started with Pre-Publication Governance</h3>
          </div>

          <div className="w-full sm:w-48 bg-[#FAF8F3] rounded-full h-2.5 overflow-hidden border border-[#E6DDC8]">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#065F46] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {checklistItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={item.action}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                item.completed
                  ? 'bg-[#F0FDF4] border-[#065F46]/30 hover:border-[#065F46]'
                  : 'bg-white border-[#E6DDC8] hover:border-[#D4AF37]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-[#5B6478] font-semibold">Step {idx + 1}</span>
                  {item.completed ? (
                    <span className="inline-flex items-center gap-1 text-[#065F46] font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#8A6A00] font-medium text-[11px]">
                      <Circle className="w-3 h-3" /> Pending
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-[#0A1230] text-sm mb-1">{item.title}</h4>
                <p className="text-[#5B6478] leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#E6DDC8]/60 flex items-center justify-between text-[11px] font-semibold text-[#8A6A00]">
                <span>{item.completed ? 'Review Step' : 'Execute Step'}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] border-l-4 border-l-[#0A1230] shadow-sm">
          <span className="text-[14px] font-medium text-[#5B6478] block">Total submissions</span>
          <p className="font-serif text-[32px] leading-tight font-bold text-[#0A1230] mt-1.5">{total}</p>
          <span className="text-[13px] text-[#5B6478] mt-1 block">In workspace</span>
        </div>

        <div className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] border-l-4 border-l-[#D97706] shadow-sm">
          <span className="text-[14px] font-medium text-[#5B6478] block">Awaiting review</span>
          <p className="font-serif text-[32px] leading-tight font-bold text-[#0A1230] mt-1.5">{inReview}</p>
          <span className="text-[13px] text-[#5B6478] mt-1 block">Needs reviewer decision</span>
        </div>

        <div className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] border-l-4 border-l-[#065F46] shadow-sm">
          <span className="text-[14px] font-medium text-[#5B6478] block">Approved</span>
          <p className="font-serif text-[32px] leading-tight font-bold text-[#0A1230] mt-1.5">{approved}</p>
          <span className="text-[13px] text-[#5B6478] mt-1 block">Passed human sign-off</span>
        </div>

        <div className="bg-white rounded-[14px] p-5 border border-[#E6DDC8] border-l-4 border-l-[#B91C1C] shadow-sm">
          <span className="text-[14px] font-medium text-[#5B6478] block">Changes requested</span>
          <p className="font-serif text-[32px] leading-tight font-bold text-[#0A1230] mt-1.5">{changesRequested}</p>
          <span className="text-[13px] text-[#5B6478] mt-1 block">Returned to creator</span>
        </div>
      </div>

      {/* Submissions Section with Search, Filters & Pagination */}
      <div className="bg-white rounded-[14px] border border-[#E6DDC8] shadow-sm overflow-hidden">
        
        {/* Header & Filter Controls */}
        <div className="p-5 border-b border-[#E6DDC8] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0A1230]">Content Governance Reviews</h3>
              <p className="text-[14px] text-[#5B6478] mt-0.5">
                Inspect evidence ledgers, verify diffs, or execute review approvals.
              </p>
            </div>
            <button
              onClick={loadData}
              className="p-2 text-[#5B6478] hover:text-[#0A1230] rounded-lg transition-colors border border-transparent hover:border-[#E6DDC8] self-start sm:self-center"
              title="Refresh submissions"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar & Filter Pills */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 flex-grow max-w-md">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 text-[#5B6478] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reviews by title, campaign, or author..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E6DDC8] bg-white text-[#0A1230] text-xs focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-[#FAF8F3] p-1 rounded-xl border border-[#E6DDC8]">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'in_review', label: 'In Review' },
                  { id: 'approved', label: 'Approved' },
                  { id: 'changes_requested', label: 'Changes' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setStatusFilter(s.id); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      statusFilter === s.id
                        ? 'bg-[#0A1230] text-white shadow-sm'
                        : 'text-[#5B6478] hover:text-[#0A1230]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Channel / Type Dropdown */}
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-1.5 rounded-xl border border-[#E6DDC8] bg-white text-[#2B3345] text-xs font-medium focus:ring-1 focus:ring-[#D4AF37]"
              >
                <option value="all">All Channels</option>
                <option value="social">Social</option>
                <option value="ad">Ad Copy</option>
                <option value="email">Email</option>
                <option value="press">Press Release</option>
                <option value="website">Website</option>
                <option value="document">Document</option>
              </select>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="px-3 py-1.5 rounded-xl border border-[#E6DDC8] bg-white text-[#2B3345] text-xs font-medium focus:ring-1 focus:ring-[#D4AF37]"
              >
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="findings">Sort: Most Findings</option>
                <option value="title">Sort: Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[15px] text-[#5B6478]">
            <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading submissions from database...
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F6F1E7] border border-[#E6DDC8] flex items-center justify-center mx-auto mb-3 text-[#D4AF37]">
              <FileText className="w-6 h-6 text-[#8A6A00]" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#0A1230] mb-1">
              {searchQuery || statusFilter !== 'all' ? 'No matching reviews found' : 'No reviews yet'}
            </h4>
            <p className="text-[14px] text-[#5B6478] mb-5 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search criteria or clear active filters.'
                : 'Submit a draft for pre-publication governance scanning or launch the guided test demo to evaluate the multi-layer pipeline.'}
            </p>
            {searchQuery || statusFilter !== 'all' ? (
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); setTypeFilter('all'); }}
                className="px-4 py-2 rounded-xl bg-white border border-[#0A1230] text-[#0A1230] font-semibold text-xs"
              >
                Clear all filters
              </button>
            ) : (
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
            )}
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
                {paginatedSubmissions.map((sub) => {
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
                          className="px-3.5 py-1.5 rounded-lg border border-[#0A1230] bg-white hover:bg-[#F6F1E7] text-[#0A1230] font-semibold text-xs transition-colors inline-flex items-center gap-1 shadow-sm cursor-pointer"
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-[#E6DDC8] bg-[#FAF8F3] flex items-center justify-between text-xs text-[#5B6478]">
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSubmissions.length)} of {filteredSubmissions.length} reviews
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-[#E6DDC8] bg-white hover:bg-[#FAF8F3] disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-[#0A1230]">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-[#E6DDC8] bg-white hover:bg-[#FAF8F3] disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
