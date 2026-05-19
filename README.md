# 👁️ risk-LENS
**Enterprise Supply Chain Threat Intelligence & Blast Radius Topology**

[![Next.js](https://img.shields.io/badge/Next.js_16.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](#)

> **Live Prototype / Vercel Deployment:** https://risk-lens-nine.vercel.app/

## 🚨 The Problem
Modern enterprise software relies heavily on deeply nested, transitive open-source dependencies. When a zero-day vulnerability (like Log4Shell or a compromised npm package) hits, organizations spend days manually mapping their infrastructure to find the blast radius. 

## 🛡️ The Solution: risk-LENS
risk-LENS is a zero-trust visualizer and autonomous remediation engine. It ingests software manifests, queries global vulnerability databases in real-time, and generates an interactive, hardware-accelerated topological map of your system's exact risk exposure.

### 🔥 Core Features
* **Dynamic Ingestion Deck:** Instantly parse `package.json` arrays or standard SBOMs (CycloneDX / SPDX formats).
* **Dual-Render Topology Engine:** Toggle between a hardware-accelerated **3D Orbital Trust Matrix** (WebGL/Three.js) or a highly optimized **2D Flat Tree** with SVG Bezier connection lines.
* **Live Threat Telemetry:** Real-time synchronization with the Google OSV (Open Source Vulnerability) database to flag CVEs and map critical security outliers instantly.
* **Autonomous AI Remediation:** Integrated with Google Gemini to isolate infected operational scopes and deliver sandbox-safe patch commands and mitigation strategies.
* **Cascade Breach Simulator:** Visually simulate the propagation route of a threat vector moving from a transitive dependency into the core enterprise network.
* **Enterprise ROI Dashboard:** Dynamically calculates potential breach liabilities and compliance audit capital saved by automating dependency mapping.

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
* **External APIs:** * Google Open Source Vulnerabilities (OSV) API 

---

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

---
**Note**
> Repository Status: 🔄 Actively Maintained & Continuously Updating
