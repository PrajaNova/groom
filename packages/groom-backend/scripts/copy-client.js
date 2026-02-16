const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../src/generated');
const dest = path.join(__dirname, '../dist/generated');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

if (fs.existsSync(src)) {
    copyRecursiveSync(src, dest);
    console.log(`Copied ${src} to ${dest}`);
} else {
    console.warn(`Source ${src} does not exist, skipping copy.`);
}
