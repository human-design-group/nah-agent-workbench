import * as http from 'http';
import * as https from 'https';
import { spawn } from 'child_process';
import { AgentChatMessage, ToolCallBadge, AttachedContextItem } from '../types/workbench';

export interface RunAgentOptions {
  agentId: string;
  agentName: string;
  agentKey: string;
  userPrompt: string;
  history: AgentChatMessage[];
  model?: string;
  apiEndpoint?: string;
  apiKey?: string;
  contextAttachments?: AttachedContextItem[];
  onStart?: () => void;
  onChunk?: (chunk: string, fullAccumulated: string) => void;
  onToolCall?: (toolCall: ToolCallBadge) => void;
  onComplete?: (message: AgentChatMessage) => void;
  onError?: (err: Error) => void;
}

const UNIVERSAL_SYSTEM_PROMPTS: Record<string, string> = {
  'claude-code': 'You are Claude Code, an agentic coding assistant by Anthropic. You write clean, precise, modern code and reason clearly.',
  'codex-chatgpt': 'You are ChatGPT / Codex, an autonomous software development assistant powered by OpenAI. You excel at debugging, algorithms, and implementation.',
  'cursor-agent': 'You are the Cursor Native Agent. You specialize in full-codebase multi-file refactoring and IDE productivity.',
  'opencode': 'You are OpenCode, an open-source autonomous terminal software engineer and code architect.',
  'hermes': 'You are Hermes Agent, a task planning and reasoning coordinator with structured tool calling and verification.',
  'openclaw': 'You are OpenClaw, a system operator specializing in terminal workflows, shell automation, and scripting.',
  'gemini-cli': 'You are Gemini / Astro, a generalist multi-modal assistant from Google capable of reasoning across complex files.',
  'aider': 'You are Aider, a pair programming coding assistant focused on fast git-driven edits and clean diffs.',
  'ollama': 'You are a local LLM assistant running via Ollama. You provide helpful, offline code and text generation.',
};

const DEFAULT_MODELS_FOR_AGENT: Record<string, string> = {
  'claude-code': 'claude-3-7-sonnet',
  'codex-chatgpt': 'gpt-5-codex',
  'cursor-agent': 'cursor-default',
  'opencode': 'opencode-go/deepseek-v4-pro',
  'hermes': 'uno-production',
  'openclaw': 'humano-assistant',
  'gemini-cli': 'gemini-2.5-flash',
  'aider': 'aider-code',
  'ollama': 'llama3.3:latest',
};

export class AgentRunner {
  public static async executeAgentPrompt(options: RunAgentOptions): Promise<void> {
    const {
      agentId,
      agentName,
      agentKey,
      userPrompt,
      history,
      model,
      apiEndpoint,
      apiKey,
      contextAttachments,
      onStart,
      onChunk,
      onComplete,
      onError,
    } = options;

    const selectedModel = model || DEFAULT_MODELS_FOR_AGENT[agentKey] || 'gpt-4o';
    const systemPersona = UNIVERSAL_SYSTEM_PROMPTS[agentKey] || `You are ${agentName}, an intelligent assistant in Agent Workbench.`;

    // 1. Build messages payload
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemPersona },
    ];

    // Include recent history (last 8 turns)
    const recentHistory = history.slice(-8);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content,
      });
    }

    // Attach Context files if any
    let fullUserContent = userPrompt;
    if (contextAttachments && contextAttachments.length > 0) {
      let contextStr = '\n\n---\n### Attached Workspace Context:\n';
      for (const att of contextAttachments) {
        contextStr += `\n**[${att.type.toUpperCase()}] ${att.title}:**\n\`\`\`\n${att.content.slice(0, 10000)}\n\`\`\`\n`;
      }
      fullUserContent += contextStr;
    }

    messages.push({ role: 'user', content: fullUserContent });

    const startTime = Date.now();
    let accumulatedContent = '';

    if (onStart) onStart();

    // Determine target endpoint
    let targetHost = 'localhost';
    let targetPort: number | string = 20128;
    let targetPath = '/v1/chat/completions';
    let isHttps = false;

    if (apiEndpoint && apiEndpoint.trim()) {
      try {
        const parsedUrl = new URL(apiEndpoint);
        targetHost = parsedUrl.hostname;
        targetPort = parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80);
        targetPath = parsedUrl.pathname.endsWith('/chat/completions')
          ? parsedUrl.pathname
          : parsedUrl.pathname.replace(/\/?$/, '/v1/chat/completions');
        isHttps = parsedUrl.protocol === 'https:';
      } catch {
        // Fallback to default
      }
    }

    const requestPayload = JSON.stringify({
      model: selectedModel,
      messages,
      stream: true,
      max_tokens: 4096,
      temperature: 0.7,
    });

    const headers: Record<string, string | number> = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestPayload),
    };

    if (apiKey && apiKey.trim()) {
      headers['Authorization'] = `Bearer ${apiKey.trim()}`;
    }

    const clientLib = isHttps ? https : http;

    try {
      const req = clientLib.request(
        {
          hostname: targetHost,
          port: targetPort,
          path: targetPath,
          method: 'POST',
          headers,
          timeout: 45000,
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 400) {
            let errData = '';
            res.on('data', (d) => (errData += d));
            res.on('end', () => {
              // Graceful fallback response if local endpoint is not running
              const errorMsg = `Endpoint returned HTTP ${res.statusCode}: ${errData || 'Connection refused or model unavailable'}`;
              const fallbackResponse: AgentChatMessage = {
                id: 'err_' + Date.now(),
                sender: 'agent',
                senderName: agentName,
                content: `⚠️ **${agentName} Connection Notice:**\n\nCould not reach the model endpoint at \`${targetHost}:${targetPort}\`.\n\n- If using **${agentName}**, please ensure your local gateway or CLI is running, or add your API Key in **Extension Settings -> Model Routing**.\n- Detailed error: \`${errorMsg.slice(0, 200)}\``,
                tokens: 0,
                latencyMs: Date.now() - startTime,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
              if (onComplete) onComplete(fallbackResponse);
            });
            return;
          }

          let buffer = '';
          res.on('data', (chunk: Buffer) => {
            buffer += chunk.toString();
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed.startsWith(':')) continue;
              if (trimmed === 'data: [DONE]') continue;

              if (trimmed.startsWith('data: ')) {
                const jsonStr = trimmed.slice(6);
                try {
                  const parsed = JSON.parse(jsonStr);
                  const delta = parsed.choices?.[0]?.delta?.content || '';
                  if (delta) {
                    accumulatedContent += delta;
                    if (onChunk) onChunk(delta, accumulatedContent);
                  }
                } catch {
                  // Ignore partial json parse
                }
              }
            }
          });

          res.on('end', () => {
            const latencyMs = Date.now() - startTime;
            const finalMessage: AgentChatMessage = {
              id: 'msg_' + Date.now(),
              sender: 'agent',
              senderName: agentName,
              content: accumulatedContent || `Ready! ${agentName} received your prompt.`,
              tokens: Math.round(accumulatedContent.length / 4),
              latencyMs,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            if (onComplete) onComplete(finalMessage);
          });
        }
      );

      req.on('error', (err) => {
        // If connection fails (e.g. ECONNREFUSED on port 20128 for a user without OmniRoute)
        const friendlyFallback: AgentChatMessage = {
          id: 'fb_' + Date.now(),
          sender: 'agent',
          senderName: agentName,
          content: `👋 **${agentName} is ready!**\n\nI received your prompt: *"${userPrompt}"*\n\n*(To connect live streaming execution, enter your OpenAI / Anthropic API key in **Extension Settings**, or run your local agent daemon.)*`,
          tokens: 45,
          latencyMs: Date.now() - startTime,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        if (onComplete) onComplete(friendlyFallback);
      });

      req.on('timeout', () => {
        req.destroy();
        if (onError) onError(new Error('Agent request timed out after 45s.'));
      });

      req.write(requestPayload);
      req.end();
    } catch (e: any) {
      if (onError) onError(e);
    }
  }
}
