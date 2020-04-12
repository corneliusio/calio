const brightpack = require('brightpack');
const PurgecssPlugin = require('purgecss-webpack-plugin');

module.exports = brightpack({ watch: 'index.html', filename: '[name]' }, config => {
    config.optimization && (config.optimization.splitChunks = false);

    if (global.inProduction) {
        config.plugins.push(new PurgecssPlugin({
            whitelistPatterns: () => [ /calio/, /svelte/ ],
            whitelistPatternsChildren: () => [ /calio/, /svelte/ ],
            paths: [ 'index.html' ],
            extractors: [
                {
                    extensions: [ 'svelte', 'html', 'php' ],
                    extractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
                }
            ]
        }));
    }

    return config;
});
