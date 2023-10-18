#!/usr/bin/env node

import { spawn } from "child_process";
import fs from "fs";
import inquirer from "inquirer";
import ncp from "ncp";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const copyTemplate = async (answers) => {
  const { projectName: destination, language, packageManager } = answers;

  const targetDestination = destination === process.cwd() ? "." : destination;

  const __dirname = dirname(fileURLToPath(import.meta.url));

  const source = path.join(__dirname, "templates", language);

  try {
    await copyFiles(source, targetDestination);

    if (packageManager === "yarn") {
      const yarncleanSrc = path.join(__dirname, "templates", ".yarnclean");
      const yarncleanDest = path.join(targetDestination, ".yarnclean");

      fs.copyFileSync(yarncleanSrc, yarncleanDest);
      console.log(".yarnclean file copied successfully!");
    }

    console.log("Project structure copied successfully!");

    console.log("Installing dependencies!");

    await runNpmInstall(targetDestination, packageManager);

    console.log("Dependencies installed successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
};

const copyFiles = (source, destination) => {
  return new Promise((resolve, reject) => {
    ncp(source, destination, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

async function isYarnAvailable() {
  return new Promise((resolve) => {
    const checkYarn = spawn("yarn", ["--version"], {
      stdio: "ignore", // We don't want to display the output
      shell: true,
    });

    checkYarn.on("close", (code) => {
      if (code !== 0) {
        resolve(false); // Yarn is not available
      } else {
        resolve(true); // Yarn is available
      }
    });
  });
}

function runNpmInstall(directory, packageManager) {
  console.log(`Installing in directory: ${directory} using ${packageManager}`);

  const cmd = packageManager === "npm" ? "npm" : "yarn";
  const args = packageManager === "npm" ? ["install"] : [];

  return new Promise((resolve, reject) => {
    const installProcess = spawn(cmd, args, {
      cwd: directory,
      stdio: "inherit",
      shell: true,
    });

    installProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`"${cmd} install" failed with code ${code}`));
      } else {
        resolve();
      }
    });

    installProcess.on("error", (error) => {
      console.error(`Error during ${cmd} install:`, error);
    });
  });
}

const main = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter the project name (or . for current directory):",
      default: ".",
      validate: (input) => (input ? true : "Project name cannot be empty"),
      filter: (input) => (input === "." ? process.cwd() : input),
    },
    {
      type: "list",
      name: "language",
      message: "Choose a language:",
      choices: ["Javascript", "Typescript"],
      default: "Javascript",
    },
    {
      type: "list",
      name: "packageManager",
      message: "Choose a package manager:",
      choices: ["npm", "yarn"],
      default: "npm",
    },
  ]);
  if (answers.packageManager === "yarn" && !(await isYarnAvailable())) {
    console.error(
      "It seems you don't have 'yarn' installed. Please install it globally with 'npm -g i yarn' or choose 'npm'."
    );
    return;
  }

  await copyTemplate(answers);
};

main();
