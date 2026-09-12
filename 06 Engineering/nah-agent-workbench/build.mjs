import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

const isWatch = process.argv.includes('--watch');

const extensionConfig = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  sourcemap: true,
  logLevel: 'info',
};

const webviewConfig = {
  entryPoints: ['src/webview/index.tsx'],
  bundle: true,
  outfile: 'dist/webview.js',
  format: 'iife',
  platform: 'browser',
  target: 'es2022',
  sourcemap: true,
  loader: {
    '.css': 'css',
    '.svg': 'text',
  },
  logLevel: 'info',
  define: {
    'process.env.NODE_ENV': '"production"',
  }
};

async function build() {
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  if (isWatch) {
    const extCtx = await esbuild.context(extensionConfig);
    const webviewCtx = await esbuild.context(webviewConfig);
    await extCtx.watch();
    await webviewCtx.watch();
    console.log('Watching for changes in extension and webview...');
  } else {
    await esbuild.build(extensionConfig);
    await esbuild.build(webviewConfig);
    console.log('Build complete: dist/extension.js and dist/webview.js');
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
