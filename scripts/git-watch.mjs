import fs from "fs";
import path from "path";
import { exec } from "child_process";

// Configuration
const WATCH_DIRS = ["src", "supabase"];
const WATCH_FILES = ["package.json", "tailwind.config.ts", "next.config.mjs"];
const DEBOUNCE_MS = 5000; // Wait 5 seconds after the last change before pushing
const ROOT_DIR = process.cwd();

let debounceTimer = null;
let changedFiles = new Set();

console.log("=========================================");
console.log("      AuditLife Git Sync Watcher         ");
console.log("=========================================");
console.log(`Watching directories: ${WATCH_DIRS.join(", ")}`);
console.log(`Watching root files: ${WATCH_FILES.join(", ")}`);
console.log(`Sync delay: ${DEBOUNCE_MS / 1000}s after last change`);
console.log("=========================================\n");

// Execute command and return promise
function runCommand(command) {
  return new Promise((resolve) => {
    exec(command, { cwd: ROOT_DIR }, (error, stdout, stderr) => {
      resolve({
        success: !error,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        error,
      });
    });
  });
}

// Perform Git synchronization
async function syncChanges() {
  console.log(`[${new Date().toLocaleTimeString()}] Change detected in:`);
  for (const file of changedFiles) {
    console.log(`  - ${file}`);
  }
  changedFiles.clear();

  console.log(`[${new Date().toLocaleTimeString()}] Checking git status...`);
  const status = await runCommand("git status --porcelain");
  
  if (!status.success) {
    console.error("Error running git status:", status.stderr);
    return;
  }

  if (!status.stdout) {
    console.log("No changes to sync.");
    return;
  }

  console.log("Staging changes...");
  const addResult = await runCommand("git add .");
  if (!addResult.success) {
    console.error("Error staging changes:", addResult.stderr);
    return;
  }

  console.log("Committing changes...");
  const commitMsg = `auto: sync workspace updates - ${new Date().toLocaleString()}`;
  const commitResult = await runCommand(`git commit -m "${commitMsg}"`);
  if (!commitResult.success) {
    console.error("Error committing changes:", commitResult.stderr);
    return;
  }
  console.log(`Committed: ${commitMsg}`);

  console.log("Pushing to GitHub (origin main)...");
  const pushResult = await runCommand("git push origin main");
  if (pushResult.success) {
    console.log(`[${new Date().toLocaleTimeString()}] ✅ Successfully synchronized changes!`);
  } else {
    console.error(`[${new Date().toLocaleTimeString()}] ❌ Failed to push changes:`);
    console.error(pushResult.stderr);
  }
  console.log("\nWaiting for new changes...");
}

// Trigger debounce timer
function handleChange(filePath) {
  // Ignore temp/git/build files
  if (
    filePath.includes(".git") ||
    filePath.includes(".next") ||
    filePath.includes("node_modules")
  ) {
    return;
  }

  changedFiles.add(filePath);

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    syncChanges();
  }, DEBOUNCE_MS);
}

// Setup directory watchers
for (const dir of WATCH_DIRS) {
  const dirPath = path.join(ROOT_DIR, dir);
  if (fs.existsSync(dirPath)) {
    fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
      if (filename) {
        handleChange(path.join(dir, filename));
      }
    });
  }
}

// Setup root file watchers
for (const file of WATCH_FILES) {
  const filePath = path.join(ROOT_DIR, file);
  if (fs.existsSync(filePath)) {
    fs.watch(filePath, (eventType, filename) => {
      handleChange(file);
    });
  }
}

console.log("Watcher is active and waiting for file changes...\n");
