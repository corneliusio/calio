const path = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

module.exports = {
    extensions: [ '.svlt', '.svelte' ],
    preprocess: {
        markup: !process.env.NODE_ENV ? ({ content }) => ({
            code: content.replace(/[\n\r\s\t]+(?=<\w|<\/|{#|{:|{\/|{\w)/g, ' ')
        }) : ({ content }) => ({
            code: content
        }),
        style: async ({ content, filename }) => {
            const result = await postcss([
                autoprefixer({ flexbox: 'no-2009', grid: 'no-autoplace' })
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
};
