import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu } from 'lucide-react';

export function TechnicalDetailsExpander({ title = "Technical details", children, defaultOpen = false, isLight = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`mt-3 pt-3 border-t ${isLight ? 'border-gray-200' : 'border-gray-800'}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 text-xs font-mono transition-colors text-left py-1 cursor-pointer ${
          isLight ? 'text-[#8A5A12] hover:text-[#050A1F]' : 'text-[#D4AF37] hover:text-[#F3D98B]'
        }`}
        aria-expanded={isOpen}
      >
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <Cpu className="w-3.5 h-3.5" />
          <span>{title}</span>
        </span>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </button>

      {isOpen && (
        <div 
          className={`mt-2 p-3 rounded-xl text-xs font-mono leading-relaxed space-y-1.5 animate-fadeIn ${
            isLight 
              ? 'bg-[#EFE6D2]/60 text-[#121826] border border-[#D4AF37]/30' 
              : 'bg-[#05070F] text-[#9AA6C7] border border-gray-800'
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

