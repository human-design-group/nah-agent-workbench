# Agent Workbench (nah-workbench) — Product Specification
**Product:** Agent Workbench (`nah-workbench`)
**Organization:** Human Design Group (HDG)
**Author:** AntiGravity (Astro) & HDG Core Team
**Status:** In Active Development (Milestone 1)

---

## 1. Vision & Purpose
Agent Workbench is the unified multi-agent mission control extension for Cursor and VS Code. It solves the fundamental limitation of modern AI IDEs by enabling side-by-side, concurrently running, visual multi-agent orchestration (Astro, Curso, Uno, Omo, Humano).

It serves as the production prototype and desktop extension precursor for the standalone **notahuman AgentOS** platform.

---

## 2. Core Functional Requirements

### 2.1 Multi-Agent Grid & Layout Management
- **Preset Layouts**:
  - `2x2 Grid` (Matching Figma Node `2001:213`): 4 simultaneous agent panels with drag handles.
  - `1x4 Vertical Strip` (Matching Figma Node `2011:2051`): Column-based multi-agent view.
  - `1x1 Focus Mode`: Full-screen single agent deep-work view.
  - `Custom N-Grid`: User-defined multi-agent panels with drag-and-drop repositioning and persistent resizing (`react-resizable-panels`).
- **Panel Controls**:
  - Add / Remove agent instances dynamically.
  - Agent switcher dropdown (`Astro / AntiGravity`, `Curso / Cursor`, `Uno / Hermes`, `Omo / OpenCode`, `Humano / OpenClaw`).
  - Runtime indicators: Live status pulse (`● Active`, `○ Idle`, `▲ Working`).
  - Active session selector with branch context (`*14 +28 !253 ?73318`).
  - Instant Fork action (`[⑂ Fork]`) to branch agent sub-conversations.

### 2.2 Chat & Execution Interface
- **Figma-Aligned UI**:
  - Exact token matching from Figma file `3ptQW6Ah2kX0QJYJlT4uJv`.
  - Message bubble styling with markdown rendering, syntax highlighting, diff viewer, and collapsed thinking blocks.
- **Composer Controls**:
  - OmniRoute Model Selector (GPT-5, Claude 3.7 Sonnet, Gemini 2.5 Flash, DeepSeek-R1).
  - Mode / Permissions toggle (`Bypass`, `Supervised`, `Autonomous`).
  - Real-time Voice Waveform Visualizer & audio transcription input.
  - Circular send button with keyboard shortcuts (`Cmd+Enter`, `Shift+Enter`).

### 2.3 Inter-Agent Communication (ACP / A2A)
- Bi-directional agent event router.
- Cursor IDE Event Interception: Forward user comments and Live Select clicks directly to Astro / Uno for triage and instructions before delegating to Curso.
- Shared agent message bus.

---

## 3. Definition of Done
1. VSIX extension builds cleanly and installs via `cursor --install-extension`.
2. Responsive 2x2 and 1x4 layouts match Figma nodes pixel-for-pixel.
3. Real-time ACP communication connects all 5 agent runtimes with live message streaming.
4. CI/CD automated packaging and GitHub Release pipeline verified.
