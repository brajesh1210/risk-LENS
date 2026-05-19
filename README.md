# risk-LENS

## 📋 Problem Statement: Supply Chain Vulnerability Visualizer

### 📝 Description
Modern companies are breached not through their own systems, but through trusted third-party vendors with weaker security postures. A single compromised npm package, SaaS integration, or cloud sub-processor can cascade into a full organizational breach.

Security teams lack a unified view of how vendor dependencies interconnect and where the weakest links are. Build a tool that ingests a company's declared tech stack—libraries, SaaS tools, APIs, cloud providers—and generates an interactive dependency graph overlaid with known CVEs, breach history, and trust-chain depth.

Risk scores surface the highest-priority exposure points for immediate remediation.

## 📦 Deliverables
A web tool featuring:

* **Tech Stack Ingestion:** Manual entry and file upload capabilities supporting standard formats (JSON/SBOM).
* **Interactive Visualization:** A functional dependency graph visually mapping out nested systems and trust-chain depths.
* **Vulnerability Analytics:** A live CVE overlay sourced from public security databases (NVD / OSV).
* **Actionable Reporting:** An exportable risk summary report profiling prioritized exposure vulnerabilities for engineering triage.

## 🚀 Proposed Solution
Modern enterprises are frequently breached through third-party dependencies rather than direct attacks. Our solution is an interactive supply chain visualizer that ingests a project's tech stack (JSON/SBOM), maps the trust-chain depth, and cross-references dependencies against live global threat databases (OSV).

**The Differentiator:** We go beyond standard detection. Our platform integrates an AI-driven Remediation Engine powered by Gemini. When a vulnerable node is detected, the AI instantly provides context-aware explanations of the exploit, suggests secure library substitutions, and generates the exact code commands needed to patch the vulnerability.

## ⚙️ Architecture Pipeline
* **Ingestion Layer:** Multi-input parser for manual entry, package.json, or JSON/SBOM files.
* **Threat Intel Engine:** Live querying via Google OSV API for zero-day and historical CVEs.
* **Visualization Engine:** Interactive mapping of direct vs. transitive dependencies to calculate the blast radius.
* **Remediation Layer:** Gemini AI intercepts high-risk nodes to generate safe library alternatives and patch scripts.

## 🛠️ Tech Stack
* **Frontend UI/UX:** Next.js & Tailwind CSS (for an enterprise-grade layout)
* **Interactive Graphing:** React Flow (for draggable, visual dependency mapping)
* **Vulnerability Database:** Google OSV API (Open Source Vulnerabilities)
* **AI Security Assistant:** Gemini API (Context-aware remediation and substitutions)
* **Deployment:** Vercel (Live hosted prototype)

## 👥 Team Name - Lorem Ipsum
**Contributors:**
* Ansh Patel
* Atharv Handa
* Brajesh Upadhyay

---
**Note**
> Repository Status: 🔄 Actively Maintained & Continuously Updating
