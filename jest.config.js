module.exports = {
    collectCoverageFrom: [
        'src/**/*.{js,svlt}'
    ],
    transform: {
        '\\.js$': 'babel-jest',
        '\\.svlt$': './test/svelte-jest'
    },
    moduleFileExtensions: [
        'js',
        'json',
        'svlt'
    ]
};
