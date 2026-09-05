// Vercel serverless entry point
// The compiled server exports a default handler function
const server = require("../dist/index.cjs");
module.exports = server.default || server;
