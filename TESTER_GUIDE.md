# Agent Workbench — Private Beta Tester Guide (macOS & Windows)

Welcome to the private beta of **Agent Workbench** by **Human Design Group**!  
Agent Workbench brings a multi-agent grid right inside your Cursor or VS Code editor on **macOS** and **Windows**.

---

## 1. Prerequisites
- **Cursor** (or VS Code) version `1.85.0` or higher (macOS or Windows).
- Your standard coding tools (e.g. Cursor Agent, ChatGPT / Codex, Claude Code, or direct API keys).

---

## 2. Installation Instructions (macOS & Windows)

The provided **`agent-workbench-0.1.0.vsix`** package is a universal cross-platform extension.

### Method A: Install via Cursor Graphical Interface (Recommended)
1. Open **Cursor**.
2. Press `Cmd + Shift + X` (macOS) or `Ctrl + Shift + X` (Windows) to open the **Extensions** sidebar.
3. Click the **`...`** (More Actions) menu at the very top right of the Extensions panel.
4. Select **`Install from VSIX...`**.
5. Browse and select the **`agent-workbench-0.1.0.vsix`** file.
6. A notification will appear in the bottom right:  
   `Extension 'agent-workbench-0.1.0.vsix' was successfully installed.`
7. **Important:** Run `Developer: Reload Window` (`Cmd+R` / `Ctrl+R`) to refresh Cursor's extension host.

### Method B: Install via Terminal / PowerShell
- **On macOS (Terminal):**
  ```bash
  cursor --install-extension agent-workbench-0.1.0.vsix --force
  ```
- **On Windows (PowerShell or Command Prompt):**
  ```powershell
  cursor --install-extension .\agent-workbench-0.1.0.vsix --force
  ```

---

## 3. First-Launch Onboarding Wizard

1. Open the Command Palette:
   - **macOS:** `Cmd + Shift + P` (Shortcut: `Cmd + Alt + N`)
   - **Windows:** `Ctrl + Shift + P` (Shortcut: `Ctrl + Alt + N`)
2. Select: **`Agent Workbench: Open Multi-Agent Mission Control`**.
3. The **Setup Wizard** will automatically launch:
   - **Step 1:** Welcome & Feature Overview.
   - **Step 2 (Auto-Detection):** Automatically scans your `PATH` on macOS or Windows and highlights your installed tools (e.g., **Cursor Agent** and **ChatGPT / Codex** will display green checkmarks!).
   - **Step 3 (Model Setup):** Choose between local tools/gateways or enter your API key (OpenAI, Anthropic, OpenRouter) if you want direct BYOK execution.
   - **Step 4 (Team Selection):** Choose your active slots (e.g. **Cursor Agent**, **ChatGPT / Codex**, **Claude Code**, **OpenCode**) and select **Team Mode** or **Independent Panels**.
4. Click **Launch Workbench**.

---

## 4. Key Workflows to Test

### 1. Dynamic Layouts & Resizing
- Use the layout picker in the top-left corner to switch between:
  - **Vertical Columns (1x4)**
  - **2x2 Grid**
  - **3-Column Split**
  - **Horizontal Rows**
  - **1x1 Focus Mode**
- Drag the gutters between panels to test fluid resizing.

### 2. Live Chat & Code Prompting
- Ask coding questions in the **Cursor Agent** or **ChatGPT / Codex** panels.
- Click the **`+` (Add Context)** button next to the composer to attach your current active file, selection, or workspace git diff.

### 3. Session & Remote Mirroring
- Open the **More (...)** menu in the top right.
- Click **Copy Session URL** or **Copy Share Code** to mirror the workbench in an external browser or mobile device on your local network (running on port `4545`).

---

## 5. Feedback & Issue Reporting
If you notice any UI glitches, layout clipping, or behavior bugs on either macOS or Windows, please share:
1. OS (e.g. macOS Sonoma / Windows 11) & Cursor Version.
2. The active layout mode.
3. Console errors from `Help -> Toggle Developer Tools -> Console` (if any).

Thank you for helping us test Agent Workbench!
