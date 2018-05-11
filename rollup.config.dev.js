const config = require('./svelte.config');
const svelte = require('rollup-plugin-svelte');

module.exports = {
    input: './src/index.js',
    output: {
        file: 'dist/calio.min.js',
        format: 'iife',
        name: 'Calio',
        sourcemap: true
    },
    plugins: [
        svelte(config)
    ]
};
