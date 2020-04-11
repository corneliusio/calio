module.exports = {
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module',
        allowImportExportEverywhere: true,
        ecmaVersion: 2018,
        ecmaFeatures: {
            impliedStrict: true
        }
    },
    env: {
        browser: true,
        node: true,
        jest: true,
        es6: true
    },
    plugins: [
        'svelte3',
    ],
    settings: {
        'svelte3/ignore-styles': () => true,
    },
    rules: {
        'complexity': [1, {'max': 12}],
        'curly': 1,
        'no-else-return': 1,
        'no-floating-decimal': 1,
        'no-global-assign': 1,
        'no-multi-spaces': 1,
        'no-unmodified-loop-condition': 1,
        'no-useless-escape': 1,
        'array-bracket-spacing': [1, 'always'],
        'brace-style': [1, '1tbs'],
        'camelcase': 1,
        'comma-dangle': 1,
        'comma-spacing': 1,
        'comma-style': 1,
        'computed-property-spacing': 1,
        'func-call-spacing': 1,
        'indent': [1, 4, {
            'SwitchCase': 1
        }],
        'key-spacing': 1,
        'keyword-spacing': 1,
        'new-cap': 1,
        'padding-line-between-statements': [1,
            {
                'blankLine': 'always',
                'prev': '*',
                'next': 'return'
            },
            {
                'blankLine': 'always',
                'prev': ['const', 'let', 'var'],
                'next': '*'
            },
            {
                'blankLine': 'any',
                'prev': '*',
                'next': ['import', 'export']
            },
            {
                'blankLine': 'any',
                'prev': ['const', 'let', 'var'],
                'next': ['const', 'let', 'var']
            }
        ],
        'no-continue': 1,
        'no-lonely-if': 1,
        'no-mixed-operators': [1, {
            'groups': [
                ['&', '|', '^', '~', '<<', '>>', '>>>'],
                ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
                ['&&', '||'],
                ['in', 'instanceof']
            ]
        }],
        'no-multiple-empty-lines': [1, {
            'max': 1
        }],
        'no-tabs': 1,
        'no-unneeded-ternary': 1,
        'no-whitespace-before-property': 1,
        'object-curly-spacing': [1, 'always'],
        'one-var-declaration-per-line': 1,
        'one-var': [1, {
            'let': 'always',
            'const': 'never'
        }],
        'operator-linebreak': [1, 'after', {
            'overrides': {
                '?': 'before',
                ':': 'before',
                '&&': 'before',
                '||': 'before'
            }
        }],
        'quotes': [1, 'single', {
            'avoidEscape': true,
            'allowTemplateLiterals': true
        }],
        'semi-spacing': 1,
        'space-before-blocks': 1,
        'space-before-function-paren': [1, {
            'anonymous': 'never',
            'named': 'never',
            'asyncArrow': 'always'
        }],
        'space-in-parens': 1,
        'space-infix-ops': 1,
        'space-unary-ops': 1,
        'wrap-regex': 1,
        'arrow-spacing': 1,
        'constructor-super': 2,
        'no-class-assign': 1,
        'no-const-assign': 2,
        'no-duplicate-imports': 1,
        'no-this-before-super': 2,
        'no-useless-computed-key': 1,
        'no-useless-constructor': 1,
        'prefer-arrow-callback': 1,
        'arrow-parens': [1, 'as-needed'],
        'prefer-rest-params': 1,
        'prefer-spread': 1,
        'prefer-template': 1,
        'require-yield': 1,
        'template-curly-spacing': 1,
        'guard-for-in': 1,
        'eqeqeq': 1,
        'no-unused-vars': [1, {
            'args': 'none'
        }],
        'no-undef': 2,
        'no-var': 1,
        'semi': 1,
        'no-extra-semi': 1
    },
    overrides: [
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
