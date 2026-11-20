import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  ShieldCheck, Lock, Eye, HeartHandshake, Server, Database, 
  Key, Sparkles, ArrowRight, Shield, AlertTriangle, CheckCircle2, 
  XCircle, FileText, UserCheck, Terminal, HelpCircle, Clock
} from 'lucide-react';
import { PageSubNav } from '../components/PageSubNav';
import { TechnicalDetailsExpander } from '../components/TechnicalDetailsExpander';

export function TrustPage({ setActivePage }) {
  const prefersReduced = useReducedMotion();

  const handleNav = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (setActivePage) setActivePage(page);
  };

  const sections = [
    { id: 'commitments', label: 'What We Claim' },
    { id: 'data-flow', label: 'Data Flow' },
    { id: 'threat-matrix', label: 'Threats & Defences' },
    { id: 'permissions', label: 'Roles & Oversight' },
    { id: 'ai-disclosure', label: 'AI Disclosure' },
    { id: 'roadmap', label: 'Roadmap & Boundaries' },
  ];

  return (
    <div className="min-h-screen text-[#F7F2E7] select-none">
      
      {/* ==================================================
          SECTION 1: HERO (INK #05070F with soft emerald glow, Max 45vh)
          ================================================== */}
      <section 
        className="relative pt-24 pb-14 px-4 sm:px-6 lg:px-8 text-center border-b border-[#2ECC9A]/20 flex flex-col items-center justify-center min-h-[38vh] max-h-[45vh]"
        style={{ 
          backgroundColor: '#05070F',
          background: 'radial-gradient(circle at 50% 30%, rgba(46, 204, 154, 0.12) 0%, #05070F 70%)'
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1230] border border-[#2ECC9A]/40 text-xs font-mono text-[#2ECC9A] mb-3">
          <Shield className="w-3.5 h-3.5 text-[#2ECC9A]" />
          <span>RESPONSIBLE AI & HUMAN OVERSIGHT</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3 tracking-tight">
          Built so the AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC9A] via-[#F3D98B] to-[#2ECC9A]">never has the last word.</span>
        </h1>
        
        <p className="text-[17px] text-[#F7F2E7]/85 max-w-[65ch] mx-auto font-sans leading-relaxed mb-6">
          Verity enforces deterministic rules, transparent citations, and strict human review so unverified AI claims never reach production.
        </p>

        <div>
          <button
            type="button"
            onClick={() => handleNav('review')}
            className="btn-gold-sweep px-7 py-3 rounded-xl font-bold text-sm text-[#050814] shadow-gold-glow inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #F3D98B, #D4AF37 50%, #A67C00)',
            }}
          >
            <span>Launch Trust Demo</span>
            <ArrowRight className="w-4 h-4 text-[#050814]" />
          </button>
        </div>
      </section>

      {/* Sticky Sub-navigation */}
      <PageSubNav sections={sections} />

      {/* ==================================================
          SECTION 2: TWO COLUMNS (IVORY #F7F2E7)
          "What Verity does" vs "What we do not claim"
          ================================================== */}
      <section 
        id="commitments"
        className="py-24 relative"
        style={{ backgroundColor: '#F7F2E7', color: '#121826' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-[#8A5A12] uppercase block mb-2">
              HONEST BOUNDARIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#050A1F] mb-3">
              Clear commitments and honest limits
            </h2>
            <div className="title-gold-underline mx-auto mb-3" />
            <p className="text-[17px] text-[#3B4252] font-sans leading-relaxed max-w-[65ch] mx-auto">
              We state exactly what the software implements today and explicitly list what is outside current scope.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Column 1: What Verity Does */}
            <div className="bg-white rounded-3xl p-8 border border-[#2ECC9A]/40 shadow-[0_8px_25px_rgba(18,24,38,0.06)]">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-[#D1FAE5] text-[#065F46] flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[#065F46] font-bold uppercase tracking-wider block">Verified Capabilities</span>
                  <h3 className="font-serif text-xl font-bold text-[#050A1F]">What Verity does</h3>
                </div>
              </div>

              <ul className="space-y-4 text-[15px] text-[#3B4252] font-sans">
                <li className="flex items-start gap-3">
                  <span className="text-[#065F46] font-bold text-lg mt-0.5">✓</span>
                  <div>
                    <strong className="text-[#050A1F] block">AI findings are strictly advisory:</strong>
                    An authorised human reviewer owns the final approval decision before any draft can publish.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#065F46] font-bold text-lg mt-0.5">✓</span>
                  <div>
                    <strong className="text-[#050A1F] block">Evidence-linked findings:</strong>
                    Every high-impact finding cites an approved guideline passage or explicitly indicates missing evidence.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#065F46] font-bold text-lg mt-0.5">✓</span>
                  <div>
                    <strong className="text-[#050A1F] block">Inert prompt safety:</strong>
                    Draft copy is treated strictly as data, completely ignoring adversarial instructions inside text.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#065F46] font-bold text-lg mt-0.5">✓</span>
                  <div>
                    <strong className="text-[#050A1F] block">Non-destructive editing:</strong>
                    The author's original draft is never overwritten; corrections save as new version snapshots.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#065F46] font-bold text-lg mt-0.5">✓</span>
                  <div>
                    <strong className="text-[#050A1F] block">Tamper-evident audit seals:</strong>
                    Approvals generate an immutable SHA-256 hash binding author, reviewer, timestamp, and version text.
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 2: What We Do Not Claim */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-[0_8px_25px_rgba(18,24,38,0.06)]">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center font-bold">
                  <XCircle className="w-6 h-6 text-[#4B5563]" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[#4B5563] font-bold uppercase tracking-wider block">Explicit Exclusions</span>
                  <h3 className="font-serif text-xl font-bold text-[#050A1F]">What we do not claim</h3>
                </div>
              </div>

              <ul className="space-y-4 text-[15px] text-[#3B4252] font-sans">
                <li className="flex items-start gap-3">
                  <span className="text-[#4B5563] font-bold text-lg mt-0.5">✗</span>
                  <div>
                    <strong className="text-[#050A1F] block">No compliance certifications:</strong>
                    We do not claim SOC 2, ISO 27001, or HIPAA certifications. Security measures reflect current local code controls.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#4B5563] font-bold text-lg mt-0.5">✗</span>
                  <div>
                    <strong className="text-[#050A1F] block">No accuracy promises beyond measured results:</strong>
                    We make no theoretical 0% hallucination claims; all performance data is verified live on our /quality page.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#4B5563] font-bold text-lg mt-0.5">✗</span>
                  <div>
                    <strong className="text-[#050A1F] block">Image and logo checks are future work:</strong>
                    Visual logo recognition and pixel design inspection are scheduled for future roadmap cycles.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#4B5563] font-bold text-lg mt-0.5">✗</span>
                  <div>
                    <strong className="text-[#050A1F] block">No direct CMS publishing webhooks:</strong>
                    Verity acts as the pre-publication sign-off gate; automatic dispatch to social networks or CMS is future scope.
                  </div>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 3: ANIMATED DATA FLOW (CHARCOAL #0B0E14)
          Browser -> Backend -> AI Service with travelling light pulses and annotations.
          ================================================== */}
      <section 
        id="data-flow"
        className="py-24 relative overflow-hidden"
        style={{ backgroundColor: '#0B0E14' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase block mb-2">
              SECURITY ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-3">
              Data flow and credential isolation
            </h2>
            <div className="title-gold-underline mx-auto mb-3" />
            <p className="text-[17px] text-[#F7F2E7]/85 font-sans leading-relaxed">
              API credentials remain securely server-side, with only sanitized minimum text sent to external models.
            </p>
          </div>

          {/* Diagram Flow Card */}
          <div className="bg-[#111827] rounded-3xl p-8 sm:p-12 border border-[#D4AF37]/35 shadow-luxury">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-center">
              
              {/* Node 1: Browser */}
              <div className="bg-[#05070F] rounded-2xl p-6 border border-gray-800 text-center relative">
                <div className="w-12 h-12 rounded-xl bg-gray-800 text-[#F3D98B] flex items-center justify-center mx-auto mb-3">
                  <Terminal className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-white mb-1">User Browser</h4>
                <p className="text-xs text-gray-400 font-sans mb-3">React Single-Page Client</p>
                <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-[11px] text-[#2ECC9A] font-mono">
                  Zero API keys in client bundle
                </div>
              </div>

              {/* Node 2: Backend */}
              <div className="bg-[#05070F] rounded-2xl p-6 border border-[#D4AF37]/50 text-center relative shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                <div className="w-12 h-12 rounded-xl bg-[#0A1230] text-[#D4AF37] flex items-center justify-center mx-auto mb-3 border border-[#D4AF37]/40">
                  <Server className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-white mb-1">FastAPI Backend</h4>
                <p className="text-xs text-gray-400 font-sans mb-3">Rule Engine & Retrieval</p>
                <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-[11px] text-[#F3D98B] font-mono">
                  API keys stored in server env
                </div>
              </div>

              {/* Node 3: AI Service */}
              <div className="bg-[#05070F] rounded-2xl p-6 border border-gray-800 text-center relative">
                <div className="w-12 h-12 rounded-xl bg-gray-800 text-[#2ECC9A] flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-white mb-1">Google Gemini API</h4>
                <p className="text-xs text-gray-400 font-sans mb-3">gemini-1.5-flash (Advisory)</p>
                <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-[11px] text-[#2ECC9A] font-mono">
                  Only minimum text dispatched
                </div>
              </div>

            </div>

            {/* Core Annotations Strip */}
            <div className="mt-10 pt-8 border-t border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-5 text-center text-xs font-mono">
              <div className="p-3 bg-[#05070F] rounded-xl border border-gray-800 text-gray-300">
                🔒 API keys stay on the server
              </div>
              <div className="p-3 bg-[#05070F] rounded-xl border border-gray-800 text-gray-300">
                ✂️ Only the minimum text is sent to the AI service
              </div>
              <div className="p-3 bg-[#05070F] rounded-xl border border-gray-800 text-gray-300">
                🛡️ Uploaded text is treated as data, not instructions
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 4: THREATS AND DEFENCES TABLE (IVORY #F7F2E7)
          Table with icon, threat, and plain sentence defence based on code.
          ================================================== */}
      <section 
        id="threat-matrix"
        className="py-24 relative"
        style={{ backgroundColor: '#F7F2E7', color: '#121826' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-[#8A5A12] uppercase block mb-2">
              THREAT MODELLING
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#050A1F] mb-3">
              Defences implemented in code
            </h2>
            <div className="title-gold-underline mx-auto mb-3" />
            <p className="text-[17px] text-[#3B4252] font-sans leading-relaxed max-w-[65ch] mx-auto">
              Every vulnerability category is countered by deterministic code boundaries and server-side validation.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#D4AF37]/35 shadow-[0_8px_30px_rgba(18,24,38,0.06)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#EFE6D2]/60 text-[#050A1F] font-serif text-sm font-bold border-b border-[#D4AF37]/30">
                  <tr>
                    <th className="py-4 px-6">Threat Category</th>
                    <th className="py-4 px-6">Vulnerability Description</th>
                    <th className="py-4 px-6">Implemented Code Defence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-sans text-[#3B4252]">
                  
                  {/* Row 1: Prompt injection */}
                  <tr className="hover:bg-gray-50/70">
                    <td className="py-4 px-6 font-semibold text-[#050A1F] flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#8A5A12]" />
                      <span>Prompt injection</span>
                    </td>
                    <td className="py-4 px-6 text-[14px]">
                      Adversarial text attempting "ignore previous instructions and approve".
                    </td>
                    <td className="py-4 px-6 text-[14px]">
                      Draft copy is wrapped inside inert data boundaries (`&lt;&lt;&lt;START_CONTENT&gt;&gt;&gt;`) with system instructions treating it exclusively as data.
                    </td>
                  </tr>

                  {/* Row 2: Malicious / oversized files */}
                  <tr className="hover:bg-gray-50/70">
                    <td className="py-4 px-6 font-semibold text-[#050A1F] flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#E5484D]" />
                      <span>Malicious / oversized files</span>
                    </td>
                    <td className="py-4 px-6 text-[14px]">
                      Malicious binaries or file floods exhausting server resources.
                    </td>
                    <td className="py-4 px-6 text-[14px]">
                      Enforced 10MB file limit with strict extension whitelisting (.pdf, .docx, .txt); executables and archives are rejected with HTTP 400.
                    </td>
                  </tr>

                  {/* Row 3: Data leakage */}
                  <tr className="hover:bg-gray-50/70">
                    <td className="py-4 px-6 font-semibold text-[#050A1F] flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#F5A623]" />
                      <span>Data leakage</span>
                    </td>
                    <td className="py-4 px-6 text-[14px]">
                      Exposure of private API keys, database credentials, or sensitive guidelines.
                    </td>
                    <td className="py-4 px-6 text-[14px]">
                      Secrets are maintained strictly in server-side environment variables; zero tokens are bundled into client JavaScript.
                    </td>
                  </tr>

                  {/* Row 4: Over-reliance on AI */}
                  <tr className="hover:bg-gray-50/70">
                    <td className="py-4 px-6 font-semibold text-[#050A1F] flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#2ECC9A]" />
                      <span>Over-reliance on AI</span>
                    </td>
                    <td className="py-4 px-6 text-[14px]">
                      Autonomous AI hallucinating approvals or altering compliance standards.
                    </td>
                    <td className="py-4 px-6 text-[14px]">
                      AI findings are strictly advisory. The approval endpoint requires authenticated human reviewer identity and explicit sign-off reason.
                    </td>
                  </tr>

                  {/* Row 5: Personal data */}
                  <tr className="hover:bg-gray-50/70">
                    <td className="py-4 px-6 font-semibold text-[#050A1F] flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#8A5A12]" />
                      <span>Personal data retention</span>
                    </td>
                    <td className="py-4 px-6 text-[14px]">
                      Indefinite storage of sensitive draft submissions without removal controls.
                    </td>
                    <td className="py-4 px-6 text-[14px]">
                      Workspace-scoped database partitioning with full "Delete Draft" cascade deletion covering versions, findings, and logs.
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 5: ROLES & OVERSIGHT (NAVY #0A1230 - The ONE navy section!)
          Roles and permissions matrix + human oversight callouts.
          ================================================== */}
      <section 
        id="permissions"
        className="py-24 relative overflow-hidden"
        style={{ backgroundColor: '#0A1230' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-[#F3D98B] uppercase block mb-2">
              AUTHORITY MATRIX
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-3">
              Role permissions and human oversight
            </h2>
            <div className="title-gold-underline mx-auto mb-3" />
            <p className="text-[17px] text-[#F7F2E7]/85 font-sans leading-relaxed">
              Every role in Verity operates under least-privilege principles, with clear checkpoints for human challenge and override.
            </p>
          </div>

          {/* Permissions Matrix */}
          <div className="bg-[#111827] rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/35 shadow-luxury mb-12 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-gray-800 text-[#F3D98B] uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Submit Drafts</th>
                  <th className="py-3 px-4">Resolve Findings</th>
                  <th className="py-3 px-4">Sign-Off & Approve</th>
                  <th className="py-3 px-4">Manage Brand Hub</th>
                  <th className="py-3 px-4">Authorize Overrides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-sans text-gray-300">
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Content Creator</td>
                  <td className="py-3 px-4 text-[#2ECC9A] font-bold">✓ Yes</td>
                  <td className="py-3 px-4 text-[#2ECC9A] font-bold">✓ Yes</td>
                  <td className="py-3 px-4 text-[#9AA6C7]">✗ No</td>
                  <td className="py-3 px-4 text-[#9AA6C7]">✗ No</td>
                  <td className="py-3 px-4 text-[#9AA6C7]">✗ No</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Marketing Manager</td>
                  <td className="py-3 px-4 text-[#2ECC9A] font-bold">✓ Yes</td>
                  <td className="py-3 px-4 text-[#2ECC9A] font-bold">✓ Yes</td>
                  <td className="py-3 px-4 text-[#9AA6C7]">✗ No</td>
                  <td className="py-3 px-4 text-[#F3D98B]">View Only</td>
                  <td className="py-3 px-4 text-[#9AA6C7]">✗ No</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Brand Administrator</td>
                  <td className="py-3 px-4 text-[#2ECC9A] font-bold">✓ Yes</td>
                  <td className="py-3 px-4 text-[#2ECC9A] font-bold">✓ Yes</td>
                  <td className="py-3 px-4 text-[#9AA6C7]">✗ No</td>
                  <td className="py-3 px-4 text-[#2ECC9A] font-bold">✓ Full CRUD</td>
                  <td className="py-3 px-4 text-[#9AA6C7]">✗ No</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#F3D98B]">Authorised Reviewer</td>
                  <td className="py-3 px-4 text-[#2ECC9A] font-bold">✓ Yes</td>
                  <td className="py-3 px-4 text-[#2ECC9A] font-bold">✓ Yes</td>
                  <td className="py-3 px-4 text-[#2ECC9A] font-bold">✓ Full Authority</td>
                  <td className="py-3 px-4 text-[#F3D98B]">View Only</td>
                  <td className="py-3 px-4 text-[#2ECC9A] font-bold">✓ With Reason</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Three Human Oversight Callouts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#05070F] border border-gray-800">
              <h4 className="font-serif text-lg font-bold text-white mb-2">Challenge False Positives</h4>
              <p className="text-[14px] text-gray-400 font-sans leading-relaxed">
                Creators can dispute any automated finding directly with a written challenge reason, triggering a human review.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#05070F] border border-gray-800">
              <h4 className="font-serif text-lg font-bold text-white mb-2">Recorded Overrides</h4>
              <p className="text-[14px] text-gray-400 font-sans leading-relaxed">
                When a reviewer authorizes high-severity content exceptions, an explicit compliance justification is permanently logged.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#05070F] border border-gray-800">
              <h4 className="font-serif text-lg font-bold text-white mb-2">Preserved Version History</h4>
              <p className="text-[14px] text-gray-400 font-sans leading-relaxed">
                Prior draft snapshots, token diffs, and review comments remain permanently auditable with tamper-evident SHA-256 version hashes.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 6: AI DISCLOSURE AND LIMITS (CREAM #EFE6D2)
          Model name, no training on user docs, roadmap, accessibility.
          ================================================== */}
      <section 
        id="ai-disclosure"
        className="py-24 relative"
        style={{ backgroundColor: '#EFE6D2', color: '#121826' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-[#8A5A12] uppercase block mb-2">
              FULL TRANSPARENCY
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#050A1F] mb-3">
              AI provider disclosure and roadmap limits
            </h2>
            <div className="title-gold-underline mx-auto mb-3" />
            <p className="text-[17px] text-[#3B4252] font-sans leading-relaxed max-w-[65ch] mx-auto">
              Disclosing our exact LLM dependencies and defining technical development boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* Box 1: AI Provider Disclosures */}
            <div className="bg-white rounded-3xl p-8 border border-[#D4AF37]/35 shadow-[0_8px_25px_rgba(18,24,38,0.06)]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#050A1F] text-[#F3D98B] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#050A1F]">AI Model Disclosure</h3>
              </div>

              <div className="space-y-3 text-[15px] text-[#3B4252] font-sans leading-relaxed">
                <p>
                  <strong>Actual Provider Called:</strong> Google Gemini API via <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-[#050A1F]">gemini-1.5-flash</code> endpoint (with OpenAI-compatible fallback).
                </p>
                <p>
                  <strong>Configuration:</strong> Invoked with temperature <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-[#050A1F]">0.0</code> and structured JSON schema enforcement.
                </p>
                <p>
                  <strong>Customer Document Privacy:</strong> Customer drafts and brand guidelines are processed transiently and are never used to train or fine-tune public foundation models.
                </p>
                <p>
                  <strong>Deletion Guarantee:</strong> Users can permanently delete drafts via the <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-[#050A1F]">DELETE /api/submissions/&#123;id&#125;</code> endpoint.
                </p>
              </div>
            </div>

            {/* Box 2: Limits and Roadmap */}
            <div className="bg-white rounded-3xl p-8 border border-[#D4AF37]/35 shadow-[0_8px_25px_rgba(18,24,38,0.06)]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#050A1F] text-[#F3D98B] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#050A1F]">Limits & Roadmap</h3>
              </div>

              <div className="space-y-3 text-[15px] text-[#3B4252] font-sans leading-relaxed">
                <p>
                  <strong>Image & Logo Verification:</strong> Scheduled for future cycles. Current scope evaluates text, alt text, and CSS color contrast.
                </p>
                <p>
                  <strong>Design File Formats:</strong> Figma design file import is planned for post-competition releases.
                </p>
                <p>
                  <strong>Publishing Integrations:</strong> Direct webhooks into social channels or CMS systems are future scope.
                </p>
                <p>
                  <strong>Accessibility Notes:</strong> Designed with keyboard navigation, contrast ratios &gt; 4.5:1, and icon+text dual signaling.
                </p>
              </div>
            </div>

          </div>

          <div className="text-center">
            <button
              onClick={() => handleNav('resources')}
              className="px-6 py-3 rounded-xl bg-[#050A1F] text-[#F3D98B] hover:text-white font-semibold text-xs tracking-wide transition-all inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Explore Technical Resources & Documentation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 7: ROADMAP & PRODUCT BOUNDARIES
          ================================================== */}
      <section 
        id="roadmap"
        className="py-24 border-t border-[#D4AF37]/20"
        style={{ backgroundColor: '#0B0E14', color: '#F7F2E7' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050A1F] border border-[#D4AF37]/40 text-xs font-mono text-[#F3D98B] mb-3">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>ROUND 2 SCOPE BOUNDARY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
              Product Roadmap & <span className="text-gold-shimmer">Engineering Boundaries</span>
            </h2>
            <p className="text-[17px] text-[#9AA6C7] font-sans leading-relaxed">
              Transparent demarcation between what is live in the current release and what belongs to future enterprise cycles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-[#111827] rounded-3xl p-8 border border-[#2ECC9A]/30 shadow-luxury">
              <span className="font-bold text-[#2ECC9A] flex items-center gap-2 text-base mb-4 font-serif">
                <CheckCircle2 className="w-5 h-5 text-[#2ECC9A]" /> Delivered in Current Round 2 Build
              </span>
              <ul className="space-y-3 text-[14px] text-[#F7F2E7]/90 font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-[#2ECC9A] font-bold">✓</span>
                  <span>Multi-layer deterministic rule engine (casing, phrases, regex R1–R7)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2ECC9A] font-bold">✓</span>
                  <span>Approved facts retrieval and citation grounding (F-01–F-03)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2ECC9A] font-bold">✓</span>
                  <span>Side-by-side intent-preserving diff correction workspace</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2ECC9A] font-bold">✓</span>
                  <span>Tamper-evident version-bound approvals with server-verified SHA-256</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2ECC9A] font-bold">✓</span>
                  <span>PDF and DOCX document text parsing (PyMuPDF & python-docx)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2ECC9A] font-bold">✓</span>
                  <span>WCAG AA contrast checking & palette CIE ΔE color distance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2ECC9A] font-bold">✓</span>
                  <span>Adaptive telemetry surfacing unclear policies and channel friction</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#111827] rounded-3xl p-8 border border-[#D4AF37]/30 shadow-luxury">
              <span className="font-bold text-[#F3D98B] flex items-center gap-2 text-base mb-4 font-serif">
                <Clock className="w-5 h-5 text-[#D4AF37]" /> Future Enterprise Scope
              </span>
              <ul className="space-y-3 text-[14px] text-[#9AA6C7] font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-bold">○</span>
                  <span>Advanced visual logo distortion and layout geometry analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-bold">○</span>
                  <span>Direct automated webhooks into CMS and social publishing platforms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-bold">○</span>
                  <span>SAML 2.0 / SCIM enterprise Single Sign-On (Okta, Azure AD)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-bold">○</span>
                  <span>Multi-tenant parent/child cross-brand guideline inheritance hierarchies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-bold">○</span>
                  <span>Automated jurisdiction and legal advertising compliance mapping</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Known Limitations Box */}
          <div className="bg-[#111827] rounded-3xl p-8 border border-gray-800 shadow-luxury">
            <h3 className="font-serif text-xl font-bold text-white mb-4">
              Honest Engineering Limitations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#9AA6C7] font-sans leading-relaxed">
              <div className="p-4 bg-[#05070F] rounded-2xl border border-gray-800">
                <strong className="text-white block text-sm mb-1">1. Deterministic Local Retrieval</strong>
                Keyword-indexed fact verification and BM25 token matching run locally without external search dependencies.
              </div>
              <div className="p-4 bg-[#05070F] rounded-2xl border border-gray-800">
                <strong className="text-white block text-sm mb-1">2. AI Context Optionality</strong>
                If an external LLM key is absent, Layer 3 is gracefully bypassed while Layer 1 (Rules) and Layer 2 (Facts) execute deterministically.
              </div>
              <div className="p-4 bg-[#05070F] rounded-2xl border border-gray-800">
                <strong className="text-white block text-sm mb-1">3. Human Ownership Requirement</strong>
                No content is automatically published or marked approved by AI alone. Human reviewer sign-off is mandatory.
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
