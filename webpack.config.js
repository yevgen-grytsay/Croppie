const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = [
    {
        entry: './src/croppie.js',
        output: {
            library: 'Croppie',
            libraryTarget: 'umd',
            filename: 'croppie.js',
            path: path.resolve(__dirname, 'lib')
        },
        externals: {
            "promise-polyfill": {
                commonjs: "Promise",
                commonjs2: "Promise",
                amd: "Promise",
                root: "Promise"
            }
        },
        module: {
            rules: [{
                test: require.resolve("./src/croppie.js"),
                use: 'exports-loader?Croppie'
            }]
        }
    },
    {
        entry: './src/croppie.js',
        output: {
            library: 'Croppie',
            libraryTarget: 'umd',
            filename: 'croppie.full.js',
            path: path.resolve(__dirname, 'lib')
        },
        module: {
            rules: [{
                test: require.resolve("./src/croppie.js"),
                use: 'exports-loader?Croppie'
            }]
        }
    },
    {
        entry: './src/croppie.js',
        output: {
            library: 'Croppie',
            libraryTarget: 'umd',
            filename: 'croppie.min.js',
            path: path.resolve(__dirname, 'lib')
        },
        externals: {
            "promise-polyfill": {
                commonjs: "Promise",
                commonjs2: "Promise",
                amd: "Promise",
                root: "Promise"
            }
        },
        module: {
            rules: [{
                test: require.resolve("./src/croppie.js"),
                use: 'exports-loader?Croppie'
            }]
        },
        plugins: [
            new UglifyJSPlugin()
        ]
    },
    {
        entry: './src/croppie.js',
        output: {
            library: 'Croppie',
            libraryTarget: 'umd',
            filename: 'croppie.full.min.js',
            path: path.resolve(__dirname, 'lib')
        },
        module: {
            rules: [{
                test: require.resolve("./src/croppie.js"),
                use: 'exports-loader?Croppie'
            }]
        },
        plugins: [
            new UglifyJSPlugin()
        ]
    }
];