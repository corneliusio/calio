module.exports = {
    plugins: {
        'postcss-import': {},
        'tailwindcss': {},
        'autoprefixer': global.inProduction
            ? { flexbox: 'no-2009', grid: 'no-autoplace' }
            : false,
        'postcss-nesting': {},
        'postcss-color-function': {}
    }
};
