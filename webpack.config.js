const brightpack = require('brightpack');

module.exports = brightpack({ watch: 'index.html', filename: '[name]' }, config => {
    config.optimization && (config.optimization.splitChunks = false);

    return config;
});
