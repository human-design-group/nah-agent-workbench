# Agento — Agent Workbench

[![Release](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/human-design-group/nah-agent-workbench)
[![Platform](https://img.shields.io/badge/platform-Cursor%20%7C%20VS%20Code%20%7C%20AgentOS-85BFD1.svg)](https://github.com/human-design-group/nah-agent-workbench)
[![Kanban](https://img.shields.io/badge/project-Kanban%20Board-success.svg)](https://github.com/orgs/human-design-group/projects/1)

**Agento** is an official **Human Design Group** product delivering a unified multi-agent mission control dashboard and responsive grid for Cursor, VS Code, and agentic workflows.

Run parallel autonomous coding agents, switch seamlessly between cloud model providers (OpenRouter, Anthropic, OpenAI, Gemini) and offline local models (Ollama, LM Studio), and monitor per-agent Git worktree branches in real time.

---

## ⚡ Quick Start: Installing the VSIX Package

### Option A: From Terminal
```bash
# For Cursor users:
cursor --install-extension dist/agento-0.1.0.vsix --force

# For VS Code users:
code --install-extension dist/agento-0.1.0.vsix --force
```

### Option B: From Cursor / VS Code UI
1. Open the **Extensions** view (`Cmd+Shift+X` on Mac / `Ctrl+Shift+X` on Windows/Linux).
2. Click the **Views and More Actions** (`...`) menu at the top-right of the Extensions panel.
3. Select **Install from VSIX...**.
4. Browse to `dist/agento-0.1.0.vsix` and click **Install**.

---

## 🚀 Launching Agento

- **Keyboard Shortcut**: `Cmd+Alt+N` (Mac) or `Ctrl+Alt+N` (Windows/Linux)
- **Command Palette**: Press `Cmd+Shift+P` (or `Ctrl+Shift+P`), type **Agento: Open Agent Workbench**, and press Enter.
- **Settings**: Click the **Session Control ⚙️** icon in the top header or press `Cmd+Alt+,`.

---

## 🛠️ First-Time Onboarding & Model Setup

When you first launch Agento, the **5-Step Onboarding Wizard** guides your setup:

1. **Welcome**: Overview of Agento's unified multi-agent mission control and responsive layout engine.
2. **System Auto-Discovery**: Automatic scan of your host environment detecting installed agent CLIs (`hermes`, `cursor-agent`, `openclaw`, etc.) and Git worktrees.
3. **Model Providers & API Access**: Connect your preferred LLM provider with live latency testing:
   - **OpenRouter (Recommended)**: Single key powers Claude 3.7 Sonnet, GPT-4o, Gemini 2.5, DeepSeek R1, and Llama 3.3.
   - **Anthropic Direct**: Claude 3.7 / 3.5 Sonnet direct API.
   - **OpenAI Direct**: GPT-4o, o3-mini direct API.
   - **Google Gemini**: Gemini 2.5 Flash & Pro.
   - **Ollama Local (100% Free & Offline)**: Connects to `http://127.0.0.1:11434` — zero API keys required.
   - **OmniRoute / Custom Gateway**: Connect to local proxy routers or enterprise OpenAI-compatible endpoints.
   - **Zero Plaintext Key Storage**: All credentials are encrypted in your operating system Keychain via the VS Code `SecretStorage` API.
4. **Starter Team Configuration**: Pick your active agent slots and select between **Independent Grid Mode** and **Team / Mission Control Mode**.
5. **Layout Preset**: Choose between 2x2 Grid, Vertical Columns, Horizontal Rows, or Focus Mode.

> **Note**: You can re-run Onboarding or reconfigure providers anytime via **Session Control ⚙️** -> **Gateways & Bridges** tab -> **Test Connection**.

---

## 🧩 Features & Capabilities

- **Responsive Multi-Agent Layouts**: Toggle instantly between Grid (2x2), Vertical (1x3 or 1x4 columns), Horizontal rows, and Focus view with draggable resize gutters.
- **Multi-Runtime Parallel Execution**: Coordinate agents across different runtimes (Hermes, Cursor Agent, AntiGravity, OpenClaw) side by side.
- **Git Worktree Isolation**: Real-time git status indicators (branch, staged/modified file counters, ahead/behind tracking) for safe concurrent branch operations.
- **Live Token & Context Usage**: Per-panel context thresholds with color-coded token meters and latency trackers.
- **Draggable & Reorderable Panels**: Drag panel headers to swap agent slots dynamically across the grid.
- **Remote Companion Server**: Built-in HTTP and WebSocket companion bridge on port 20129 for mobile or web monitoring.

---

## 💻 Developer & Build Instructions

If developing or building from source:

```bash
# Install dependencies
npm install

# Type-check TypeScript
npm run typecheck

# Build bundle
npm run build

# Package .vsix
npm run package

# Build and install directly into Cursor
npm run install-ext
```

---

## 📄 License

MIT © [Human Design Group](https://thehumandesigngroup.com)


