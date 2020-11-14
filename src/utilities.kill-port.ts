// npm kill-port re-written in TypeScript
import { shellExec, ShellExecReturn } from "./utilities.shell-exec";

export async function killPort(port: number | string | undefined, method = "tcp"): Promise<ShellExecReturn> {
  if (!port) throw Error("Please define a port. A port may be of type number or string");
  if (typeof port === "string") {
    port = Number.parseInt(port, 10);
  }
  if (!port) {
    return Promise.reject(new Error("Invalid argument provided for port"));
  }

  if (process.platform === "win32") {
    const res = await shellExec("netstat -nao");
    const { stdout } = res;
    if (!stdout) return res;
    const lines = stdout.split("\n");
    // The second white-space delimited column of netstat output is the local port,
    // which is the only port we care about.
    // The regex here will match only the local port column of the output
    const lineWithLocalPortRegEx = new RegExp(`^ *${method.toUpperCase()} *[^ ]*:${port}`, "gm");
    const linesWithLocalPort = lines.filter((line) => line.match(lineWithLocalPortRegEx));
    const pids = linesWithLocalPort.reduce((acc: string[], line_1) => {
      const match = line_1.match(/(\d*)\w*(\n|$)/gm);
      return match && match[0] && !acc.includes(match[0]) ? acc.concat(match[0]) : acc;
    }, []);
    return shellExec(`TaskKill /F /PID ${pids.join(" /PID ")}`);
  }

  return shellExec(
    `lsof -i ${method === "udp" ? "udp" : "tcp"}:${port} | grep ${
      method === "udp" ? "UDP" : "LISTEN"
    } | awk '{print $2}' | xargs kill -9`,
  );
}
