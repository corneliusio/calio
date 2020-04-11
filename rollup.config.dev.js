const config = require('./svelte.config');
const svelte = require('rollup-plugin-svelte');
const common = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const replace = require('@rollup/plugin-replace');

module.exports = [
    {
        input: 'src/index.js',
        output: {
            file: 'dist/calio.js',
            format: 'esm'
        },
        plugins: [
            resolve(),
            common(),
            svelte(config),
            replace({
                'process.env.NODE_ENV': '\'development\''
            })
        ]
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/calio.min.js',
            format: 'iife',
            name: 'Calio',
            sourcemap: true
        },
        plugins: [
            resolve(),
            common(),
            svelte(config),
            replace({
                'process.env.NODE_ENV': '\'development\''
            })
        ]
    }
];
