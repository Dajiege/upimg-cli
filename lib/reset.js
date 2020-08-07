
const { execSync } = require('child_process');
const { initConfig, imgPath } = require('./utils');
const init = require('../lib/init');

const reset = function() {
    execSync(`rm -rf ${imgPath}`);
    initConfig();
    init();
};

module.exports = reset;