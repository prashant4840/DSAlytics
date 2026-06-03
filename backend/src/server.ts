// Polyfill SlowBuffer for Node.js 26+ compatibility to prevent jwa/buffer-equal-constant-time crash
const bufferModule = require("buffer");
if (typeof bufferModule.SlowBuffer === "undefined") {
  bufferModule.SlowBuffer = function () {};
}
if (typeof bufferModule.SlowBuffer.prototype === "undefined") {
  bufferModule.SlowBuffer.prototype = {};
}
if (typeof bufferModule.SlowBuffer.prototype.equal === "undefined") {
  bufferModule.SlowBuffer.prototype.equal = function () {};
}

import app from "./app";
import connectDB from "./config/db";


// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
