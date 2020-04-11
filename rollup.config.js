const config = require('./svelte.config');
const babel = require('rollup-plugin-babel');
const svelte = require('rollup-plugin-svelte');
const common = require('rollup-plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const resolve = require('rollup-plugin-node-resolve');
const replace = require('@rollup/plugin-replace');

module.exports = [
    {
        input: 'src/index.polyfilled.js',
        output: {
            file: 'dist/calio.polyfilled.js',
            format: 'esm'
        },
        plugins: [
            resolve(),
            common(),
            svelte(config),
            replace({
                'process.env.NODE_ENV': '\'production\''
            }),
            babel({
                extensions: [ '.js', '.mjs', '.svelte' ],
                exclude: 'node_modules/core-js/**'
            })
        ]
    },
    {
        input: 'src/index.polyfilled.js',
        output: {
            file: 'dist/calio.polyfilled.min.js',
            format: 'iife',
            name: 'Calio'
        },
        plugins: [
            resolve(),
            common(),
            svelte(config),
            replace({
                'process.env.NODE_ENV': '\'production\''
            }),
            babel({
                extensions: [ '.js', '.mjs', '.svelte' ],
                exclude: 'node_modules/core-js/**'
            }),
            terser()
        ]
    },
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
                'process.env.NODE_ENV': '\'production\''
            })
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
            replace({
                'process.env.NODE_ENV': '\'production\''
            }),
            terser()
        ]
    }
];
