import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { WebSocketServer, WebSocket } from 'ws';

export interface RemoteServerOptions {
  port?: number;
  extensionPath: string;
  onClientMessage?: (msg: any) => void;
  onA2aSend?: (to: string, task: string, from?: string) => Promise<any>;
  onA2aListAgents?: () => any[];
}

export class RemoteControlServer {
  private server: http.Server | null = null;
  private wss: WebSocketServer | null = null;
  private port: number = 4545;
  private shareCode: string = '';
  private extensionPath: string;
  private onClientMessage?: (msg: any) => void;
  private onA2aSend?: (to: string, task: string, from?: string) => Promise<any>;
  private onA2aListAgents?: () => any[];
  private connectedSockets: Set<WebSocket> = new Set();

  constructor(options: RemoteServerOptions) {
    this.port = options.port || 4545;
    this.extensionPath = options.extensionPath;
    this.onClientMessage = options.onClientMessage;
    this.onA2aSend = options.onA2aSend;
    this.onA2aListAgents = options.onA2aListAgents;
    this.shareCode = this.generateShareCode();
  }

  private generateShareCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  public getPort(): number {
    return this.port;
  }

  public getShareCode(): string {
    return this.shareCode;
  }

  public getLocalIp(): string {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
    return '127.0.0.1';
  }

  public getWorkspaceUrl(): string {
    const ip = this.getLocalIp();
    return `http://${ip}:${this.port}/`;
  }

  public getCurrentSessionUrl(agentId?: string): string {
    const ip = this.getLocalIp();
    return `http://${ip}:${this.port}/?session=${agentId || 'active'}`;
  }

  public start(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        this.handleHttpRequest(req, res);
      });

      this.wss = new WebSocketServer({ server: this.server, path: '/ws' });

      this.wss.on('connection', (ws: WebSocket) => {
        this.connectedSockets.add(ws);

        ws.on('message', (data: string) => {
          try {
            const parsed = JSON.parse(data.toString());
            if (this.onClientMessage) {
              this.onClientMessage(parsed);
            }
          } catch (e) {
            console.error('[RemoteServer] Invalid WebSocket payload:', e);
          }
        });

        ws.on('close', () => {
          this.connectedSockets.delete(ws);
        });

        // Send initial connection ack
        ws.send(
          JSON.stringify({
            type: 'CONNECTED',
            payload: {
              port: this.port,
              shareCode: this.shareCode,
            },
          })
        );
      });

      this.server.listen(this.port, '0.0.0.0', () => {
        console.log(`[RemoteServer] Running on http://0.0.0.0:${this.port}`);
        resolve(this.port);
      });

      this.server.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          console.warn(`[RemoteServer] Port ${this.port} in use, trying next port...`);
          this.port += 1;
          this.server?.listen(this.port, '0.0.0.0');
        } else {
          reject(err);
        }
      });
    });
  }

  private handleHttpRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const urlPath = req.url?.split('?')[0] || '/';

    if (urlPath === '/' || urlPath === '/index.html') {
      const indexPath = path.join(this.extensionPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync(indexPath));
        return;
      }
    }

    if (urlPath.startsWith('/dist/')) {
      const filePath = path.join(this.extensionPath, urlPath);
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath);
        const contentType =
          ext === '.js'
            ? 'application/javascript'
            : ext === '.css'
            ? 'text/css'
            : ext === '.map'
            ? 'application/json'
            : 'text/plain';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(fs.readFileSync(filePath));
        return;
      }
    }

    // Health / info endpoint
    if (urlPath === '/api/info') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          app: 'Agent Workbench',
          version: '0.1.0',
          port: this.port,
          shareCode: this.shareCode,
          workspaceUrl: this.getWorkspaceUrl(),
        })
      );
      return;
    }

    // A2A List endpoint
    if (urlPath === '/api/a2a/agents' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const agents = this.onA2aListAgents ? this.onA2aListAgents() : [
        { key: 'uno', name: 'Uno', role: 'Chief of Staff & Strategic Lead', runtime: 'Hermes' },
        { key: 'omo', name: 'Omo', role: 'Lead Developer & Engineering Lead', runtime: 'Hermes' },
        { key: 'gravito', name: 'Gravito', role: 'AI Systems Engineer', runtime: 'Antigravity' },
        { key: 'astro', name: 'Astro', role: 'AI Systems Architect & Ideator', runtime: 'Hermes' },
        { key: 'humano', name: 'Humano', role: 'Community & Design Specialist', runtime: 'Hermes' },
        { key: 'curso', name: 'Curso', role: 'Ephemeral Developer (Editor Specialist)', runtime: 'Cursor IDE' },
      ];
      res.end(JSON.stringify({ ok: true, agents }));
      return;
    }

    // A2A Send / Delegation endpoint
    if (urlPath === '/api/a2a/send' && req.method === 'POST') {
      let bodyData = '';
      req.on('data', (chunk) => (bodyData += chunk));
      req.on('end', async () => {
        try {
          const parsed = JSON.parse(bodyData || '{}');
          const { to, task, from } = parsed;
          if (!to || !task) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: false, error: 'Fields "to" and "task" are required.' }));
            return;
          }

          if (this.onA2aSend) {
            const result = await this.onA2aSend(to, task, from);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true, ...result }));
          } else {
            res.writeHead(503, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: false, error: 'A2A dispatcher not connected.' }));
          }
        } catch (err: any) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: err.message }));
        }
      });
      return;
    }

    res.writeHead(404);
    res.end('Not Found');
  }

  public broadcast(message: any) {
    const data = JSON.stringify(message);
    for (const client of this.connectedSockets) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    }
  }

  public stop() {
    for (const client of this.connectedSockets) {
      client.close();
    }
    this.connectedSockets.clear();
    this.wss?.close();
    this.server?.close();
  }
}
