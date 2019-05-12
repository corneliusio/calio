const brightpack = require('brightpack');

module.exports = brightpack({ filename: '[name]' }, config => {
    config.optimization && (config.optimization.splitChunks = false);

    return config;
});
