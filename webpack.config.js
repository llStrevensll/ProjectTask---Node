const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './public/js/app.js', //punto de entrada
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, './public/dist')
    },
    module: {
        rules: [{
            test: /\.m?js$/, //-> toma todos los archivo en el js del entry point
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    }
}