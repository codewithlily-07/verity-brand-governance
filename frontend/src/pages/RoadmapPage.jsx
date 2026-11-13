import React from 'react';
import { Compass, CheckCircle2, Clock, ArrowRight, Shield } from 'lucide-react';

export function RoadmapPage({ setActivePage }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="w-12 h-12 rounded-2xl bg-gold/20 text-gold mx-auto flex items-center justify-center mb-3">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
          Product Roadmap & Known Limitations
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Transparent development progress, boundary definition, and engineering next steps.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm">
        
        {/* MVP Scope Matrix */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-serif text-base font-bold text-ink mb-4">Round 2 Build Boundary (Delivered)</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-teal/5 border border-teal/20 rounded-xl">
              <span className="font-bold text-teal flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4" /> Delivered in Current Build
              </span>
              <ul className="space-y-1.5 text-xs text-gray-700">
                <li>• Multi-layer deterministic rule engine (casing, phrases, regex)</li>
                <li>• Approved facts retrieval and grounding citations</li>
                <li>• Side-by-side intent-preserving diff correction workspace</li>
                <li>• Cryptographic version-bound approvals with SHA-256 hashes</li>
                <li>• PDF and DOCX document text parsing (PyMuPDF & docx)</li>
                <li>• WCAG AA contrast ratio and palette CIE ΔE color distance</li>
                <li>• Adaptive insights surfacing unclear guidelines</li>
              </ul>
            </div>

            <div className="p-4 bg-mist border border-gray-200 rounded-xl">
              <span className="font-bold text-gray-700 flex items-center gap-1.5 mb-2">
                <Clock className="w-4 h-4 text-gold" /> Future Enterprise Scope
              </span>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li>• Deep neural logo and raster vector-distortion verification</li>
                <li>• Automated webhooks for direct publishing into CMS / Socials</li>
                <li>• SAML / SCIM enterprise Single Sign-On (Okta, Azure AD)</li>
                <li>• Multi-tenant cross-brand guideline inheritance hierarchies</li>
                <li>• Automated legal compliance jurisdiction mapping</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Known Limitations */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-serif text-base font-bold text-ink mb-3">Honest Known Limitations (KNOWN_LIMITATIONS.md)</h3>
          
          <div className="space-y-3 text-xs text-gray-600">
            <div className="p-3 bg-mist/60 rounded-xl">
              <strong className="text-ink block mb-0.5">1. Free-Tier Cold Starts:</strong>
              When deployed on free-tier containers without a warm ping, initial backend spin-up may take 15–20 seconds. The frontend displays a friendly waking state.
            </div>

            <div className="p-3 bg-mist/60 rounded-xl">
              <strong className="text-ink block mb-0.5">2. Vector Search Fallback:</strong>
              When PostgreSQL pgvector is not configured locally, the system automatically falls back to full-text token search without loss of functionality.
            </div>

            <div className="p-3 bg-mist/60 rounded-xl">
              <strong className="text-ink block mb-0.5">3. AI Contextual Layer Optionality:</strong>
              If an external LLM API key is not supplied, Layer 3 is gracefully bypassed while Layer 1 (Rules) and Layer 2 (Fact Retrieval) continue to execute completely.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
