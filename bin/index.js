#!/usr/bin/env node

const { program } = require('commander');
const uploadImg = require('../lib/upload-img');
const init = require('../lib/init');
const reset = require('../lib/reset');


program
    .version('0.0.1')
    .arguments('[imgPath]')
    .action(uploadImg)
    .command('init')
    .description('初始化配置')
    .action(init);
program
    .command('reset')
    .description('重置本地仓库(远程仓库已满，新开一个仓库)')
    .action(reset);


program.parse(process.argv);
