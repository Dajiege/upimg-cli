const fs = require('fs');
const {resolve} = require('path');

const configPath = resolve(process.env.HOME || process.env.USERPROFILE, '.upimg');

const imgPath = resolve(__dirname, '../imgs');

const generalRegs = {
    url: /^(?:(http(s)?\:)?\/\/)?[A-Za-z0-9-]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/gi
};

// 配置文件是否存在
const isConfigExists = fs.existsSync(configPath);

const initConfig = function() {
    const cfg = {type: '', remoteUrl: ''};
    fs.writeFileSync(configPath, JSON.stringify(cfg));
};

const getConfig = function(key) {
    if (!isConfigExists) {
        initConfig();
    } 
    const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (key) {
        return data[key];
    }
    return data;
};

const setConfig = function(obj) {
    const cfg = Object.assign(getConfig(), obj);
    try {
        fs.writeFileSync(configPath, JSON.stringify(cfg));
    } catch (error) {
        console.log(error);
    }
};

const formatTime = function(time, formatStr) {
    const t = new Date(time);
    const obj = {
        'YYYY': t.getFullYear(),
        'MM': `${t.getMonth() + 1}`.padStart(2, '0'),
        'DD': `${t.getDate() + 1}`.padStart(2, '0'),
        'HH': `${t.getHours()}`.padStart(2, '0'),
        'mm': `${t.getMinutes()}`.padStart(2, '0'),
        'ss': `${t.getSeconds()}`.padStart(2, '0'),
    };
    return formatStr.replace(/YYYY|MM|DD|HH|mm|ss/gi, val => {
        return obj[val];
    });
};

module.exports = {
    getConfig,
    setConfig,
    formatTime,
    initConfig,
    imgPath,
    configPath,
    generalRegs
};