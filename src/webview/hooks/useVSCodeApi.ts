import { WebviewToHostMessage } from '../types/workbench.js';

interface VSCodeApi {
  postMessage(message: WebviewToHostMessage): void;
  getState(): unknown;
  setState(state: unknown): void;
}

declare function acquireVsCodeApi(): VSCodeApi;

let vscodeApiInstance: VSCodeApi | undefined;

export function getVSCodeApi(): VSCodeApi {
  if (!vscodeApiInstance) {
    if (typeof acquireVsCodeApi === 'function') {
      vscodeApiInstance = acquireVsCodeApi();
    } else {
      // Mock for browser/testing environment
      vscodeApiInstance = {
        postMessage: (msg: WebviewToHostMessage) => console.log('[Mock VS Code postMessage]', msg),
        getState: () => ({}),
        setState: (st: unknown) => console.log('[Mock VS Code setState]', st),
      };
    }
  }
  return vscodeApiInstance;
}
