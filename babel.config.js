module.exports = {
    plugins: [
        '@babel/syntax-dynamic-import'
    ],
    presets: [
        [ '@babel/env', {
            corejs: 3,
            modules: false,
            useBuiltIns: 'usage',
            shippedProposals: true
        } ]
    ]
};
