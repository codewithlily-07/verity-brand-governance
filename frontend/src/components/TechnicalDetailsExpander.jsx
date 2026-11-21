import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu } from 'lucide-react';

export function TechnicalDetailsExpander({ title = "Technical details", children, defaultOpen = false, isLight = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`mt-3 pt-3 border-t ${isLight ? 'border-[#F3EAD3]' : 'border-[#101B35]'}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 text-sm font-sans transition-colors text-left py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#E2B857] rounded ${
          isLight ? 'text-[#8A6A24] hover:text-[#14203D]' : 'text-[#E2B857] hover:text-[#FAF8F2]'
        }`}
        aria-expanded={isOpen}
      >
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <Cpu className="w-4 h-4" />
          <span>{title}</span>
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div 
          className={`mt-2 p-3.5 rounded-xl text-sm font-sans leading-relaxed space-y-1.5 animate-fadeIn ${
            isLight 
              ? 'bg-[#F3EAD3]/60 text-[#14203D] border border-[#E2B857]/30' 
              : 'bg-[#101B35] text-[#D5DBEE] border border-[#F3EAD3]/20'
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

