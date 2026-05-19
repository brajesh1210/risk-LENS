# 👁️ risk-LENS
**Enterprise Supply Chain Threat Intelligence & Blast Radius Topology**

[![Next.js](https://img.shields.io/badge/Next.js_16.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](#)

> **Live Prototype / Vercel Deployment:** [https://risk-lens-nine.vercel.app/](https://risk-lens-nine.vercel.app/)  
> **Video Walkthrough / Demo:** [Watch on YouTube](https://youtu.be/7UTg70FaBCY)

## 🚨 The Problem
Modern enterprise software relies heavily on deeply nested, transitive open-source dependencies. When a zero-day vulnerability (like Log4Shell or a compromised npm package) hits, organizations spend days manually mapping their infrastructure to find the blast radius. 

## 🛡️ The Solution: risk-LENS
risk-LENS is a zero-trust visualizer and autonomous remediation engine. It ingests software manifests, queries global vulnerability databases in real-time, and generates an interactive, hardware-accelerated topological map of your system's exact risk exposure.

### 🔥 Core Features
* **Omni-Channel Ingestion Deck:** Instantly input dependency data via multiple avenues—upload a standard `package.json`, paste a raw JSON array, or manually input components directly into the interface.
* **Dual-Render Topology Engine:** Toggle between a hardware-accelerated **3D Orbital Trust Matrix** (WebGL/Three.js) for spatial graphing or a highly optimized **2D Flat Tree** with SVG Bezier connection lines.
* **Live Threat Telemetry:** Real-time synchronization with the Google OSV (Open Source Vulnerability) database to flag CVEs and map critical security outliers instantly.
* **Autonomous AI Remediation & Safe Alternatives:** Integrated with Google Gemini to isolate infected operational scopes, provide sandbox-safe patch commands, and recommend reliable, vulnerability-free alternative packages.
* **Multi-Format Export & Vulnerability Reports:** Extract and download identified vulnerability rosters and topological audit records into instantly shareable **PDF, JSON, or standard SBOM formats**.
* **Cascade Breach Simulator:** Visually simulate the propagation route of a threat vector moving from a transitive dependency into the core enterprise network.
* **Enterprise ROI Dashboard:** Dynamically calculates potential breach liabilities and compliance audit capital saved by automating dependency mapping.

---

## 🌍 Target Audience & Impact
**Target Audience:**
* **DevSecOps Teams:** Engineers seeking to eliminate manual dependency mapping and visually debug package trees in their CI/CD cycles.
* **Enterprise CISOs & Auditing Bodies:** Security officers needing instant compliance reporting, risk metrics, and precise blast radius verification.
* **Open Source Maintainers:** Development teams looking to ensure their packages don't inadvertently act as a supply chain attack vector.

**The Impact:**
risk-LENS condenses a multi-day, specialized forensics task into a millisecond visual calculation. By highlighting exact threat propagation paths and serving immediate, AI-vetted replacement solutions, it narrows the vulnerability remediation window down to near-zero.

---

## 💼 Business Model & Scaling Strategy (SaaS)
risk-LENS is built to transition seamlessly from a hackathon tool into a enterprise-grade SaaS solution:

* **Tier 1: Developer Community (Free)**
  * Access to the multi-input deck, standard 2D flat topology mapping, and fundamental OSV live database integration.
* **Tier 2: Premium Professional ($/mo per seat)**
  * Unlock the hardware-accelerated 3D Orbital Trust Matrix, full PDF/JSON/SBOM report compilation, and AI-driven dependency alternatives.
* **Tier 3: Enterprise Suite (Custom Enterprise Agreements)**
  * Dedicated instance hosting with isolated AI contexts trained on internal compliance structures.
  * Automated, sandbox-validated pull requests (PR generation) dispatched straight to GitHub/GitLab.
* **B2B API Licensing:** 
  * Exposing the risk-LENS graph translation and remediation backend as a standalone API service for external Developer Tooling infrastructures.

---

## 🛠️ Technical Architecture & Typescript Specs

Built for enterprise-grade type safety and high-performance WebGL rendering.

* **Core Framework:** Next.js 16.2.6 (App Router), React 19.2.4
* **Language Configuration:** TypeScript v5
  * Fully strictly typed environment (`"strict": true`) targeting ES2017
  * Custom module resolution with `@/*` path aliases
* **3D Engine:** React Three Fiber (`@react-three/fiber`), Drei, and Three.js 0.184.0
* **State Management:** Zustand v5 (Immutable global stores for graph data and UI overlays)
* **Styling & Animation:** Tailwind CSS v4, Framer Motion, Lucide React
* **External APIs:** Google Open Source Vulnerabilities (OSV) API, Google Gemini API

## 💻 Local Execution & Setup

The application is built for immediate local testing with zero complex database setup required.

**1. Clone the repository**
```bash
git clone [https://github.com/your-username/risk-LENS.git](https://github.com/your-username/risk-LENS.git)
cd risk-LENS
npm install 
```
## 👥 Team Name - Lorem Ipsum
**Contributors:**
* Ansh Patel
* Atharv Handa
* Brajesh Upadhyay

**Note**
> Repository Status: 🔄 Actively Maintained & Continuously Updating

---
