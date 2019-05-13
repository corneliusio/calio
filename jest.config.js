module.exports = {
    collectCoverageFrom: [
        'src/**/*.{js,svelte}'
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
