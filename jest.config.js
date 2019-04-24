module.exports = {
    collectCoverageFrom: [
        'src/**/*.{js,svlt}'
    ],
    transform: {
        '\\.(js|svelte)$': './test/babel-svelte-jest'
    },
    moduleFileExtensions: [
        'js',
        'json',
        'svelte'
    ]
};
