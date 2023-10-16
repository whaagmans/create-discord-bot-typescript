#!/usr/bin/env node

import { fileURLToPath } from "url";
import path, { dirname } from "path";
import inquirer from "inquirer";
import ncp from "ncp";
import { spawn } from "child_process";

const copyTemplate = async (destination, language) => {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const source = path.join(__dirname, "templates", language);

  try {
    await copyFiles(source, destination);
    console.log("Project structure copied successfully!");

    console.log("Installing dependencies!");
    await runNpmInstall(destination);
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

function runNpmInstall(directory) {
  console.log("Installing in directory:", directory);

  return new Promise((resolve, reject) => {
    const npmInstall = spawn("npm", ["install"], {
      cwd: directory,
      stdio: "inherit", // This will show the npm output in the console
      shell: true, // This option runs the command within a shell
    });

    npmInstall.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`"npm install" failed with code ${code}`));
      } else {
        resolve();
      }
    });

    npmInstall.on("error", (error) => {
      console.error("Error during npm install:", error);
    });
  });
}

const main = async () => {
  const currentDirName = path.basename(process.cwd());

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter the project name (or . for current directory):",
      default: ".",
      validate: (input) => (input ? true : "Project name cannot be empty"),
      filter: (input) => (input === "." ? currentDirName : input),
    },
    {
      type: "list",
      name: "language",
      message: "Choose a language:",
      choices: ["Javascript", "Typescript"],
      default: "Javascript",
    },
  ]);

  await copyTemplate(answers.projectName, answers.language);
};

main();
