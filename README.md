# Agento — Agent Workbench

[![Release](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/human-design-group/nah-agent-workbench)
[![Platform](https://img.shields.io/badge/platform-Cursor%20%7C%20VS%20Code%20%7C%20AgentOS-85BFD1.svg)](https://github.com/human-design-group/nah-agent-workbench)
[![Kanban](https://img.shields.io/badge/project-Kanban%20Board-success.svg)](https://github.com/orgs/human-design-group/projects/1)

**Agento** (*Agento — Agent Workbench*) is an official **Human Design Group** product delivering a unified multi-agent mission control dashboard and responsive grid for Cursor, VS Code, and notahuman AgentOS.

---

## Key Features

- **Dynamic Multi-Agent Grid**: Responsive 2x2 grid, 1x4 vertical columns, horizontal rows, and 1+2 split with butter-smooth draggable resize gutters.
- **Parallel Agent Orchestration**: Simultaneous interaction across AntiGravity (Astro), OpenClaw (Humano), Hermes (Uno), and OpenCode (Omo).
- **Git Worktree & Context Visibility**: Live status for workspace folders, active branches, modified/staged files, and instant branch forking.
- **OmniRoute & Permissions Control**: In-card model selection (OmniRoute, Gemini, Claude) and fine-grained auto-approve permissions.

---

## Live Development & Preview

Start the live browser preview server:
```bash
python3 -m http.server 5173 --directory infrastructure/nah-workbench
```
Open `http://localhost:5173` in Cursor's browser (`Cmd+Shift+P` -> `Simple Browser: Show`) to inspect elements and tweak styles in real time.

---

## Build & Install

```bash
npm run install-ext
```

