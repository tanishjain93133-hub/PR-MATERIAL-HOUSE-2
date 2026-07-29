const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const srcDir = process.cwd();
const tempDir = path.join(process.cwd(), 'temp_frontend_git');

try {
  console.log('⚡ Creating temporary directory...');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  console.log('📦 Copying monolithic workspace files...');
  const copyRecursiveSync = (src, dest) => {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    const basename = path.basename(src);

    if (
      basename === 'node_modules' || 
      basename === '.git' || 
      basename === 'temp_frontend_git' || 
      basename === 'temp_backend_git' || 
      basename === 'db_data' ||
      basename === '.env.vercel' ||
      basename === '.env.vercel.prod'
    ) {
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

  console.log('🐙 Initializing git repository...');
  execSync('git init', { cwd: tempDir, stdio: 'inherit' });

  // Set local Git identity for the deploy commit
  execSync('git config user.name "Tanish Jain"', { cwd: tempDir, stdio: 'inherit' });
  execSync('git config user.email "tanishjain93133@gmail.com"', { cwd: tempDir, stdio: 'inherit' });
  
  // Set branch name to main
  execSync('git checkout -b main', { cwd: tempDir, stdio: 'inherit' });

  console.log('📌 Staging files...');
  execSync('git add .', { cwd: tempDir, stdio: 'inherit' });

  console.log('💾 Committing files...');
  execSync('git commit -m "Deploy fullstack codebase with Vercel/Netlify route fallbacks and serverless API"', { cwd: tempDir, stdio: 'inherit' });

  const remotes = [
    'https://github.com/tanishjain93133-hub/PRMHouse-.git',
    'https://github.com/tanishjain93133-hub/Pr-frontend-.git',
    'https://github.com/tanishjain93133-hub/PR-MATERIAL-HOUSE-2.git'
  ];

  remotes.forEach((remoteUrl, idx) => {
    console.log(`🔗 Pushing to remote ${remoteUrl}...`);
    try {
      execSync(`git remote remove origin`, { cwd: tempDir, stdio: 'ignore' });
    } catch (e) {}
    execSync(`git remote add origin ${remoteUrl}`, { cwd: tempDir, stdio: 'inherit' });

    execSync('git push -u origin main --force', { cwd: tempDir, stdio: 'inherit' });

    try {
      execSync('git checkout master', { cwd: tempDir, stdio: 'ignore' });
    } catch (e) {
      execSync('git checkout -b master', { cwd: tempDir, stdio: 'inherit' });
    }
    execSync('git push -u origin master --force', { cwd: tempDir, stdio: 'inherit' });
    execSync('git checkout main', { cwd: tempDir, stdio: 'ignore' });
  });

  console.log('🧹 Cleaning up temporary directory...');
  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log('✅ All frontend / monolithic deployment remotes updated successfully!');
} catch (error) {
  console.error('Monolithic deployment failed:', error);
  process.exit(1);
}
