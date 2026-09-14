# Agento — Private Beta Tester Guide (macOS & Windows)

Welcome to the private beta of **Agento** (*Agent Workbench*) by **Human Design Group**!  
Agento brings a unified multi-agent grid and mission control right inside your Cursor or VS Code editor on **macOS** and **Windows**.

---

## 1. Prerequisites
- **Cursor** (or VS Code) version `1.85.0` or higher (macOS or Windows).
- Your standard coding tools (e.g. OpenClaw, Hermes, OpenCode, Claude, ChatGPT/Codex).

---

## 2. Installation Instructions (macOS & Windows)

The provided **`agento-0.1.0.vsix`** package is a universal cross-platform extension.

### Method A: Install via Cursor Graphical Interface (Recommended)
1. Open **Cursor**.
2. Press `Cmd + Shift + X` (macOS) or `Ctrl + Shift + X` (Windows) to open the **Extensions** sidebar.
3. Click the **`...`** (More Actions) menu at the very top right of the Extensions panel.
4. Select **`Install from VSIX...`**.
5. Browse and select the **`agento-0.1.0.vsix`** file.
6. A notification will appear in the bottom right:  
   `Extension 'agento-0.1.0.vsix' was successfully installed.`
7. **Important:** Run `Developer: Reload Window` (`Cmd+R` / `Ctrl+R`) to refresh Cursor's extension host.

### Method B: Install via Terminal / PowerShell
- **On macOS (Terminal):**
  ```bash
  cursor --install-extension agento-0.1.0.vsix --force
  ```
- **On Windows (PowerShell or Command Prompt):**
  ```powershell
  cursor --install-extension .\agento-0.1.0.vsix --force
  ```

---

## 3. Opening Agento

1. Open the Command Palette:
   - **macOS:** `Cmd + Shift + P` (Shortcut: `Cmd + Option + N`)
   - **Windows:** `Ctrl + Shift + P` (Shortcut: `Ctrl + Alt + N`)
2. Select: **`Agento: Open Agent Workbench`**.

---

## 4. Key Workflows to Test

### 1. Dynamic Layouts & Resizing
- Use the layout picker in the top toolbar to switch between:
  - **Vertical Columns (1x4)**
  - **2x2 Grid**
  - **3-Column Split**
  - **Horizontal Rows**
  - **1x1 Focus Mode**
- Drag the gutters between panels to test fluid resizing.

### 2. Live Chat & Code Prompting
- Ask coding questions in the agent panels.
- Click the **`+` (Add Media and Context)** button next to the composer to attach files, actions, skills, or connectors.

### 3. Session & Remote Mirroring
- Open the **More (...)** menu in the top right.
- Click **Copy Session URL** or **Copy Share Code** to mirror the workbench in an external browser or mobile device on your local network (running on port `4545`).

---

## 5. Feedback & Issue Reporting
If you notice any UI glitches, layout clipping, or behavior bugs on either macOS or Windows, please share:
1. OS (e.g. macOS Sonoma / Windows 11) & Cursor Version.
2. The active layout mode.
3. Console errors from `Help -> Toggle Developer Tools -> Console` (if any).

Thank you for helping us test Agento!

