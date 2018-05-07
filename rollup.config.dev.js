const path = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const svelte = require('rollup-plugin-svelte');

module.exports = {
    input: './src/index.js',
    output: {
        file: 'dist/calio.min.js',
        format: 'iife',
        name: 'Calio',
        sourcemap: true
    },
    plugins: [
        svelte({
            extensions: ['.svlt', '.svelte'],
            preprocess: {
                style: async ({content, filename}) => {
                    const result = await postcss([
                        autoprefixer({
                            flexbox: 'no-2009',
                            grid: true
                        })
                    ]).process(content, {
                        to: path.basename(filename),
                        from: path.basename(filename)
                    });

                    return {
                        code: result.css,
                        map: result.map
                    };
                }
            }
        })
    ]
};
