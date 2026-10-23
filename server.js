// Ruang Siar — cPanel CloudLinux Passenger Entry Point
// Compatible dengan Next.js standalone output
'use strict';

const path = require('path');
const fs = require('fs');

// Set environment
process.env.NODE_ENV = 'production';

// Explicitly provide environment variables if not loaded
process.env.YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyBBasWxnAnLxjKfgIDMgkRea4hRXZf7gjA';
process.env.ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'sigit_kurniawan';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Sigitjames@1969';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'mysql://ruangsia_user:Sigitjames%401969@202.52.146.137:3306/ruangsia_db';
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// App directory (where this file lives on server)
const dir = path.join(__dirname);

// Load .env manually if exists
try {
  const envPath = path.join(dir, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let key = match[1];
        let value = (match[2] || '').trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
} catch (e) {
  console.warn('Could not parse .env file');
}

// Port provided by Passenger or default
const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = process.env.HOSTNAME || '0.0.0.0';

// Read standalone config from the generated .next/required-server-files.json
let nextConfig = {};
try {
  const requiredFiles = require(path.join(dir, '.next', 'required-server-files.json'));
  nextConfig = requiredFiles.config || {};
  // Fix outputFileTracingRoot to current server path
  nextConfig.outputFileTracingRoot = dir;
} catch (e) {
  console.warn('Could not read required-server-files.json, using defaults');
}

process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(nextConfig);

require('next');
const { startServer } = require('next/dist/server/lib/start-server');

startServer({
  dir,
  isDev: false,
  config: nextConfig,
  hostname,
  port,
  allowRetry: false,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
