#!/usr/bin/env node

import { spawn } from "node:child_process";
import { realpathSync } from "node:fs";
import { copyFile, cp, realpath } from "node:fs/promises";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { input, select } from "@inquirer/prompts";

// On Windows both "npm" and "yarn" are .cmd shims, which Node refuses to spawn
// directly (see CVE-2024-27980), so they have to go through a shell there.
const needsShell = process.platform === "win32";

const resolveRealPath = (targetPath) => {
  try {
    return realpathSync(targetPath);
  } catch {
    return path.resolve(targetPath);
  }
};

const isPathWithin = (root, candidate) => {
  const relativePath = path.relative(root, candidate);

  return (
    relativePath === "" ||
    (relativePath !== ".." &&
      !relativePath.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relativePath))
  );
};

const assertPathWithin = (root, candidate) => {
  const normalizedRoot = path.resolve(root);
  const normalizedCandidate = path.resolve(candidate);

  if (!isPathWithin(normalizedRoot, normalizedCandidate)) {
    throw new Error(
      "Project destination must be inside the current directory.",
    );
  }

  return normalizedCandidate;
};

const findExistingAncestor = async (candidate) => {
  let currentPath = candidate;

  while (true) {
    try {
      return await realpath(currentPath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }

      const parentPath = dirname(currentPath);
      if (parentPath === currentPath) {
        throw error;
      }
      currentPath = parentPath;
    }
  }
};

const resolveProjectDestination = async (
  projectName,
  workingDirectory = process.cwd(),
) => {
  const realWorkingDirectory = await realpath(workingDirectory);
  const destination = assertPathWithin(
    realWorkingDirectory,
    path.resolve(realWorkingDirectory, projectName),
  );
  const realAncestor = await findExistingAncestor(destination);

  assertPathWithin(realWorkingDirectory, realAncestor);

  return destination;
};

const copyTemplate = async (answers) => {
  const { projectName, language, packageManager } = answers;
  const targetDestination = await resolveProjectDestination(projectName);

  const __dirname = dirname(fileURLToPath(import.meta.url));

  const source = path.join(__dirname, "templates", language);

  await copyFiles(source, targetDestination);

  if (packageManager === "yarn") {
    const yarncleanSrc = path.join(__dirname, "templates", ".yarnclean");
    const verifiedDestination =
      await resolveProjectDestination(targetDestination);
    const yarncleanDest = assertPathWithin(
      verifiedDestination,
      path.resolve(verifiedDestination, ".yarnclean"),
    );

    await copyFile(yarncleanSrc, yarncleanDest);
    console.log(".yarnclean file copied successfully!");
  }

  console.log("Project structure copied successfully!");

  console.log("Installing dependencies!");

  await runNpmInstall(targetDestination, packageManager);

  console.log("Dependencies installed successfully!");
};

const copyFiles = async (source, destination) => {
  const safeDestination = await resolveProjectDestination(destination);

  return cp(source, safeDestination, { recursive: true });
};

async function isYarnAvailable() {
  return new Promise((resolve) => {
    const checkYarn = spawn("yarn", ["--version"], {
      stdio: "ignore", // We don't want to display the output
      shell: needsShell,
    });

    // Without a shell, a missing binary surfaces as an "error" event; an
    // unhandled one would crash the process instead of reporting yarn missing.
    checkYarn.on("error", () => {
      resolve(false); // Yarn is not available
    });

    checkYarn.on("close", (code) => {
      resolve(code === 0); // Yarn is available when it exits cleanly
    });
  });
}

async function runNpmInstall(directory, packageManager) {
  const safeDirectory = await resolveProjectDestination(directory);

  console.log(
    `Installing in directory: ${safeDirectory} using ${packageManager}`,
  );

  const cmd = packageManager === "npm" ? "npm" : "yarn";
  const args = packageManager === "npm" ? ["install"] : [];

  return new Promise((resolve, reject) => {
    const installProcess = spawn(cmd, args, {
      cwd: safeDirectory,
      stdio: "inherit",
      shell: needsShell,
    });

    installProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`"${cmd} install" failed with code ${code}`));
      } else {
        resolve();
      }
    });

    installProcess.on("error", (error) => {
      reject(
        new Error(`Could not run "${cmd} install": ${error.message}`, {
          cause: error,
        }),
      );
    });
  });
}

const main = async () => {
  const projectName = await input({
    default: ".",
    message: "Enter the project name (or . for current directory):",
    validate: async (value) => {
      if (!value) {
        return "Project name cannot be empty";
      }

      try {
        await resolveProjectDestination(value);
        return true;
      } catch (error) {
        return error?.message ?? "Invalid project destination";
      }
    },
    required: true,
  });

  const answers = {
    projectName,
    language: await select({
      default: "Javascript",
      message: "Choose a language:",
      choices: [{ value: "Javascript" }, { value: "Typescript" }],
      required: true,
    }),
    packageManager: await select({
      default: "npm",
      message: "Choose a package manager:",
      choices: [{ value: "npm" }, { value: "yarn" }],
      required: true,
    }),
  };

  if (answers.packageManager === "yarn" && !(await isYarnAvailable())) {
    console.error(
      "It seems you don't have 'yarn' installed. Please install it globally with 'npm -g i yarn' or choose 'npm'.",
    );
    process.exitCode = 1;
    return;
  }
  await copyTemplate(answers);
};

// npm installs bin entries as symlinks and Node reports import.meta.url with
// symlinks resolved, so both sides have to be realpath'd to compare equal.
const isEntrypoint =
  Boolean(process.argv[1]) &&
  resolveRealPath(process.argv[1]) ===
    resolveRealPath(fileURLToPath(import.meta.url));

if (isEntrypoint) {
  main().catch((error) => {
    if (error?.name === "ExitPromptError") {
      return; // The user cancelled the prompt (Ctrl+C)
    }

    console.error("Error:", error);
    process.exitCode = 1;
  });
}

export { assertPathWithin, resolveProjectDestination };
