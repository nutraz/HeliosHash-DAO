#!/usr/bin/env node

/**
 * Z2HHDAO - Zero-to-HeliosHash DAO CLI
 * Entry point
 */

const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { execaCommand, execa } = require('execa');
const detect = require('detect-port');
const open = require('open');

const HOME = process.env.HOME || process.env.USERPROFILE;
const PROJECT_DIR = path.join(HOME, 'HeliosHash-DAO');
const LOG_DIR = path.join(PROJECT_DIR, '.logs');
const BACKEND_DIR = path.join(PROJECT_DIR, 'apps', 'backend');
const FRONTEND_DIR = path.join(PROJECT_DIR, 'apps', 'web');
const CANISTERS_DIR = path.join(PROJECT_DIR, 'canisters');

const RECOMMENDED_VSCODE_EXTS = [
  'dbaeumer.vscode-eslint',
  'esbenp.prettier-vscode',
  'octref.vetur',             // remove/replace if not needed, example
  'svelte.svelte-vscode',     // example - keep only those you want
  'ms-vscode.vscode-node-azure-pack',
  'shardlabs.solidity',
  'ms-vscode.cpptools',
  'vscode-icons-team.vscode-icons',
  'ms-azuretools.vscode-docker'
];

async function run(cmd, opts = {}) {
  try {
    const p = execaCommand(cmd, Object.assign({ stdio: 'inherit', shell: true }, opts));
    await p;
    return true;
  } catch (err) {
    // Return the error object so caller can decide
    return err;
  }
}

async function checkCommandExists(cmd) {
  try {
    await execaCommand(`command -v ${cmd}`);
    return true;
  } catch (e) {
    return false;
  }
}

async function ensureLogDir() {
  await fs.ensureDir(LOG_DIR);
}

async function detectPort(preferred) {
  const free = await detect(preferred);
  return free;
}

async function installVSCodeExtensions() {
  if (!(await checkCommandExists('code'))) {
    console.log(chalk.yellow('VS Code CLI `code` not found, skipping extension install.'));
    return;
  }

  for (const ext of RECOMMENDED_VSCODE_EXTS) {
    console.log(chalk.gray(`Installing extension: ${ext}`));
    try {
      await execaCommand(`code --install-extension ${ext} --force`);
    } catch (e) {
      console.log(chalk.red(`Failed installing ${ext}:`), e.message);
    }
  }
  console.log(chalk.green('VS Code recommended extensions processed.'));
}

async function dfxStartAuto() {
  // prefer 4943, fallback to 4944, 4945...
  let port = 4943;
  for (let attempt = 0; attempt < 5; attempt++) {
    const free = await detectPort(port);
    if (free === port) break;
    port++;
  }
  console.log(chalk.blue(`Starting dfx on port ${port} (if available)`));
  // start dfx in background
  try {
    await execaCommand(`dfx start --background --host 127.0.0.1:${port} --clean`, { shell: true });
    return { ok: true, port };
  } catch (err) {
    return { ok: false, err, port };
  }
}

async function dfxDeployIfCanisters() {
  const dfxJson = path.join(CANISTERS_DIR, 'dfx.json');
  if (await fs.pathExists(dfxJson)) {
    console.log(chalk.blue('dfx.json found — deploying canisters...'));
    try {
      // run deploy in the canisters directory (or backend)
      await execaCommand(`cd ${CANISTERS_DIR} && dfx deploy`, { shell: true });
      console.log(chalk.green('Canisters deployed.'));
      return true;
    } catch (e) {
      console.log(chalk.red('dfx deploy failed:'), e.message);
      return false;
    }
  }
  console.log(chalk.gray('No dfx.json found — skipping canister deploy.'));
  return false;
}

async function startFrontend(port = 3002) {
  const free = await detectPort(port);
  if (free !== port) {
    console.log(chalk.yellow(`Port ${port} busy — using ${free} for frontend.`));
    port = free;
  }
  if (!(await fs.pathExists(FRONTEND_DIR))) {
    console.log(chalk.red(`Frontend folder not found: ${FRONTEND_DIR}`));
    return { ok: false };
  }
  console.log(chalk.blue(`Starting frontend at http://localhost:${port}`));
  const cmd = `cd ${FRONTEND_DIR} && pnpm install --silent && pnpm run dev -- -p ${port}`;
  // spawn as detached process and write logs
  const logFile = path.join(LOG_DIR, `frontend-${Date.now()}.log`);
  console.log(chalk.gray(`Logging frontend output to ${logFile}`));
  const child = execa(cmd, { shell: true, stdio: 'inherit' });
  // we don't await here so dev server keeps running in this process
  return { ok: true, port, log: logFile, proc: child };
}

async function startBackend() {
  if (!(await fs.pathExists(BACKEND_DIR))) {
    console.log(chalk.red(`Backend folder not found: ${BACKEND_DIR}`));
    return { ok: false };
  }

  console.log(chalk.blue('Installing backend dependencies...'));
  try {
    await execaCommand(`cd ${BACKEND_DIR} && pnpm install --silent`, { shell: true });
  } catch (e) {
    console.log(chalk.red('pnpm install (backend) failed:'), e.message);
  }

  console.log(chalk.blue('Starting backend (local) — using pnpm run dev (detached).'));
  const logFile = path.join(LOG_DIR, `backend-${Date.now()}.log`);
  console.log(chalk.gray(`Logging backend output to ${logFile}`));
  const cmd = `cd ${BACKEND_DIR} && pnpm run dev`;
  const child = execa(cmd, { shell: true, stdio: 'inherit' });
  return { ok: true, log: logFile, proc: child };
}

async function openVSCodeWindows(openBackend = true, openFrontend = true) {
  if (!(await checkCommandExists('code'))) {
    console.log(chalk.yellow('`code` CLI not available — skipping opening VS Code windows.'));
    return;
  }
  if (openBackend && (await fs.pathExists(BACKEND_DIR))) {
    console.log(chalk.gray('Opening backend in VS Code...'));
    await execaCommand(`code -n ${BACKEND_DIR}`);
  }
  if (openFrontend && (await fs.pathExists(FRONTEND_DIR))) {
    console.log(chalk.gray('Opening frontend in VS Code...'));
    await execaCommand(`code -n ${FRONTEND_DIR}`);
  }
}

async function stopAll() {
  console.log(chalk.blue('Stopping all known dev processes (pnpm, dfx based)...'));
  // try stopping dfx
  try { await execaCommand('dfx stop'); } catch (e) {}
  // pkill pnpm processes
  try { await execaCommand('pkill -f "pnpm run dev"'); } catch (e) {}
  console.log(chalk.green('Stop commands executed (best-effort).'));
}

async function diagnostics() {
  console.log(chalk.bold('\nSystem diagnostics:'));
  const checks = [
    { name: 'node', cmd: 'node -v' },
    { name: 'pnpm', cmd: 'pnpm -v' },
    { name: 'dfx', cmd: 'dfx --version' },
    { name: 'code', cmd: 'code --version' },
    { name: 'docker', cmd: 'docker -v' }
  ];
  for (const c of checks) {
    try {
      const { stdout } = await execaCommand(c.cmd);
      console.log(chalk.green(`${c.name}: ${stdout.split('\n')[0]}`));
    } catch (e) {
      console.log(chalk.yellow(`${c.name}: not found or failed`));
    }
  }
  console.log(chalk.bold('\nProject layout:'));
  console.log(`PROJECT_DIR: ${PROJECT_DIR}`);
  console.log(`Found backend: ${await fs.pathExists(BACKEND_DIR)}`);
  console.log(`Found frontend: ${await fs.pathExists(FRONTEND_DIR)}`);
  console.log(`Found canisters: ${await fs.pathExists(CANISTERS_DIR)}`);
  console.log(`Logs dir: ${LOG_DIR}`);
}

async function ensurePrereqs() {
  await ensureLogDir();
  const tools = ['node', 'pnpm', 'dfx'];
  const missing = [];
  for (const t of tools) {
    if (!(await checkCommandExists(t))) missing.push(t);
  }
  if (missing.length) {
    console.log(chalk.red('Missing required tools:'), missing.join(', '));
    console.log(chalk.yellow('Please install them before continuing.'));
    console.log(chalk.gray('Node: https://nodejs.org/'));
    console.log(chalk.gray('pnpm: https://pnpm.io/installation'));
    console.log(chalk.gray('dfx: https://smartcontracts.org/docs/developers-guide/quickstart/'));
    // we stop so user can install them; the CLI is not trying to sudo-install system packages.
    return false;
  }
  return true;
}

async function main() {
  console.clear();
  console.log(chalk.cyan.bold('\nZ2HHDAO — Zero-to-HeliosHash-DAO Dev Bootstrapper\n'));

  const ok = await ensurePrereqs();
  if (!ok) return;

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        { name: 'Start full stack (canisters + backend + frontend)', value: 'full' },
        { name: 'Start backend only (canisters + backend)', value: 'backend' },
        { name: 'Start frontend only', value: 'frontend' },
        { name: 'Clean & rebuild all (dfx --clean + pnpm install)', value: 'clean' },
        { name: 'Install recommended VS Code extensions', value: 'vscode-exts' },
        { name: 'Diagnostics', value: 'diag' },
        { name: 'Stop all dev processes', value: 'stop' },
        { name: 'Quit', value: 'quit' }
      ]
    }
  ]);

  switch (answer.action) {
    case 'full': {
      const dfxRes = await dfxStartAuto();
      if (!dfxRes.ok) {
        console.log(chalk.red('dfx start failed — you may need to stop other services or free ports.'));
      } else {
        console.log(chalk.green(`dfx started on port ${dfxRes.port}`));
      }
      await dfxDeployIfCanisters();
      await startBackend();
      const frontendPort = await detectPort(3002);
      await startFrontend(frontendPort);
      await openVSCodeWindows(true, true);
      console.log(chalk.green('\nFull stack start requested. Check logs in ' + LOG_DIR));
      break;
    }

    case 'backend': {
      const dfxRes = await dfxStartAuto();
      if (!dfxRes.ok) console.log(chalk.red('dfx start failed'));
      else console.log(chalk.green(`dfx started on port ${dfxRes.port}`));
      await dfxDeployIfCanisters();
      await startBackend();
      await openVSCodeWindows(true, false);
      break;
    }

    case 'frontend': {
      const port = await detectPort(3002);
      await startFrontend(port);
      await openVSCodeWindows(false, true);
      break;
    }

    case 'clean': {
      console.log(chalk.blue('Cleaning everything...'));
      try { await execaCommand(`pkill -f "pnpm run dev" || true`); } catch (e) {}
      try { await execaCommand(`dfx stop || true`); } catch (e) {}
      try {
        console.log(chalk.gray('Reinstalling frontend and backend dependencies...'));
        if (await fs.pathExists(FRONTEND_DIR)) await execaCommand(`cd ${FRONTEND_DIR} && pnpm install --force`, { shell: true });
        if (await fs.pathExists(BACKEND_DIR)) await execaCommand(`cd ${BACKEND_DIR} && pnpm install --force`, { shell: true });
      } catch (e) {
        console.log(chalk.red('Reinstall failed:'), e.message);
      }
      console.log(chalk.green('Clean & rebuild done.'));
      break;
    }

    case 'vscode-exts': {
      await installVSCodeExtensions();
      break;
    }

    case 'diag': {
      await diagnostics();
      break;
    }

    case 'stop': {
      await stopAll();
      break;
    }

    case 'quit':
    default:
      console.log('Bye.');
      process.exit(0);
  }
}

main().catch(err => {
  console.error(chalk.red('Fatal error:'), err);
  process.exit(1);
});

