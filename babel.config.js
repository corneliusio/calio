module.exports = {
    presets: [
        [
            '@babel/env', {
                corejs: 3,
                modules: false,
                useBuiltIns: 'usage',
                shippedProposals: true
            }
        ]
    ],
    env: {
        testing: {
            presets: [ '@babel/env' ]
        }
    }
};
