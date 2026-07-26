import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getSessionUser() {
  const cookieStore = cookies();
  const raw = cookieStore.get('devpilot_user')?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { docType = 'readme', repoName = 'DevPilot AI Suite', customContext = '' } = await req.json().catch(() => ({}));

    let markdown = '';

    switch (docType) {
      case 'api':
        markdown = `# 🌐 ${repoName} - REST API Specification

Base Server URL: \`https://api.devpilot.ai/v1\`

## 🔒 Authentication

All API endpoints require JWT authentication. Include your token in the authorization header:

\`\`\`http
Authorization: Bearer <your_access_token>
\`\`\`

Or use a DevPilot API Key:

\`\`\`http
X-DevPilot-Key: dp_live_992a819b...
\`\`\`

---

## 📌 Endpoint Reference

### 1. Execute Code Review
- **Endpoint**: \`POST /api/review\`
- **Description**: Triggers static analysis and AI vulnerability scan on source code.
- **Request Body**:
\`\`\`json
{
  "repositoryId": "repo_881",
  "files": ["src/auth.ts", "src/db.ts"]
}
\`\`\`
- **Response (\`200 OK\`)**:
\`\`\`json
{
  "issuesCount": 2,
  "healthScore": 92,
  "issues": [
    {
      "severity": "Critical",
      "title": "Unsanitized SQL concatenation",
      "file": "src/db.ts",
      "line": 42
    }
  ]
}
\`\`\`

### 2. Generate Automated Test Suite
- **Endpoint**: \`POST /api/tests/generate\`
- **Description**: Generates high-coverage unit or integration tests for provided code.
- **Request Body**:
\`\`\`json
{
  "fileName": "userService.ts",
  "framework": "jest",
  "testType": "unit"
}
\`\`\`

### 3. API Key Management
- **Endpoint**: \`GET /api/apikeys\` — List active API keys
- **Endpoint**: \`POST /api/apikeys\` — Generate new API key
- **Endpoint**: \`DELETE /api/apikeys?id=:id\` — Revoke key

${customContext ? `\n\n## 📝 Project Context Notes\n${customContext}` : ''}
`;
        break;

      case 'install':
        markdown = `# ⚙️ ${repoName} - Installation & Setup Guide

This guide provides step-by-step instructions to set up **${repoName}** locally or in production.

---

## 📋 Prerequisites

Ensure your environment meets the following requirements before installation:

- **Node.js**: \`>= 18.17.0\`
- **npm**: \`>= 9.0.0\` (or **pnpm** \`>= 8.0.0\`)
- **PostgreSQL**: \`>= 14.0\`
- **Git**: \`>= 2.30\`

---

## 🚀 Step-by-step Quickstart

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/your-org/${repoName.toLowerCase().replace(/\s+/g, '-')}.git
cd ${repoName.toLowerCase().replace(/\s+/g, '-')}
\`\`\`

### 2. Install Project Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Configure Environment Variables
Copy the template configuration file:
\`\`\`bash
cp .env.example .env.local
\`\`\`
Edit \`.env.local\` with your database connection string and secret keys:
\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/devpilot_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
\`\`\`

### 4. Database Setup & Prisma Migrations
\`\`\`bash
npx prisma migrate dev --name init
npx prisma db seed
\`\`\`

### 5. Launch Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

${customContext ? `\n\n## 🔧 Custom Installation Environment Notes\n${customContext}` : ''}
`;
        break;

      case 'architecture':
        markdown = `# 🏛️ ${repoName} - System Architecture Overview

High-level system design, modular layers, and data processing flows of **${repoName}**.

---

## 🧱 Architectural Diagram

\`\`\`text
┌───────────────────────────────────────────────────────────┐
│                     Client (Next.js 13 App Router)        │
└─────────────────────────────┬─────────────────────────────┘
                              │ HTTP REST / Server Actions
                              ▼
┌───────────────────────────────────────────────────────────┐
│                     API Route Controllers                 │
│        (/api/review, /api/tests, /api/apikeys, etc.)       │
└──────────────┬──────────────────────────────┬─────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────┐┌────────────────────────────┐
│      AI Execution Engine    ││   Service & Business Layer │
│   (Security, Tests, Docs)   ││   (Prisma ORM & Auth)      │
└──────────────┬──────────────┘└──────────────┬─────────────┘
               │                              │
               └──────────────┬───────────────┘
                              ▼
┌───────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                      │
│      (Users, Repositories, Issues, Reports, ApiKeys)      │
└───────────────────────────────────────────────────────────┘
\`\`\`

---

## 📦 Core Domain Modules

1. **Authentication & Session Manager** (\`app/api/auth\`) — Manages HTTP-only JWT session cookies, password hashing with \`bcryptjs\`, and user profile sync.
2. **AI Code Review Engine** (\`app/api/review\`) — Performs AST static analysis, vulnerability categorization, and inline code remediation.
3. **Multi-Agent Orchestrator** (\`app/api/agents\`) — Coordinates specialized background agents for automated code maintenance.
4. **API Key & Integrations** (\`app/api/apikeys\`) — Cryptographically secure token creation for external developer tool integration.

${customContext ? `\n\n## 🎯 Custom Architectural Context\n${customContext}` : ''}
`;
        break;

      case 'readme':
      default:
        markdown = `# 🚀 ${repoName}

> Production-ready AI Software Engineering Assistant platform for intelligent code analysis, automated test suite generation, architecture visualizer, and agentic code reviews.

---

## ✨ Features Overview

- **🤖 AI Code Review Engine**: Real-time static code analysis and security vulnerability detection.
- **🧪 Automated Test Generator**: One-click generation of Jest, Vitest, and PyTest unit test suites.
- **📄 AI Documentation Generator**: Instant creation of READMEs, API specifications, and architecture diagrams.
- **🕸️ Codebase Architecture Visualizer**: Interactive module dependency graphs and structure breakdowns.
- **🔑 Developer API Key Access**: Programmatically integrate DevPilot into CLI and CI/CD workflows.

---

## ⚡ Quickstart

\`\`\`bash
# Clone repository
git clone https://github.com/devpilot/${repoName.toLowerCase().replace(/\s+/g, '-')}.git

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

---

## 📄 License

Distributed under the **MIT License**.
`;
        break;
    }

    return NextResponse.json({
      success: true,
      docType,
      repoName,
      content: markdown,
    });
  } catch (error) {
    console.error('Doc generation error:', error);
    return NextResponse.json({ error: 'Failed to generate documentation' }, { status: 500 });
  }
}
