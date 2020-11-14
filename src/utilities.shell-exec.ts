// npm shell-exec re-written in TypeScript
"use strict";

import childProcess, { SpawnOptionsWithoutStdio } from "child_process";

// const childProcess = require("child_process");

type ChildCloseReturn = {
  cmd: string;
  code: number;
  stderr: string;
  stdout: string;
};

type ChildOpenReturn = {
  error: Error;
  stdout: string;
  stderr: string;
  cmd: string;
};

export type ShellExecReturn = ChildCloseReturn | ChildOpenReturn;

export function shellExec(cmd = "", opts: SpawnOptionsWithoutStdio = {}): Promise<ShellExecReturn> {
  if (Array.isArray(cmd)) {
    cmd = cmd.join(";");
  }

  opts = Object.assign({ stdio: "pipe", cwd: process.cwd() }, opts);

  let child: childProcess.ChildProcessWithoutNullStreams;
  const shell = process.platform === "win32" ? { cmd: "cmd", arg: "/C" } : { cmd: "sh", arg: "-c" };

  try {
    child = childProcess.spawn(shell.cmd, [shell.arg, cmd], opts);
  } catch (error) {
    return Promise.reject(error);
  }

  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";

    if (child.stdout) {
      child.stdout.on("data", (data) => {
        stdout += data;
      });
    }

    if (child.stderr) {
      child.stderr.on("data", (data) => {
        stderr += data;
      });
    }

    child.on("error", (error) => {
      resolve({ error, stdout, stderr, cmd });
    });

    child.on("close", (code) => {
      resolve({ stdout, stderr, cmd, code });
    });
  });
}
