import * as http from 'http';
import { AgentChatMessage, ToolCallBadge } from '../webview/types/workbench';

export interface RunAgentOptions {
  agentId: string;
  agentName: string;
  userPrompt: string;
  history: AgentChatMessage[];
  model?: string;
  contextAttachments?: Array<{ title: string; content: string; type: string }>;
  onStart?: () => void;
  onChunk?: (chunk: string, fullAccumulated: string) => void;
  onToolCall?: (toolCall: ToolCallBadge) => void;
  onComplete?: (message: AgentChatMessage) => void;
  onError?: (err: Error) => void;
}

const AGENT_SYSTEM_PROMPTS: Record<string, string> = {
  astro: 'You are Astro, the Generalist Reasoning and Autonomous Coding Agent in Agent Workbench. You provide clear, concise, actionable code and solutions.',
  humano: 'You are Humano, the System Operator & Terminal Execution Agent in Agent Workbench. You excel at operational tooling, scripts, and workflows.',
  uno: 'You are Uno, the Strategist & Task Planner in Agent Workbench. You excel at structured task breakdown, architectural review, and verification plans.',
  omo: 'You are Omo, the Lead Codebase Architect in Agent Workbench. You write robust, elegant, production-grade TypeScript/JavaScript/Python code.',
};

const DEFAULT_AGENT_MODELS: Record<string, string> = {
  astro: 'curso-production',
  humano: 'humano-assistant',
  uno: 'uno-production',
  omo: 'omo-production',
};

export class AgentRunner {
  public static async executeAgentPrompt(options: RunAgentOptions): Promise<void> {
    const {
      agentId,
      userPrompt,
      history,
      model,
      contextAttachments,
      onStart,
      onChunk,
      onComplete,
      onError,
    } = options;

    const selectedModel = model || DEFAULT_AGENT_MODELS[agentId.toLowerCase()] || 'curso-production';
    const systemPersona = AGENT_SYSTEM_PROMPTS[agentId.toLowerCase()] || 'You are an AI assistant in Agent Workbench.';

    // Construct prompt messages
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemPersona },
    ];

    // Include recent history (last 10 turns)
    const recentHistory = history.slice(-10);
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
    let isThinking = false;
    let thinkingContent = '';

    if (onStart) onStart();

    const requestPayload = JSON.stringify({
      model: selectedModel,
      messages,
      stream: true,
      max_tokens: 4096,
      temperature: 0.7,
    });

    try {
      const req = http.request(
        {
          hostname: 'localhost',
          port: 20128,
          path: '/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestPayload),
          },
          timeout: 45000,
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 400) {
            let errData = '';
            res.on('data', (d) => (errData += d));
            res.on('end', () => {
              const err = new Error(`OmniRoute error (${res.statusCode}): ${errData}`);
              if (onError) onError(err);
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
                  // Partial JSON, ignore
                }
              }
            }
          });

          res.on('end', () => {
            const latencyMs = Date.now() - startTime;
            const finalMessage: AgentChatMessage = {
              id: 'msg_' + Date.now(),
              sender: 'agent',
              senderName: options.agentName,
              content: accumulatedContent || 'No response content generated.',
              tokens: Math.round(accumulatedContent.length / 4),
              latencyMs,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            };
            if (onComplete) onComplete(finalMessage);
          });
        }
      );

      req.on('error', (err) => {
        if (onError) onError(err);
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
