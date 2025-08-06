#!/usr/bin/env node

// Script alternativo para build:dev
const { spawn } = require('child_process');

const buildProcess = spawn('npx', ['vite', 'build', '--mode', 'development'], {
  stdio: 'inherit',
  shell: true
});

buildProcess.on('close', (code) => {
  process.exit(code);
});