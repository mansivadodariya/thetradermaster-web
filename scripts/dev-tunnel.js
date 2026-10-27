const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// 1. Read .env.tunnel file
const envPath = path.resolve(__dirname, '../.env.tunnel');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val.replace(/\\n/g, '\n');
    }
  }
}

// Set dedicated build & cache directory so it can run alongside port 3000 without lock conflicts
process.env.NEXT_DIST_DIR = '.next-tunnel';

// 2. Spawn Next.js dev server with loaded environment variables
const nextBin = path.resolve(__dirname, '../node_modules/next/dist/bin/next');
const extraArgs = process.argv.slice(2);
const hasPort = extraArgs.includes('-p') || extraArgs.includes('--port');
const defaultArgs = ['dev', '--webpack', ...(hasPort ? [] : ['-p', '3001'])];
const args = [...defaultArgs, ...extraArgs];

console.log(`\x1b[32m[TraderMaster]\x1b[0m Starting Next.js with .env.tunnel on port ${hasPort ? 'custom' : '3001'}...`);
console.log(`\x1b[32m[TraderMaster]\x1b[0m Backend URL: ${process.env.NEXT_PUBLIC_BACKEND_URL}`);

const child = spawn(process.execPath, [nextBin, ...args], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
