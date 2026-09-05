// Vercel serverless entry point
// Express app is compiled to CJS and exported as a handler function
const mod = require("../dist/index.cjs");
const handler = mod.default || mod;

module.exports = handler;
