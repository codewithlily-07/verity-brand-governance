import React from 'react';

export function WordDiffView({ diffTokens }) {
  if (!diffTokens || !diffTokens.length) {
    return <span className="text-gray-500 italic">No diff data available</span>;
  }

  return (
    <div className="leading-relaxed text-sm p-4 bg-white rounded-xl border border-gray-200 font-sans shadow-inner">
      {diffTokens.map((token, idx) => {
        if (token.t === 'del') {
          return (
            <span key={idx} className="diff-del" title="Removed / Prohibited">
              <span className="sr-only">Removed: </span>
              <span aria-hidden="true" className="font-bold text-[11px] leading-none opacity-80 mr-0.5">−</span>
              <span>{token.v}</span>
            </span>
          );
        }
        if (token.t === 'add') {
          return (
            <span key={idx} className="diff-add" title="Added from Approved Guidelines">
              <span className="sr-only">Added: </span>
              <span aria-hidden="true" className="font-bold text-[11px] leading-none opacity-80 mr-0.5">+</span>
              <span>{token.v}</span>
            </span>
          );
        }
        return <span key={idx} className="diff-same">{token.v}</span>;
      })}
    </div>
  );
}

export function SideBySideDiff({ original, revised, diffTokens }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Original Copy (Preserved)</span>
          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-mono">v1</span>
        </div>
        <p className="text-sm leading-relaxed text-ink/90 whitespace-pre-wrap flex-grow">
          {original}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gold/30 p-4 shadow-sm flex flex-col">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-gold/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">Revised Intent-Preserving Copy</span>
          <span className="text-xs px-2 py-0.5 rounded bg-champagne text-ink font-mono font-medium">Proposed</span>
        </div>
        <div className="flex-grow">
          {diffTokens && diffTokens.length ? (
            <WordDiffView diffTokens={diffTokens} />
          ) : (
            <p className="text-sm leading-relaxed text-ink whitespace-pre-wrap">
              {revised}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

