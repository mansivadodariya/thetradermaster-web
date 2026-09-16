const fs = require('fs');
const path = require('path');

function searchDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      searchDir(filePath, fileList);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const files = searchDir('src');
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('container')) {
      const match = line.match(/className=["']([^"']*container[^"']*)["']/);
      if (match) {
        console.log(`${file}:${index + 1} -> ${match[1]}`);
      }
    }
  });
});
