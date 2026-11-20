import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ArrowRight, ArrowLeft, X, 
  Building2, BookOpen, Shield, Upload
} from 'lucide-react';

export function OnboardingWizard({ isOpen, onClose, setActivePage }) {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/75 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 animate-fadeIn relative">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-ink">
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className="font-semibold text-gold uppercase tracking-wider">Onboarding Wizard • Step {step} of {totalSteps}</span>
            <button
              onClick={() => {
                onClose();
                setActivePage('new-review');
              }}
              className="text-gold font-bold hover:underline"
            >
              Use Verity Learning Demo Brand ➔
            </button>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gold h-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold/20 text-gold flex items-center justify-center font-serif text-xl font-bold">
              V
            </div>
            <h2 className="font-serif text-2xl font-bold text-ink">Welcome to VERITY</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              VERITY establishes an intelligent pre-publication boundary around your organisation's content. Every statement is checked against your approved facts and voice guidelines before public release.
            </p>
            <div className="p-4 bg-champagne/40 rounded-xl border border-gold/30 text-xs text-ink space-y-1">
              <span className="font-bold block">What you will configure:</span>
              <p>1. Organisation identity & audience</p>
              <p>2. Editorial voice and prohibited claim rules</p>
              <p>3. Approved factual knowledge base</p>
            </div>
          </div>
        )}

        {/* STEP 2: ORGANISATION */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <h2 className="font-serif text-2xl font-bold text-ink">Organisation & Identity</h2>
            <p className="text-gray-600">Enter the primary company, educational institution, or brand identity to govern.</p>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Company / Brand Name</label>
              <input
                type="text"
                defaultValue="Verity Learning"
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-bold text-ink"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Tagline / Mission</label>
              <input
                type="text"
                defaultValue="Consistent. Compliant. Trustworthy."
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs text-ink"
              />
            </div>
          </div>
        )}

        {/* STEP 3: AUDIENCE & VOICE */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <h2 className="font-serif text-2xl font-bold text-ink">Audience & Voice Standards</h2>
            <p className="text-gray-600">Establish the tone parameters enforced by Layer 1 deterministic rules.</p>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Primary Audience</label>
              <input
                type="text"
                defaultValue="Learners, parents, and institutional partners"
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs text-ink"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Tone Attributes</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {['Professional', 'Trustworthy', 'Helpful', 'Objective', 'Inclusive'].map((t, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-mist border border-gray-300 text-ink font-medium">
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: TERMINOLOGY */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <h2 className="font-serif text-2xl font-bold text-ink">Approved Terminology Glossary</h2>
            <p className="text-gray-600">Map prohibited colloquialisms to standard institutional terminology.</p>

            <div className="p-3 bg-mist rounded-xl border border-gray-200 space-y-2">
              <div className="flex items-center justify-between text-[11px] pb-1 border-b border-gray-200 font-semibold text-gray-600">
                <span>Avoid</span>
                <span>➔</span>
                <span>Prefer</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-coral bg-coral/15 border-b border-coral/50 px-1.5 py-0.5 rounded font-mono inline-flex items-center gap-1">
                  <span aria-hidden="true" className="font-bold text-[10px]">−</span>
                  <span>"users"</span>
                </span>
                <span className="text-gray-400">➔</span>
                <span className="text-teal bg-teal/15 border-b border-teal/50 px-1.5 py-0.5 rounded font-mono font-bold inline-flex items-center gap-1">
                  <span aria-hidden="true" className="font-bold text-[10px]">+</span>
                  <span>"learners"</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-coral bg-coral/15 border-b border-coral/50 px-1.5 py-0.5 rounded font-mono inline-flex items-center gap-1">
                  <span aria-hidden="true" className="font-bold text-[10px]">−</span>
                  <span>"classes"</span>
                </span>
                <span className="text-gray-400">➔</span>
                <span className="text-teal bg-teal/15 border-b border-teal/50 px-1.5 py-0.5 rounded font-mono font-bold inline-flex items-center gap-1">
                  <span aria-hidden="true" className="font-bold text-[10px]">+</span>
                  <span>"courses"</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-coral bg-coral/15 border-b border-coral/50 px-1.5 py-0.5 rounded font-mono inline-flex items-center gap-1">
                  <span aria-hidden="true" className="font-bold text-[10px]">−</span>
                  <span>"guys" (slang)</span>
                </span>
                <span className="text-gray-400">➔</span>
                <span className="text-teal bg-teal/15 border-b border-teal/50 px-1.5 py-0.5 rounded font-mono font-bold inline-flex items-center gap-1">
                  <span aria-hidden="true" className="font-bold text-[10px]">+</span>
                  <span>"everyone"</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: APPROVED FACTS */}
        {step === 5 && (
          <div className="space-y-4 text-xs">
            <h2 className="font-serif text-2xl font-bold text-ink">Approved Factual Grounding</h2>
            <p className="text-gray-600">
              Only claims backed by these approved facts can pass Layer 2 review. Missing facts will explicitly return: <strong>"No approved supporting evidence found."</strong>
            </p>

            <div className="space-y-2">
              <div className="p-2.5 bg-mist rounded-lg border border-gray-200">
                <span className="font-mono font-bold text-gold">F-01:</span> "The platform supports online learning."
              </div>
              <div className="p-2.5 bg-mist rounded-lg border border-gray-200">
                <span className="font-mono font-bold text-gold">F-02:</span> "Verity Learning offers live and recorded classes."
              </div>
              <div className="p-2.5 bg-mist rounded-lg border border-gray-200">
                <span className="font-mono font-bold text-gold">F-03:</span> "Learners can track their progress in a dashboard."
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: COMPLETE */}
        {step === 6 && (
          <div className="space-y-4 text-center py-4">
            <CheckCircle2 className="w-14 h-14 text-teal mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-ink">Brand Knowledge Hub Ready</h2>
            <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
              Your brand profile, deterministic rules, approved facts, and visual identity are fully initialized in the database.
            </p>
            <button
              onClick={() => {
                onClose();
                setActivePage('new-review');
              }}
              className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-light text-midnight font-bold text-xs shadow-glow transition-all"
            >
              Start Reviewing Content Now
            </button>
          </div>
        )}

        {/* Navigation Toolbar */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100 text-xs">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-mist flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps && (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-light text-midnight font-bold flex items-center gap-1 shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

