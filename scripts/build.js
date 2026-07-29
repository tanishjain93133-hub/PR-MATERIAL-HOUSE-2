const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('⚡ Building frontend...');
  execSync('npm run build --prefix frontend', { stdio: 'inherit' });

  const srcDir = path.join(process.cwd(), 'frontend', 'dist');
  const destDir = path.join(process.cwd(), 'dist');

  console.log(`📦 Copying built files to ${destDir}...`);
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  fs.mkdirSync(destDir, { recursive: true });

  const copyRecursiveSync = (src, dest) => {
    const exists = fs.existsSync(src);
    const isDirectory = exists && fs.statSync(src).isDirectory();
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

  copyRecursiveSync(srcDir, destDir);

  // Generate static SPA fallback index.html for all client routes to guarantee zero 404s on Vercel/Netlify
  const spaRoutes = ['admin', 'login', 'register', 'products', 'brands', 'gallery', 'about', 'contact', 'profile'];
  const indexHtmlPath = path.join(destDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    spaRoutes.forEach(route => {
      const routeDir = path.join(destDir, route);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      fs.copyFileSync(indexHtmlPath, path.join(routeDir, 'index.html'));
    });
  }

  console.log('✅ Build copy completed successfully with static SPA route fallbacks!');
} catch (error) {
  console.error('❌ Build script failed:', error);
  process.exit(1);
}
