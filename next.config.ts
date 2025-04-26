import type { NextConfig } from 'next';
import fs from 'fs';

// Monkey patch to trace the error source
const originalWrite = fs.writeFileSync;
fs.writeFileSync = function (to: any, content: any, opts?: any) {
  console.log('🚨 writeFileSync called with:', to);
  console.trace();
  return originalWrite.apply(this, arguments as any);
};

console.log("🧪 fs.writeFileSync tracing is now active.");

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export default nextConfig;
