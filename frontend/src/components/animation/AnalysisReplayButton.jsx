import React from 'react';
import { RotateCcw, Play, Pause } from 'lucide-react';

/**
 * Interactive animation controls toolbar allowing visitors to replay the sequence,
 * pause on interest, or jump directly to any of the 5 visual governance stages.
 */
export function AnalysisReplayButton({
  currentStage,
  setStage,
  isPaused,
  setIsPaused,
  onReplay,
}) {
  const stages = [
    { id: 0, label: '1. Brand Crest' },
    { id: 1, label: '2. Document' },
    { id: 2, label: '3. Laser Scan' },
    { id: 3, label: '4. Evidence Diff' },
    { id: 4, label: '5. Human Approval' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-navy-2/80 text-xs">
      {/* Replay and Play/Pause Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReplay}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold-light font-medium text-xs transition-colors shadow-sm active:scale-95"
          title="Replay from Scene 1"
        >
          <RotateCcw className="w-3.5 h-3.5 text-gold" />
          <span>Replay Analysis</span>
        </button>

        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-navy hover:bg-navy-2 border border-gray-700 text-gray-300 text-xs transition-colors"
          title={isPaused ? 'Resume auto-cycle' : 'Pause sequence'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 text-teal" /> : <Pause className="w-3.5 h-3.5 text-gold" />}
          <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
        </button>
      </div>

      {/* Stage Step Jumpers */}
      <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
        {stages.map((stg) => {
          const isActive = currentStage === stg.id;
          return (
            <button
              key={stg.id}
              type="button"
              onClick={() => {
                setStage(stg.id);
                setIsPaused(true);
              }}
              className={`px-2 py-1 rounded text-[10px] font-mono tracking-wide transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gold/20 text-gold border border-gold/60 font-bold shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-navy-2/60 border border-transparent'
              }`}
            >
              {stg.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

