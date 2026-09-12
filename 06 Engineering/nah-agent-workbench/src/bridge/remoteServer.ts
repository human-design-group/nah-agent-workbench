import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface RemoteServerOptions {
  port?: number;
  extensionPath: string;
  onClientMessage?: (msg: any) => void;
}

export class RemoteControlServer {
  private server: http.Server | null = null;
  private port: number = 4545;
  private shareCode: string = '';
  private extensionPath: string;
  private onClientMessage?: (msg: any) => void;
  private sseClients: Set<http.ServerResponse> = new Set();

  constructor(options: RemoteServerOptions) {
    this.port = options.port || 4545;
    this.extensionPath = options.extensionPath;
    this.onClientMessage = options.onClientMessage;
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
    const urlObj = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const urlPath = urlObj.pathname;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // SSE Stream endpoint for remote clients
    if (urlPath === '/api/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });
      res.write(`data: ${JSON.stringify({ type: 'CONNECTED', port: this.port, shareCode: this.shareCode })}\n\n`);
      this.sseClients.add(res);

      req.on('close', () => {
        this.sseClients.delete(res);
      });
      return;
    }

    // Message POST endpoint
    if (urlPath === '/api/message' && req.method === 'POST') {
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (this.onClientMessage) {
            this.onClientMessage(parsed);
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } catch (e: any) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    // Serve HTML
    if (urlPath === '/' || urlPath === '/index.html') {
      const indexPath = path.join(this.extensionPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync(indexPath));
        return;
      }
    }

    // Serve static dist files
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

    res.writeHead(404);
    res.end('Not Found');
  }

  public broadcast(message: any) {
    const data = `data: ${JSON.stringify(message)}\n\n`;
    for (const client of this.sseClients) {
      try {
        client.write(data);
      } catch {
        this.sseClients.delete(client);
      }
    }
  }

  public stop() {
    for (const client of this.sseClients) {
      try {
        client.end();
      } catch {}
    }
    this.sseClients.clear();
    this.server?.close();
  }
}
