import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, CheckCircle, Shield, ArrowRight, X } from 'lucide-react';
import { switchRole } from '../lib/api';

/**
 * RolePickerModal ("How do you want to explore Verity?")
 * - Premium ivory container (#FAF8F2)
 * - Deep navy role cards (#101B35) with champagne-gold accents (#E2B857)
 * - White headings, muted grey-blue descriptions (#D5DBEE)
 * - Equal card heights, hover lift, subtle gold borders
 * - Accessible: Esc key closes, Tab cycles, Enter selects
 */
export function RolePickerModal({ isOpen, onClose, onSelectPersona }) {
  // Escape key closes
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const roles = [
    {
      id: 'creator',
      title: 'Content Creator',
      eyebrow: 'Authoring & Drafting',
      page: 'new-review',
      role: 'creator',
      icon: PenTool,
      description: 'Draft marketing copy, run sub-15ms compliance reviews, and test intent-preserving inline fixes.',
      actionLabel: 'Enter as Creator'
    },
    {
      id: 'reviewer',
      title: 'Authorised Reviewer',
      eyebrow: 'Sign-Off Authority',
      page: 'review',
      role: 'reviewer',
      icon: CheckCircle,
      description: 'Evaluate side-by-side diffs, ungrounded claim blockers, and apply tamper-evident SHA-256 approval seals.',
      actionLabel: 'Enter as Reviewer'
    },
    {
      id: 'admin',
      title: 'Brand Administrator',
      eyebrow: 'Governance & Vault',
      page: 'brand-hub',
      role: 'admin',
      icon: Shield,
      description: 'Manage the brand vault: configure brand rules, approved corporate facts, terminology glossary, and team roles.',
      actionLabel: 'Enter as Admin'
    }
  ];

  const handleChoose = async (item) => {
    try {
      await switchRole(item.role);
    } catch (e) {
      console.warn('Local role switch notice:', e);
    }
    onSelectPersona(item.role, item.page);
    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-picker-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0A1226]/80 backdrop-blur-md"
        />

        {/* Modal Window: Warm Ivory (#FAF8F2) */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 12 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-[#FAF8F2] border border-[#E2B857]/40 rounded-3xl p-6 sm:p-10 shadow-2xl z-10 text-[#14203D]"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-[#4A5675] hover:text-[#0A1226] hover:bg-[#14203D]/10 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#E2B857]"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A5B18] font-sans">
              Role-Separated Governance
            </span>
            <h2 id="role-picker-title" className="font-serif text-3xl sm:text-4xl font-bold text-[#0A1226] mt-1.5 mb-2.5">
              How do you want to explore Verity?
            </h2>
            <p className="text-sm sm:text-base text-[#4A5675] leading-relaxed font-sans">
              Select a persona to jump directly into that role’s tailored workspace and experience true separation of authority.
            </p>
          </div>

          {/* 3 Persona Cards: Deep Midnight Navy (#101B35) on Ivory */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {roles.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleChoose(item)}
                  className="bg-[#101B35] rounded-2xl border border-[#E2B857]/30 hover:border-[#E2B857] p-6 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer group hover:-translate-y-1.5 text-left"
                >
                  <div>
                    {/* Top Row: Icon + Eyebrow */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-[#E2B857]/15 border border-[#E2B857]/40 text-[#E2B857] flex items-center justify-center transition-transform group-hover:scale-105">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[#D5DBEE]">
                        {item.eyebrow}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-xl font-bold text-[#FFFFFF] mb-2 group-hover:text-[#F3EAD3] transition-colors">
                      {item.title}
                    </h3>

                    {/* Secondary Description */}
                    <p className="text-xs text-[#D5DBEE] leading-relaxed mb-6 font-sans">
                      {item.description}
                    </p>
                  </div>

                  {/* Primary CTA Button: Champagne Gold */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoose(item);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#E2B857] hover:bg-[#F3EAD3] text-[#0A1226] transition-all flex items-center justify-center gap-1.5 shadow-md group-hover:brightness-105 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E2B857]"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-[#E2B857]/20 text-center text-xs text-[#4A5675]">
            <span>Need to switch roles later? Use the role switcher dropdown in the top workspace navigation bar at any time.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
