const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'backend');
const tempDir = path.join(process.cwd(), 'temp_backend_git');

try {
  console.log('⚡ Creating temporary directory...');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  console.log('📦 Copying backend files...');
  const copyRecursiveSync = (src, dest) => {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    const basename = path.basename(src);

    // Skip node_modules, db_data database files, and .git folders
    if (basename === 'node_modules' || basename === 'db_data' || basename === '.git') {
      return;
    }

    if (isDirectory) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
      }
      fs.readdirSync(src).forEach((childItemName) => {
        copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  };

  copyRecursiveSync(srcDir, tempDir);

  // Write a standalone .gitignore for the backend if it doesn't exist
  const gitignoreContent = `node_modules/
db_data/
.env
.DS_Store
`;
  fs.writeFileSync(path.join(tempDir, '.gitignore'), gitignoreContent);

  console.log('🐙 Initializing git repository...');
  execSync('git init', { cwd: tempDir, stdio: 'inherit' });

  // Set local Git identity for the temporary repository
  execSync('git config user.name "Tanish Jain"', { cwd: tempDir, stdio: 'inherit' });
  execSync('git config user.email "tanishjain93133@gmail.com"', { cwd: tempDir, stdio: 'inherit' });
  
  // Set branch to main
  execSync('git checkout -b main', { cwd: tempDir, stdio: 'inherit' });

  console.log('🔗 Adding remote repository...');
  execSync('git remote add origin https://github.com/tanishjain93133-hub/backend-pr-.git', { cwd: tempDir, stdio: 'inherit' });

  console.log('📌 Staging files...');
  execSync('git add .', { cwd: tempDir, stdio: 'inherit' });

  console.log('💾 Committing files...');
  execSync('git commit -m "Initialize standalone backend Node/Express repository for Render/Railway deployment"', { cwd: tempDir, stdio: 'inherit' });

  console.log('🚀 Pushing to remote main branch...');
  execSync('git push -u origin main --force', { cwd: tempDir, stdio: 'inherit' });

  console.log('🧹 Cleaning up temporary directory...');
  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log('✅ Standalone backend deployment push completed successfully!');
} catch (error) {
  console.error('❌ Backend push failed:', error);
  process.exit(1);
}
