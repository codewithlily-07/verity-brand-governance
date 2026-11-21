import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft, X, Sparkles } from 'lucide-react';

export function GuidedTourModal({ activePage, setActivePage, isPublicPage = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Do not auto-popup over public marketing / landing pages
    if (isPublicPage) return;
    try {
      const completed = localStorage.getItem('verity_tour_completed');
      if (!completed) {
        setIsOpen(true);
      }
    } catch (e) {}
  }, [isPublicPage]);

  // Listen for custom event to trigger tour anytime
  useEffect(() => {
    const handleTriggerTour = () => {
      setStep(0);
      setIsOpen(true);
    };
    window.addEventListener('verity_trigger_tour', handleTriggerTour);
    return () => window.removeEventListener('verity_trigger_tour', handleTriggerTour);
  }, []);

  // Escape key closes tour
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const steps = [
    {
      title: 'Brand Knowledge Hub',
      badge: 'Step 1 of 4: Setup & Rules',
      icon: BookOpen,
      page: 'brand-hub',
      desc: 'Define institutional rules R1–R7, approved facts F-01–F-03, and brand voice guidelines. The 3-layer engine enforces these rules automatically.',
      tip: 'You can test any rule interactively or export/import your complete Brand Kit in JSON.'
    },
    {
      title: 'Submit Content for Analysis',
      badge: 'Step 2 of 4: Intake & Pipeline',
      icon: FileText,
      page: 'new-review',
      desc: 'Paste drafts or upload PDF/DOCX files. The engine runs deterministic regex checks, vector fact retrieval, and validated AI contextual analysis.',
      tip: 'Drafts autosave automatically, and channel-specific hints guide your copy.'
    },
    {
      title: 'Inspect Findings & Intent Diffs',
      badge: 'Step 3 of 4: Transparent Evidence',
      icon: ShieldCheck,
      page: 'results',
      desc: 'Review findings with cited guidelines and supporting facts. Gold refinement transforms flagged copy, and safe fixes can be applied with one-click undo.',
      tip: 'Examine the Evidence Ledger to verify supporting citations for every claim.'
    },
    {
      title: 'Cryptographic Reviewer Approval',
      badge: 'Step 4 of 4: Tamper-Evident Sign-off',
      icon: CheckCircle2,
      page: 'review',
      desc: 'Authorized reviewers evaluate exact content drafts stamped with SHA-256 hashes. Concurrency conflicts (409) and override reasons are strictly audited.',
      tip: 'Download complete tamper-evident audit trails as CSV or executive PDF reports.'
    }
  ];

  const handleClose = () => {
    try {
      localStorage.setItem('verity_tour_completed', 'true');
    } catch (e) {}
    setIsOpen(false);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      setActivePage(steps[nextStep].page);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      const prevStep = step - 1;
      setStep(prevStep);
      setActivePage(steps[prevStep].page);
    }
  };

  if (!isOpen) return null;

  const current = steps[step];
  const Icon = current.icon;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#D4AF37]/50 text-xs text-[#0A1230]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6DDC8]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8A6A00]" />
            <span className="font-semibold uppercase tracking-wider text-[#8A6A00] text-[11px]">
              {current.badge}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-[#5B6478] hover:text-[#0A1230] p-1 cursor-pointer"
            title="Skip tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="py-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF8F3] border border-[#D4AF37]/40 flex items-center justify-center text-[#8A6A00] mx-auto mb-4 shadow-sm">
            <Icon className="w-7 h-7 text-[#0A1230]" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#0A1230] mb-2">
            {current.title}
          </h3>
          <p className="text-[#5B6478] text-[13px] leading-relaxed max-w-md mx-auto mb-4">
            {current.desc}
          </p>
          <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#E6DDC8] text-[11px] text-[#2B3345] max-w-md mx-auto italic">
            <strong>Pro-tip:</strong> {current.tip}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-[#0A1230]' : 'w-2 bg-[#E6DDC8]'
              }`}
            />
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E6DDC8]">
          <button
            type="button"
            onClick={handleClose}
            className="text-[#5B6478] hover:text-[#0A1230] font-semibold text-xs cursor-pointer"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-lg border border-[#E6DDC8] text-[#2B3345] hover:bg-[#FAF8F3] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg bg-[#0A1230] text-[#D4AF37] hover:bg-[#0A1230]/90 font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>{step === steps.length - 1 ? 'Finish Tour' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
