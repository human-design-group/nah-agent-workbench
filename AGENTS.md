---
type: agent-instructions
scope: project
project: Agent Workbench
slug: nah-agent-workbench
org: human-design-group
brand: human design group
applies_to: [astro, humano, uno, omo, etho, ordo, servo, vero, codo]
runtime: [antigravity, claude, hermes, openclaw, opencode, codex]
---

# Agent Ground-Truth — Agent Workbench

> Canonical and runtime-agnostic ground truth for the **Agent Workbench** product.
> ANY agent operating in this project starts here.
> Claude Code, AntiGravity, OpenClaw, Hermes, and OpenCode specifics inherit from the notahuman root (`~/.claude/` + `.notahuman/rules/`).

## Project Overview
**Agent Workbench** is a multi-agent mission control & responsive grid environment built for Cursor, VS Code, and the notahuman AgentOS. It solves IDE workspace layout limitations by providing dynamic 2x2 grids, vertical columns, and horizontal stream views for parallel AI agent orchestration.

## Orient (in order)
1. `PROJECT.md` — identity, scope, org, secret tags, GitHub repo & Kanban links.
2. `PROJECT_STATUS.md` — active milestone progress, release gates, and Kanban board status.
3. `.planning/STATE.md` — active sprint state.
4. `context/` — voice, design tokens, architecture, and current state.

## How to operate here
- **Plan with GSD & Kanban.** Work is tracked on the official [GitHub Project Board](https://github.com/orgs/human-design-group/projects/1).
- **Public Product Quality.** Code, tests, and documentation must adhere to public marketplace standards.
- **Secrets -> nah-nexus only.** Reference tags in `PROJECT.md`; pull at runtime with `nah-nexus vault get <TAG>`. Never commit secrets.
- **Capture as you go.** `inbox/` (raw) -> `knowledge/` (distilled) -> `tasks/` (tracked).

## Engineering Structure
- `06 Engineering/nah-agent-workbench/` — Core TypeScript + React extension codebase, test harnesses, and VSIX packaging scripts.
