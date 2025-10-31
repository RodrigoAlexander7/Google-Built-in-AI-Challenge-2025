const fs = require('fs');
const path = require('path');

function copyIfExists(src, dest) {
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} -> ${dest}`);
    return true;
  }
  console.warn(`Source not found: ${src}`);
  return false;
}

const root = path.resolve(__dirname, '..');
const nm = path.join(root, 'node_modules', 'pdfjs-dist');
const publicDir = path.join(root, 'public', 'pdfjs');

// Common locations across pdfjs versions
const candidates = [
  // modern builds (.js and .mjs)
  { src: path.join(nm, 'build', 'pdf.min.js'), dst: path.join(publicDir, 'pdf.min.js') },
  { src: path.join(nm, 'build', 'pdf.worker.min.js'), dst: path.join(publicDir, 'pdf.worker.min.js') },
  { src: path.join(nm, 'build', 'pdf.min.mjs'), dst: path.join(publicDir, 'pdf.min.js') },
  { src: path.join(nm, 'build', 'pdf.worker.min.mjs'), dst: path.join(publicDir, 'pdf.worker.min.js') },
  // legacy builds (.js and .mjs)
  { src: path.join(nm, 'legacy', 'build', 'pdf.min.js'), dst: path.join(publicDir, 'pdf.min.js') },
  { src: path.join(nm, 'legacy', 'build', 'pdf.worker.min.js'), dst: path.join(publicDir, 'pdf.worker.min.js') },
  { src: path.join(nm, 'legacy', 'build', 'pdf.min.mjs'), dst: path.join(publicDir, 'pdf.min.js') },
  { src: path.join(nm, 'legacy', 'build', 'pdf.worker.min.mjs'), dst: path.join(publicDir, 'pdf.worker.min.js') },
];

let copied = 0;
for (const c of candidates) {
  if (copyIfExists(c.src, c.dst)) copied++;
}

if (copied === 0) {
  console.warn('No pdfjs files were copied. Please install pdfjs-dist and verify file locations, or copy files manually to public/pdfjs/.');
} else {
  console.log(`pdfjs copy complete (${copied} files).`);
}
