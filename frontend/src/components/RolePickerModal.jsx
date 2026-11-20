import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, CheckCircle, Shield, ArrowRight, X, User } from 'lucide-react';
import { switchRole } from '../lib/api';

/**
 * RolePickerModal ("How do you want to explore Verity?")
 * - 3 Role Personas: Creator, Reviewer, Admin
 * - Directly opens the demo workspace in that role on the appropriate screen
 * - Fully keyboard accessible (Esc closes, Tab cycles, Enter selects)
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
      accent: '#E2B857',
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
      accent: '#1E9E78',
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
      accent: '#8A6A24',
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
          className="fixed inset-0 bg-[#0A1226]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-[#101B35] border border-[#E2B857]/40 rounded-3xl p-6 sm:p-10 shadow-2xl z-10 text-[#F4F1E8]"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-[#D5DBEE] hover:text-[#F4F1E8] hover:bg-white/10 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#E2B857]"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E2B857] font-sans">
              Role-Separated Governance
            </span>
            <h2 id="role-picker-title" className="font-serif text-3xl sm:text-4xl font-bold text-[#F4F1E8] mt-2 mb-3">
              How do you want to explore Verity?
            </h2>
            <p className="text-sm sm:text-base text-[#D5DBEE] leading-relaxed font-sans">
              Select a persona to jump directly into that role’s tailored workspace and experience true separation of authority.
            </p>
          </div>

          {/* 3 Persona Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleChoose(item)}
                  className="bg-[#17254A] rounded-2xl border border-[#E2B857]/30 hover:border-[#E2B857] p-6 shadow-lg hover:shadow-2xl transition-all duration-200 flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{
                          backgroundColor: `${item.accent}20`,
                          border: `1px solid ${item.accent}60`,
                          color: item.accent
                        }}
                      >
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#D5DBEE]">
                        {item.eyebrow}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#F4F1E8] mb-2 group-hover:text-[#F3EAD3] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#D5DBEE] leading-relaxed mb-6 font-sans">
                      {item.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoose(item);
                    }}
                    className="w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md group-hover:brightness-110"
                    style={{
                      backgroundColor: item.accent,
                      color: item.id === 'creator' ? '#0A1226' : '#FFFFFF'
                    }}
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-[#D5DBEE]">
            <span>Need to switch roles later? Use the role switcher dropdown in the top workspace navigation bar at any time.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
