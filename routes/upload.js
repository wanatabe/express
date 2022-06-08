var express = require('express');
var path = require('path');
var multer = require('multer');
var fs = require('fs');
var zlib = require('zlib');
var asar = require('asar');

var router = express.Router();

const upload = multer({ dest: '/data' });

router.post('/uploadFile', upload.any(), (req, res) => {
    console.log(`req.file`, req.files);
    const files = req.files;

    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const dirPath = path.join('data/', file.fieldname);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const destPath = path.join(dirPath, file.originalname);
        const read = fs.readFileSync(file.path);
        fs.writeFileSync(destPath, read);
    }
    res.end(
        JSON.stringify({
            message: 'File uploaded successfully'
        })
    );

    /** 创建asar文件 */
    var input = 'data/app/hieip.app';
    if (!fs.existsSync(input)) return;
    var readStream = fs.createReadStream(input);
    var writeStream = fs.createWriteStream('data/app/hieip.asar');
    const dr = input.endsWith('.app') ? zlib.createGunzip() : zlib.createGzip();
    readStream.pipe(dr).pipe(writeStream);

    /** asar创建完成 */
    writeStream.on('finish', () => {
        writeStream.close();
        readStream.close();
        removeDir('src');
        if (!fs.existsSync('src')) {
            fs.mkdirSync('src');
        }
        /** 解压asar文件 */
        if (fs.existsSync('data/app/hieip.asar')) {
            asar.extractAll('data/app/hieip.asar', 'src');
        }
        /** 复制config配置文件 */
        if (fs.existsSync('data/config/config.json')) {
            fs.copyFileSync('data/config/config.json', 'src/config.json');
        }
    });
});

function removeDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    console.log(files);
    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const curPath = dir + '/' + file;
        fs.statSync(curPath).isDirectory() ? removeDir(curPath) : fs.unlinkSync(curPath);
    }
    if (dir === 'src' || dir === 'src/config.json') return;
    fs.rmdirSync(dir);
}

module.exports = router;
