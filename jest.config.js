module.exports = {
    collectCoverageFrom: [
        'src/**/*.{js,svelte}'
    ],
    transform: {
        '^.+\\.svelte$': [ 'svelte-jester', {
            preprocess: true
        } ],
        '^.+\\.js$': 'babel-jest'
    },
    moduleFileExtensions: [
        'js',
        'svelte'
    ]
};
