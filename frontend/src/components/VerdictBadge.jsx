import React from 'react';
import { AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export function SeverityBadge({ severity }) {
  const sev = (severity || 'medium').toLowerCase();
  if (sev === 'high') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-coral/10 text-coral border border-coral/30">
        <span aria-hidden="true" className="font-bold text-[13px]">▲</span>
        <span>High Severity</span>
      </span>
    );
  }
  if (sev === 'medium') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber/15 text-amber-800 border border-amber/30">
        <span aria-hidden="true" className="font-bold text-[13px]">◆</span>
        <span>Medium Severity</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky/15 text-sky-800 border border-sky/30">
      <span aria-hidden="true" className="font-bold text-[14px]">●</span>
      <span>Low Severity</span>
    </span>
  );
}

export function VerdictBadge({ verdict }) {
  const v = (verdict || 'needs_human_review').toLowerCase();
  if (v === 'verified_rule_violation') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-coral/10 text-coral border border-coral/20">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Verified rule violation</span>
      </span>
    );
  }
  if (v === 'source_backed_concern') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber/15 text-amber-800 border border-amber/25">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Source-backed concern</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-sky/15 text-sky-800 border border-sky/25">
      <HelpCircle className="w-3.5 h-3.5" />
      <span>Needs human review</span>
    </span>
  );
}
