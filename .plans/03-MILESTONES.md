# Agent Workbench — Milestone Roadmap

## Milestone 1: Visual Precision & Figma Alignment (CURRENT)
- [x] Extract Figma node trees for `2001:213` (2x2 grid) and `2011:2051` (1x4 vertical).
- [x] Implement 2-row header (runtime dot, session selector, git status badges, fork button).
- [x] Multi-control composer (Permissions selector, OmniRoute model dropdown, voice wave, send button).
- [x] Hot-reloadable Live Preview daemon on port `5173`.
- [ ] Drag-and-drop panel reordering with custom layout persistence.

## Milestone 2: Multi-Agent ACP / A2A Live Engine
- [x] Establish canonical GSD, Superpowers, and GStack registries for all agents.
- [ ] Live WebSocket streaming to `openclaw-acp` and `hermes` gateways.
- [ ] Multi-tab instance management (instantiate 2+ independent sessions for the same agent).
- [ ] Bi-directional chat memory sync with `nah-remember` and `nah-knows`.

## Milestone 3: Cursor Event Interception & Non-Interactive Relay
- [ ] Cursor Live Select event listener bridge.
- [ ] Route Curso review requests and user IDE comments to Astro/Uno for supervisory steering.
- [ ] One-click action to inject workspace context into active agent prompt.

## Milestone 4: Extension Packaging, Marketplace Release & CI/CD
- [x] Initial `.vsix` packaging and local verification.
- [ ] Automated GitHub Actions release pipeline (`human-design-group/nah-agent-workbench`).
- [ ] Publish to VS Code & Open VSX Marketplaces.
- [ ] Comprehensive documentation and marketing showcase landing.
