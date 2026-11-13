import React, { useState, useEffect } from 'react';
import { 
  FileText, ArrowRight, ShieldCheck, Clock, Download, 
  Search, Filter, CheckCircle2, AlertTriangle, Layers
} from 'lucide-react';
import { getSubmissions, getAuditTrail } from '../lib/api';

export function SubmissionHistoryPage({ setActivePage, setSelectedSubmissionId }) {
  const [submissions, setSubmissions] = useState([]);
  const [auditEvents, setAuditEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('submissions'); // submissions | audit
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [subs, audits] = await Promise.all([getSubmissions(), getAuditTrail()]);
      setSubmissions(subs);
      setAuditEvents(audits);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSubs = submissions.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    (s.campaign && s.campaign.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">Governance Compliance Ledger</span>
          <h1 className="font-serif text-3xl font-bold text-ink mt-1">Submission & Audit History</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Immutable version timeline, review decisions, and audit events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-white border border-gray-300 hover:bg-mist text-ink text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-gold" />
            <span>Export Compliance Report</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'submissions' ? 'bg-midnight text-ivory' : 'text-gray-600 hover:text-ink'
            }`}
          >
            Submissions ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'audit' ? 'bg-midnight text-ivory' : 'text-gray-600 hover:text-ink'
            }`}
          >
            Full Audit Ledger ({auditEvents.length})
          </button>
        </div>

        {activeTab === 'submissions' && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search title or campaign..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs w-56 focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
        )}
      </div>

      {/* SUBMISSIONS TAB */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-500">Loading history...</div>
          ) : filteredSubs.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">No matching submissions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-mist text-xs font-semibold uppercase tracking-wider text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Versions</th>
                    <th className="px-6 py-3">Findings</th>
                    <th className="px-6 py-3">Created</th>
                    <th className="px-6 py-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSubs.map((sub) => (
                    <tr
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubmissionId(sub.id);
                        setActivePage('results');
                      }}
                      className="hover:bg-mist/40 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-ink block">{sub.title}</span>
                        <span className="text-xs text-gray-400">{sub.campaign || 'General'}</span>
                      </td>
                      <td className="px-6 py-4 capitalize text-xs text-gray-600">
                        {sub.content_type}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          sub.status === 'Approved' ? 'bg-teal/15 text-teal' : 'bg-amber/15 text-amber-800'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">
                        v{sub.version_count}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium">
                        {sub.findings_count > 0 ? (
                          <span className="text-coral">{sub.findings_count} findings</span>
                        ) : (
                          <span className="text-teal">Clean</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-bold text-gold flex items-center justify-end gap-1">
                          View <ArrowRight className="w-3.5 h-3.5" />
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

      {/* AUDIT LEDGER TAB */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-ink text-sm">System Audit Trail</h3>
            <p className="text-xs text-gray-500">Every submission creation, version snapshot, and review decision is cryptographically logged.</p>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {auditEvents.map((evt) => (
              <div key={evt.id} className="p-4 hover:bg-mist/30 transition-colors flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-midnight bg-champagne px-2 py-0.5 rounded">
                      {evt.event_type}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="font-semibold text-ink">{evt.actor_name} ({evt.actor_role})</span>
                    {evt.version_number && (
                      <span className="font-mono text-[11px] bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded">
                        v{evt.version_number}
                      </span>
                    )}
                  </div>
                  <pre className="text-[11px] text-gray-600 font-mono bg-mist p-2 rounded-lg mt-1 overflow-x-auto max-w-2xl">
                    {JSON.stringify(evt.details, null, 2)}
                  </pre>
                </div>
                <div className="text-right text-gray-400 whitespace-nowrap text-[11px]">
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  {new Date(evt.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
