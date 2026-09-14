# Agento — Agent Workbench
### *Unified Multi-Agent Mission Control & Responsive Grid for Cursor and VS Code*

[![Version](https://img.shields.io/badge/version-0.1.0-0094d9.svg)](https://github.com/human-design-group/nah-agent-workbench)
[![Publisher](https://img.shields.io/badge/publisher-Human%20Design%20Group-2287b6.svg)](https://thehumandesigngroup.com)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-0f1d24.svg)](https://github.com/human-design-group/nah-agent-workbench)
[![License](https://img.shields.io/badge/license-MIT-2ead25.svg)](LICENSE)

---

## 🌟 Overview

Developers and engineers are no longer working with just one AI model. Modern software engineering demands specialized agent coordination — architectural planning, real-time testing, full-stack implementation, and security reviews happening concurrently.

However, standard IDEs lock you into a rigid single sidebar or stacked chat panels.

**Agento** transforms Cursor and VS Code into an expansive **Multi-Agent Mission Control Workbench**. Tile and interact with multiple AI agents side-by-side with butter-smooth draggable resize gutters, live Git worktree branch awareness, and unified model routing.

---

## 🚀 Key Highlights

### 1. 📐 Dynamic Multi-Agent Responsive Grids
Switch effortlessly between flexible layout templates engineered for modern multi-monitor and ultra-wide setups:
- **1x4 Vertical Columns**: Parallel stream monitoring for up to 4 concurrent agents.
- **2x2 Quad Grid**: Balanced quadrant viewport for simultaneous front-end, back-end, test, and review agents.
- **4x1 Horizontal Rows**: Stacked wide-viewport workflows for deep code analysis.
- **Split 3 (1+2)**: Primary lead agent viewport paired with two auxiliary subagents.
- **Focus 1**: Single full-width agent view when you need deep immersion.
- **Sub-Pixel Draggable Gutters**: Fluid, real-time gutter dragging with persistent layout memory.

### 2. 👥 Team Orchestration & Independent Operating Modes
- **Team Orchestration Mode**: Appoint a Lead Coordinator agent who decomposes goals, delegates subtasks, and aggregates results across specialized worker agents.
- **Independent Multi-Agent Mode**: Run fully autonomous, uncoupled agent streams side-by-side on separate branches, features, or bug fixes.

### 3. 🌿 Live Git Worktree & Branch Awareness
Every agent panel features a dedicated Tier-2 Context Bar providing instant repository visibility:
- Active **workspace folder** and **worktree path**.
- Real-time **modified (*)**, **staged (+)**, **untracked (!)**, and **divergence (?)** counters.
- **One-Click Branch Forking**: Spin off a child worktree and session without leaving your chat view.

### 4. 🧠 Multi-Model Runtime & Gateway Integration
Connect each agent panel to its optimal reasoning engine:
- **OmniRoute / Bifrost** gateway integration (`localhost:20128`).
- **Claude 3.7 Sonnet**, **GPT-5 / Codex**, **Gemini 2.5 Flash**, **DeepSeek-R1**.
- **Local LLMs**: Direct connection to local Ollama and custom inference servers.
- **Fine-Grained Permissions**: Switch between *Supervised*, *Auto-Approve*, *Autonomous*, and *Sandbox* per agent.

### 5. 📎 Context Attachments & Multi-Modal Composer
- **One-Click Media & Context (+)**: Attach active files, line ranges, workspace git diffs, skills, or connectors directly into the prompt.
- **Chain of Thought (CoT)**: Expandable thinking process dropdowns with latency and token telemetry.
- **Voice Transcription**: Built-in audio dictation toggle for hands-free prompt composition.

### 6. 📱 Remote Companion Bridge (Port 4545)
- Mirror your active IDE workbench session to any browser, iPad, or mobile device on your local network.
- Instant WebSocket state sync, remote prompting, and live session sharing.

---

## ⌨️ Keyboard Shortcuts

| Shortcut (macOS) | Shortcut (Windows / Linux) | Command |
| :--- | :--- | :--- |
| `Cmd + Option + N` | `Ctrl + Alt + N` | **Agento: Open Agent Workbench** |
| `Cmd + Shift + P` -> `Agento: Reset Workbench Layout` | `Ctrl + Shift + P` -> `Agento: Reset Workbench Layout` | Reset Workbench Grid & State |

---

## 📦 Supported Agents & CLIs

Agento auto-detects and connects with all major agent frameworks and local tools:
- **AntiGravity** (Astro)
- **OpenClaw** (Humano)
- **Hermes** (Uno)
- **OpenCode** (Omo)
- **Anthropic Claude Code**
- **OpenAI ChatGPT / Codex**
- **Cursor Agent**
- **Cline** / **Kilo**
- **Ollama Local Models**
- **Custom Agent Bridges**

---

## 🛠️ Getting Started

1. Install **Agento — Agent Workbench** from the Cursor / VS Code Marketplace (or install via VSIX).
2. Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and type:  
   `Agento: Open Agent Workbench` (or press `Cmd+Option+N` / `Ctrl+Alt+N`).
3. Follow the 4-step first-launch setup wizard to choose your operating mode and starter agents.
4. Start building with a responsive multi-agent workspace!

---

## 🛡️ Privacy & Security

Agento operates locally on your machine. API calls and model queries route through your configured endpoints and local gateways. No telemetry or source code is transmitted to external third parties.

---

## 🏢 About Human Design Group

**Agento** is an official product designed and built by **Human Design Group**.  
- **Website**: [https://thehumandesigngroup.com](https://thehumandesigngroup.com)  
- **Repository**: [https://github.com/human-design-group/nah-agent-workbench](https://github.com/human-design-group/nah-agent-workbench)  
- **Issues & Feedback**: [GitHub Issues](https://github.com/human-design-group/nah-agent-workbench/issues)
