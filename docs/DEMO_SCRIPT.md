# VERITY: 3-Minute Judge Demonstration Script

**Platform:** VERITY — Intelligent Brand Governance  
**Goal:** Complete the full judge journey in under 3 minutes with zero prior walkthrough.

---

## Step-by-Step Demonstration Walkthrough

### 0:00 – 0:30 | The Landing & Problem Statement
1. Open the home page.
2. Note the **Signature Live Review Animation Card**:
   - Watch the scan sweep across the draft.
   - Observe the gold highlights and intent-preserving morph.
   - Watch the reviewer badge and "Approved v2" stamp land.
3. Click the primary gold CTA: **"Start Reviewing Content"**.

### 0:30 – 1:15 | Submitting Acceptance Test Sample A
1. On the **Submit Content for Review** page, locate the **Acceptance Test Samples** banner.
2. Click **"Sample A"**:
   - Text loads: *"Our platform guarantees 100% results and is the best learning platform in India!"*
3. Click **"Run Verity Analysis"**.

### 1:15 – 2:00 | Inspecting Evidence-Backed Findings (Improvement 1)
1. In the **Analysis Results** view, observe the summary:
   - **Finding 1 (High):** Prohibited absolute claim (`R2`) → Verified rule violation.
   - **Finding 2 (High):** Unsupported promotional claim (`R3`) → Source-backed concern.
2. Inspect the evidence panel for Finding 2:
   - Notice the exact grounding text: **`"No approved supporting evidence found."`**
3. Click **"Open Correction Workspace"**.

### 2:00 – 2:35 | Intent-Preserving Corrections & Versioning (Improvement 2)
1. In the **Correction Workspace**, observe the side-by-side word diff:
   - Red strikethrough on prohibited terms (`guarantees 100% results`).
   - Green insertion of approved fact wording: `supports online learning` (derived from Approved Fact F-01).
2. Click **"Save as New Version & Re-analyse"**:
   - Generates Version 2 with a new SHA-256 hash.
   - Observe that Version 2 now shows **Zero Violations** and verified checks citing F-01.

### 2:35 – 3:00 | Human Sign-off & Governance Insights (Improvement 3)
1. Switch role to **Reviewer** using the top navigation switcher.
2. Click **"Review Sign-off"**:
   - Click **"Approve Version 2"** (now unlocked because high-severity issues are resolved).
   - Watch the green approval confirmation stamp appear.
3. Navigate to **"Insights"**:
   - Observe real-time governance metrics and the **"Rules That May Be Unclear"** panel flagging frequently challenged guidelines.

