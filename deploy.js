const fs = require('fs');
const path = require('path');
const fsp = fs.promises;

// ⚠️ Danh sách thư mục cần bỏ qua (tương đối từ thư mục gốc)
const skipPaths = [
    'node_modules',
    '.git',
    '.vscode',
    'public/assets/video',
    'public/assets/data',
    'public/assets/img',
    'public/assets/uploads',
    'public/assets/js/dashboards',
    'public/assets/js/pages',
    'public/vendors',
];

async function copyNewerFiles(srcDir, destDir, lastUpdated, sourceRoot) {
    const entries = await fsp.readdir(srcDir, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);
        const relativePath = path.relative(sourceRoot, srcPath).replace(/\\/g, '/'); // Normalize path on Windows

        // ❌ Bỏ qua nếu relative path khớp 1 mục trong danh sách skip
        if (skipPaths.some(skip => relativePath === skip || relativePath.startsWith(skip + '/'))) {
            console.log(`⏩ Bỏ qua: ${relativePath}`);
            continue;
        }

        const stat = await fsp.stat(srcPath);

        if (entry.isDirectory()) {
            await fsp.mkdir(destPath, { recursive: true });
            await copyNewerFiles(srcPath, destPath, lastUpdated, sourceRoot); // Đệ quy tiếp
        } else {
            if (stat.mtime >= lastUpdated) {
                await fsp.copyFile(srcPath, destPath);
                console.log(`✓ Copied: ${relativePath}`);
            } else {
                console.log(`⚠️ Bỏ qua file cũ: ${relativePath}`);
            }
        }
    }
}

async function runCopy(destDir, lastUpdateDate) {
    try {
        const lastUpdated = new Date(lastUpdateDate);
        if (isNaN(lastUpdated)) throw new Error('❌ Ngày không hợp lệ: ' + lastUpdateDate);

        const sourceDir = path.resolve(__dirname); // mặc định thư mục hiện tại là nguồn

        if (!fs.existsSync(destDir)) {
            await fsp.mkdir(destDir, { recursive: true });
        }

        console.log(`🚚 Chép từ "${sourceDir}" đến "${destDir}" nếu mtime >= ${lastUpdated.toISOString()}`);
        console.log(`🚫 Bỏ qua các thư mục: ${skipPaths.join(', ')}`);

        await copyNewerFiles(sourceDir, destDir, lastUpdated, sourceDir);

        console.log('✅ Hoàn tất!');
    } catch (err) {
        console.error('❌ Lỗi:', err.message);
    }
}

// 📥 Tham số dòng lệnh
const [, , destDir, lastUpdateDate] = process.argv;

if (!destDir || !lastUpdateDate) {
    console.log(`
❗ Cách dùng:
  node deploy.js <thư-mục-đích> <ngày cập nhật ISO>

📌 Ví dụ:
  node deploy.js "C:\Work\Deploy\consims" "2025-08-01"
  node deploy.js "E:\NodeWeb\consims" "2026-04-12"

📁 Nguồn mặc định: thư mục chứa file deploy.js
🗂 Bỏ qua: ${skipPaths.join(', ')}
`);
    process.exit(1);
}

runCopy(destDir, lastUpdateDate);
