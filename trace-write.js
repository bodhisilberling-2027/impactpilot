const fs = require('fs');
const oldWrite = fs.writeFileSync;

fs.writeFileSync = function (to, content, opts) {
  console.log('🚨 writeFileSync called with:', to);
  console.trace();
  return oldWrite.apply(this, arguments);
};

console.log("🧪 Global fs.writeFileSync tracing injected.");