module.exports = {
    collectCoverageFrom: [
        'src/**/*.{js,svelte}'
    ],
    transform: {
        '^.+\\.svelte$': 'svelte-jester',
        '^.+\\.js$': 'babel-jest'
    },
    moduleFileExtensions: [
        'js',
        'svelte'
    ]
};
