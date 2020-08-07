const fs = require('fs');
const { COPYFILE_EXCL } = fs.constants;
const clipboardy = require('clipboardy');
const { resolve, parse } = require('path');
const { formatTime, getConfig } = require('./utils');
const { exec } = require('child_process');

const gitSrc = resolve(__dirname, '../imgs');

const copyHandle = function(from, to) {
    return new Promise((resolve) => {
        fs.copyFile(from, to, COPYFILE_EXCL, err => {
            if (err) {
                if (err.code === 'EEXIST') {
                    resolve(true);
                } else {
                    console.log(err);
                    resolve(false);
                }
            }
            resolve(true);
        });
    });
};

const uploadImg = function(path) {
    const imgPath = resolve(process.cwd(), path);
    if (fs.existsSync(imgPath)) {
        const imgName = `${parse(path).name}_${formatTime(Date.now(), 'YYYY_MM_DD_HH_mm_ss')}${parse(path).ext}`;
        const aimPath = resolve(gitSrc, imgName);
        copyHandle(imgPath, aimPath).then(isSuccess => {
            if (isSuccess) {
                uploadToGit(aimPath, imgName);
            }
        });
    } else {
        console.log('找不到对应文件，请重新输入');
    }
};

const uploadToGit = function(aimPath, imgName) {
    const cmd = `cd ${gitSrc} && git add ${aimPath} && git commit -m uploaded && git push -u origin master`;
    exec(cmd, (err) => {
        if (err) {
            console.log('err', err);
        } else {
            let _url = {
                'github': getConfig('remoteUrl').replace(/https:\/\/github.com\/(.*)\.git/, `https://cdn.jsdelivr.net/gh/$1/${imgName}`),
                'gitee': getConfig('remoteUrl').replace('.git', `/raw/master/${imgName}`)
            }[getConfig('type')];
            clipboardy.writeSync(_url);
            console.log('上传成功并复制链接到剪贴板！');
        }
    } );
};
module.exports = uploadImg;