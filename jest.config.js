module.exports = {
    collectCoverageFrom: [
        'src/**/*.{js,svelte}'
    ],
    transform: {
        // '\\.(js|svelte)$': './test/babel-svelte-jest'
        '^.+\\.svelte$': 'svelte-jester',
        '^.+\\.js$': 'babel-jest'
    },
    moduleFileExtensions: [
        'js',
        'json',
        'svelte'
    ]
};
