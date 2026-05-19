import { Template } from "@/types";

export const TEMPLATES: Template[] = [
  {
    id: "nodejs-saas",
    name: "Node.js SaaS Starter",
    description: "Next.js 14 + Prisma",
    icon: "🟢",
    packages: [
      { name: "next", version: "14.0.0", ecosystem: "npm" },
      { name: "react", version: "18.2.0", ecosystem: "npm" },
      { name: "prisma", version: "5.8.1", ecosystem: "npm" },
      { name: "express", version: "4.18.2", ecosystem: "npm" },
      { name: "lodash", version: "4.17.4", ecosystem: "npm" },
      { name: "axios", version: "1.6.0", ecosystem: "npm" },
    ],
    stats: { packages: 34, vulnerabilities: 12, riskScore: 7.1 },
  },
  {
    id: "python-data",
    name: "Python Data Stack",
    description: "Pandas, NumPy, Scikit-learn",
    icon: "🐍",
    packages: [
      { name: "numpy", version: "1.24.0", ecosystem: "PyPI" },
      { name: "pandas", version: "2.0.0", ecosystem: "PyPI" },
      { name: "flask", version: "3.0.0", ecosystem: "PyPI" },
    ],
    stats: { packages: 58, vulnerabilities: 0, riskScore: 1.4 },
  },
  {
    id: "k8s-microservices",
    name: "K8s Microservices",
    description: "Critical Log4j + OpenSSL",
    icon: "☸️",
    packages: [
      { name: "log4j-core", version: "2.14.1", ecosystem: "Maven" },
      { name: "spring-boot", version: "2.7.0", ecosystem: "Maven" },
      { name: "openssl", version: "1.0.2", ecosystem: "npm" },
      { name: "lodash", version: "4.17.4", ecosystem: "npm" },
      { name: "express", version: "4.16.0", ecosystem: "npm" },
      { name: "moment", version: "2.29.1", ecosystem: "npm" },
    ],
    stats: { packages: 112, vulnerabilities: 47, riskScore: 9.4 },
  },
  {
    id: "fullstack-java",
    name: "Full-Stack Java",
    description: "Spring Boot + Maven",
    icon: "☕",
    packages: [
      { name: "spring-boot", version: "2.6.0", ecosystem: "Maven" },
      { name: "log4j", version: "2.14.1", ecosystem: "Maven" },
      { name: "jackson-databind", version: "2.13.0", ecosystem: "Maven" },
    ],
    stats: { packages: 89, vulnerabilities: 23, riskScore: 8.2 },
  },
];