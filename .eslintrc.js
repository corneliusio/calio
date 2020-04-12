const fs = require('fs');
const path = require('path');
const __home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
const extend = path.resolve(__home, '.eslintrc.json');

module.exports = {
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module',
        allowImportExportEverywhere: true,
        ecmaVersion: 8,
        ecmaFeatures: {
            impliedStrict: true
        }
    },
    extends: [
        'plugin:vue/base',
        fs.existsSync(extend) ? extend : null
    ].filter(Boolean),
    plugins: [
        'svelte3',
        'html',
        'vue'
    ],
    settings: {
        'html/indent': '+4',
        'html/html-extensions': [ '.html' ],
        'svelte3/ignore-styles': () => true,
    },
    rules: {
        'vue/html-indent': [ 'error', 4, {
            baseIndent: 1,
        } ],
        'vue/script-indent': [ 'error', 4, {
            baseIndent: 1
        } ]
    },
    overrides: [
        {
            files: [ '**/*.vue' ],
            rules: {
                indent: 0
            }
        },
        {
            files: [ '**/*.svelte', '**/*.svlt' ],
            processor: 'svelte3/svelte3',
            rules: {
                'one-var': 0,
                'no-multiple-empty-lines': 0
            }
        }
    ]
};
