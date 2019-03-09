const config = require('./svelte.config');
const babel = require('rollup-plugin-babel');
const svelte = require('rollup-plugin-svelte');
const common = require('rollup-plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const resolve = require('rollup-plugin-node-resolve');

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
            babel({ exclude: 'node_modules/core-js/**' })
        ]
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/calio.min.js',
            format: 'iife',
            name: 'Calio'
        },
        plugins: [
            resolve(),
            common(),
            svelte(config),
            babel({ exclude: 'node_modules/core-js/**' }),
            terser()
        ]
    }
];
