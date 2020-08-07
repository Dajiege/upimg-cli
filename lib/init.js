const fs = require('fs');
const { execSync, exec } = require('child_process');
const { setConfig, getConfig, generalRegs, imgPath } = require('./utils');
const inquirer = require('inquirer');
const _remoteUrl = getConfig('remoteUrl');

const questions = [{
    type: 'list',
    name: 'type',
    message: '请选择使用的远程仓库类型：',
    choices: [
        {name: 'github', value: 'github'},
        {name: 'gitee（码云）', value: 'gitte'},
    ]
}, {
    type: 'input',
    name: 'username',
    message: '请输入用户名：（不输入使用git默认）'
}, {
    type: 'input',
    name: 'email',
    message: '请输入邮箱：（不输入使用git默认）'
}, {
    type: 'input',
    name: 'remoteUrl',
    message: '请输入远程仓库地址：',
    validate: function(input) {
        return new Promise((resolve, reject) => {
            if (generalRegs.url.test(input)) {
                resolve(true);
            }
            reject('请输入正确的地址');
        });
    }
}];

const createLocalRepo = function(answer) {
    if (!fs.existsSync(imgPath)) {
        execSync(`mkdir ${imgPath} && git init`);
    }
    
    execSync(`cd ${imgPath} && git config user.name ${answer.username} && git config user.email ${answer.email}`);

    const _cmd = _remoteUrl ? 
        `cd ${imgPath} && git remote rm origin && git remote add origin ` :
        `cd ${imgPath} &&  git remote add origin `;

    exec(`${_cmd}${answer.remoteUrl}`, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`创建本地仓库成功，路径${imgPath}`);
        }
    });
};

const init  = function() {
    inquirer.prompt(questions).then(function(answer) {
        setConfig(answer);
        createLocalRepo(answer);
    });
};

module.exports = init;