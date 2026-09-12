# Agent Workbench — System Architecture

```mermaid
graph TD
    User([User / Developer]) -->|Interact| UI[React 19 Webview UI]
    UI -->|VS Code Webview IPC| ExtHost[Extension Host - extension.ts]
    
    subgraph Extension Core
        ExtHost --> LayoutMgr[Layout & Panel State Manager]
        ExtHost --> Router[A2A & ACP Message Router]
        ExtHost --> LiveSelect[Cursor Live Select Interceptor]
    end

    subgraph Runtimes & Backends
        Router -->|Stdio / WebSocket| ACP[ACP Pro Agent Gateway]
        Router -->|HTTP / SSE| OmniRoute[OmniRoute Model Gateway :20128]
        Router -->|MCP Bridge| FigmaBridge[nah-figma HTTP Bridge :7771]
        Router -->|Stdio| NahBridge[nah-bridge MCP]
    end

    subgraph Agents
        ACP --> Astro[AntiGravity / Astro]
        ACP --> Curso[Cursor Agent / Curso]
        ACP --> Uno[Hermes Gateway / Uno]
        ACP --> Omo[OpenCode / Omo]
        ACP --> Humano[OpenClaw / Humano]
    end
```

## Technical Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, `lucide-react`, `react-resizable-panels`.
- **Bundler**: `esbuild` with incremental fast-build watch mode.
- **IPC Layer**: VS Code Webview Message Passing + native WebSocket client.
- **State Persistence**: `vscode.ExtensionContext.workspaceState` and `globalState`.
- **Packaging**: `@vscode/vsce` -> `.vsix`.
