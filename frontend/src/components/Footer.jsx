import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ExternalLink, Heart, CheckCircle2, Lock } from 'lucide-react';

export function Footer({ setActivePage }) {
  const handleNav = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (setActivePage) {
      setActivePage(page);
    }
  };

  return (
    <footer className="bg-[#060B1F] text-[#F5F1E6] border-t border-[#18285A] pt-16 pb-12 select-none">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Brand Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 border-b border-[#18285A]">
          <div 
            onClick={() => handleNav('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Calligraphic Gold V Icon */}
            <div className="w-10 h-8 flex items-center justify-center transition-transform group-hover:scale-105">
              <svg viewBox="0 0 260 190" className="w-full h-full drop-shadow-[0_0_12px_rgba(212,175,55,0.7)]" fill="none">
                <defs>
                  <linearGradient id="footerV1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8A5A12"/>
                    <stop offset="35%" stopColor="#D4AF37"/>
                    <stop offset="60%" stopColor="#F3D98B"/>
                    <stop offset="100%" stopColor="#B9822A"/>
                  </linearGradient>
                  <linearGradient id="footerV2" x1="0%" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#9A6A1A"/>
                    <stop offset="50%" stopColor="#F3CC6B"/>
                    <stop offset="100%" stopColor="#FFF6D0"/>
                  </linearGradient>
                </defs>
                <path d="M10 46 C38 26 82 38 112 96 L126 160 C88 134 40 96 10 46 Z" fill="url(#footerV1)"/>
                <path d="M30 52 C56 46 84 62 104 100 C78 82 52 66 30 52 Z" fill="#F3D98B" opacity=".6"/>
                <path d="M120 164 C122 104 160 40 248 6 C196 44 170 98 150 158 C140 162 130 164 120 164 Z" fill="url(#footerV2)"/>
                <path d="M138 140 C150 96 178 52 228 20 C190 58 168 100 152 146 Z" fill="#FFFFFF" opacity=".35"/>
              </svg>
            </div>

            <div>
              <span className="font-cinzel font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#F3D98B] via-[#D4AF37] to-[#F3D98B] tracking-[0.18em] leading-none block">
                VERITY
              </span>
              <span className="text-[9px] font-mono tracking-[0.45em] text-[#D4AF37]/80 uppercase block mt-1">
                BRAND GOVERNANCE
              </span>
            </div>
          </div>

          <p className="text-xs text-[#9AA6C7] max-w-md font-sans">
            Consistent. Compliant. Trustworthy. Intelligent pre-publication brand governance grounded in deterministic rules and human review.
          </p>
        </div>

        {/* 4 Aligned Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-[#18285A]">
          
          {/* Column 1: Product */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F3D98B] mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9AA6C7]">
              <li>
                <button onClick={() => handleNav('product')} className="hover:text-white transition-colors text-left">
                  Product Suite Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('brand-hub')} className="hover:text-white transition-colors text-left">
                  Brand Knowledge Hub
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('new-review')} className="hover:text-white transition-colors text-left">
                  Pre-Publication Analysis
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('dashboard')} className="hover:text-white transition-colors text-left">
                  Demo Workspace
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: How It Works */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F3D98B] mb-4">
              How It Works
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9AA6C7]">
              <li>
                <button onClick={() => handleNav('how-it-works')} className="hover:text-white transition-colors text-left">
                  Four-Tier Architecture
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('how-it-works')} className="hover:text-white transition-colors text-left">
                  Deterministic AST Matching
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('how-it-works')} className="hover:text-white transition-colors text-left">
                  Hallucination Prevention
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('how-it-works')} className="hover:text-white transition-colors text-left">
                  5-Step Workflow Journey
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Security */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F3D98B] mb-4">
              Trust & Security
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9AA6C7]">
              <li>
                <button onClick={() => handleNav('trust-security')} className="hover:text-white transition-colors text-left">
                  Security Architecture
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('trust-security')} className="hover:text-white transition-colors text-left">
                  100% Cryptographic Human Sign-Off
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('trust-security')} className="hover:text-white transition-colors text-left">
                  Zero Model Training Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('trust-security')} className="hover:text-white transition-colors text-left">
                  WCAG 2.1 AA Compliance
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F3D98B] mb-4">
              Resources & Team
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9AA6C7]">
              <li>
                <button onClick={() => handleNav('resources')} className="hover:text-white transition-colors text-left">
                  Documentation & Guides
                </button>
              </li>
              <li>
                <a 
                  href="/docs" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Interactive Swagger API</span>
                  <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                </a>
              </li>
              <li>
                <span className="text-white font-medium">Team COGNEXA</span>
              </li>
              <li>
                <span className="text-[#9AA6C7]/70 font-mono text-[11px]">National Hackathon 2026</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9AA6C7]/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2ECC9A]" />
            <span>VERITY — Intelligent Brand Governance. All rights reserved.</span>
          </div>
          <div className="font-mono text-[11px] text-[#D4AF37]">
            Consistent · Compliant · Trustworthy
          </div>
        </div>

      </div>
    </footer>
  );
}
