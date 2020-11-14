const kill = require("kill-port");

const port = process.env.ATAPI_VIRTUAL_PORT;

kill(port, "tcp").then(console.log).catch(console.log);
