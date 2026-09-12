# Agent Workbench — Private Beta Tester Guide

Welcome to the private beta test of **Agent Workbench** by **Human Design Group**!  
This guide walks you through installing and testing the extension in **Cursor** or **VS Code**.

---

## 1. Prerequisites
- **Cursor** (or VS Code) version `1.85.0` or later.
- (Optional but recommended) Local AI Gateway / CLIs:
  - OmniRoute running on `http://localhost:20128` (or direct OpenAI / Anthropic / Gemini API keys).
  - Any installed agent CLIs (`gemini`, `openclaw`, `hermes`, `opencode`, or `claude`).

---

## 2. Installation (1-Minute Setup)

### Option A: Via Cursor UI (Drag & Drop)
1. Open **Cursor**.
2. Open the **Extensions** view (`Cmd + Shift + X` on macOS, `Ctrl + Shift + X` on Windows/Linux).
3. Click the `...` (Views and More Actions) menu in the top-right corner of the Extensions sidebar.
4. Select **Install from VSIX...**
5. Choose the provided **`nah-workbench-0.1.0.vsix`** file.
6. A notification will confirm: `Extension 'nah-workbench-0.1.0.vsix' was successfully installed.`

### Option B: Via Terminal
```bash
cursor --install-extension nah-workbench-0.1.0.vsix --force
```

---

## 3. First Launch & Setup Wizard

1. Open the Command Palette (`Cmd + Shift + P` or `Ctrl + Shift + P`).
2. Type and select: **`notahuman: Open Multi-Agent Workbench`** (Shortcut: `Cmd + Option + N`).
3. You will be greeted by the **Agent Workbench Setup Wizard**:
   - **Step 1:** Welcome & Overview.
   - **Step 2 (Auto-Scan):** Scans your environment for installed agent CLIs and detects your local gateway connection status.
   - **Step 3:** Model routing and auto-compression overview.
   - **Step 4:** Choose your initial layout (Team Mode vs Independent) and select your active agents.
4. Click **Launch Workbench**.

---

## 4. Key Features to Test

### 1. Dynamic Layouts & Resizing
- Switch between **Vertical Columns (1x4)**, **2x2 Grid**, **3-Column Split**, **Horizontal Rows**, and **1x1 Focus Mode** using the top-left layout picker.
- Drag the resize gutters between panels to resize cards dynamically.

### 2. Live Multi-Agent Execution & Streaming
- Type prompts to **Astro**, **Humano**, **Uno**, or **Omo**.
- Observe real-time token streaming, thinking process dropdowns, and response metrics.
- Attach editor files, git diffs, or terminal output using the **`+` (Add Context)** button.

### 3. Session Modes & Team Lead Orchestration
- Click **Session Mode** in the top header to toggle between **Team Mode** (shared project directory + designated Team Lead) and **Independent Agents**.

### 4. Remote Control Server
- Agent Workbench automatically boots a local bridge server on port `4545`.
- Click the top-right **More (...)** menu -> **Copy Session URL** or **Copy Share Code** to mirror the workbench in an external browser or mobile device on your local network.

---

## 5. Feedback & Reporting Issues
If you encounter any glitches, formatting issues, or feature suggestions, please note:
- Your OS version & Cursor version.
- Which layout mode was active.
- Screenshot or error log from the Developer Tools console (`Help -> Toggle Developer Tools`).

Thank you for testing Agent Workbench!
