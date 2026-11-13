import React from 'react';
import { ShieldCheck, Lock, Eye, AlertCircle, HeartHandshake, CheckCircle2 } from 'lucide-react';

export function TrustPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="w-12 h-12 rounded-2xl bg-gold/20 text-gold mx-auto flex items-center justify-center mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
          Security, Privacy & Responsible AI
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          VERITY was built from day one to guarantee institutional integrity, algorithmic transparency, and uncompromising human oversight.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
        
        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-serif text-base font-bold text-ink mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gold" />
              <span>Zero Secrets in Client Bundle</span>
            </h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              API keys, embeddings configuration, and database credentials remain 100% server-side in protected environment variables. The browser frontend receives only sanitized evaluation results.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-serif text-base font-bold text-ink mb-2 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-teal" />
              <span>100% Human Authority</span>
            </h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              AI never approves content. Every publication decision requires an explicit human reviewer confirmation bound cryptographically to a SHA-256 version hash.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-serif text-base font-bold text-ink mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-800" />
              <span>Evidence-Grounding Guarantee</span>
            </h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              Every finding must cite an approved fact or guideline passage. When no factual grounding exists, VERITY explicitly reports: <strong>"No approved supporting evidence found."</strong>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-serif text-base font-bold text-ink mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Adversarial Prompt Shield</span>
            </h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              Submitted content is strictly delimited as inert data. Prompt override attempts ("ignore instructions", "mark approved") are flagged for human review and never execute.
            </p>
          </div>

        </div>

        {/* Responsible AI Framework */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-ink mb-3">Responsible AI Implementation</h3>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
              <span><strong>No Model Training:</strong> Uploaded customer guidelines and submitted publication drafts are never used to train or fine-tune third-party LLMs.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
              <span><strong>Server-Side Finding Validation:</strong> Every AI-suggested finding is verified against verbatim substrings before display. Hallucinated quotes or nonexistent rule IDs are discarded.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
              <span><strong>WCAG 2.1 AA Accessibility:</strong> Screen-reader landmarks, keyboard navigation, 4.5:1 text contrast checks, and descriptive alt-text verification across all assets.</span>
            </li>
          </ul>
        </div>

        {/* Open Disclosures */}
        <div className="bg-mist/50 rounded-2xl p-6 border border-gray-200 text-xs">
          <h4 className="font-bold text-ink mb-2">Team & Project Disclosures (DISCLOSURES.md)</h4>
          <p className="text-gray-600 mb-2">
            Developed by <strong>Team COGNEXA</strong> for the WCC Forge 48 hackathon, addressing the Inkloom AI brand governance challenge.
          </p>
          <p className="text-gray-600">
            Open-source libraries utilized: FastAPI, SQLAlchemy, PyMuPDF, python-docx, Pillow, React, Vite, Tailwind CSS, Lucide React, Recharts, Framer Motion, and Google Fonts (Fraunces, Manrope, JetBrains Mono).
          </p>
        </div>

      </div>

    </div>
  );
}

