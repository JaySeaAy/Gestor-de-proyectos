const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '.env');

if (!fs.existsSync(envFile)) {
  console.error('Error: .env file is missing. Please create one based on the .env.example file.');
  process.exit(1);
}

console.log('.env file exists. Proceeding with the setup.');
process.exit(0);