import path from 'path'

import Webpack from 'webpack'
import FaviconsWebpackPlugin from 'favicons-webpack-plugin'
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import Visualizer from 'webpack-visualizer-plugin'

const MODE = JSON.stringify(process.env.NODE_ENV)

export default {
    target: 'web',

    mode: MODE === '"development"' ? 'development' : 'production',

    context: __dirname,

    devtool: (
        MODE === '"development"' ? 'cheap-module-source-map' : 'source-map'
    ),

    entry: {
        base: MODE === '"development"' ?
            ['react-hot-loader/patch', 'index.jsx'] :
            'index.jsx'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name]-[hash].js',
        sourceMapFilename: 'js/[name]-[hash].js.map',
        publicPath: (
            MODE === '"development"' ? 'http://localhost:3000/' : undefined
        ),
        crossOriginLoading: 'anonymous'
    },

    devServer: {
        hot: true,
        port: 3000,
        inline: true,
        publicPath: '/',
        stats: ['minimal', 'color'],
        headers: { 'Access-Control-Allow-Origin': '*' }
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: ['react', 'es2015', 'stage-2']
                }
            },
            {
                test: /\.(less|css)$/,
                use: MODE === '"development"' ?
                    ['style-loader', 'css-loader', 'less-loader'] :
                    [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: { publicPath: '../' }
                        },
                        'css-loader',
                        'less-loader'
                    ]
            },
            {
                test: /\.(jpeg|jpg|gif|png|woff|woff2|ttf|eot|otf|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'files/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },

    resolve: {
        modules: ['node_modules', 'src'],
        extensions: ['.js', '.jsx']
    },

    optimization: {
        minimize: MODE !== '"development"',
        minimizer: [
            new UglifyJSPlugin({
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            chunks: MODE === '"development"' ? () => false : 'all',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    name: 'common',
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve('.', 'src', 'index.html')
        }),
        new FaviconsWebpackPlugin({
            logo: path.resolve('.', 'src', 'images', 'icon_or.png'),
            prefix: 'icons/',
            emitStats: false,
            inject: true
        }),
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': MODE
        })
    ].concat(
        MODE === '"development"' ?
            [
                new HardSourceWebpackPlugin(),
                new Webpack.NamedModulesPlugin(),
                new Webpack.HotModuleReplacementPlugin(),
                new Webpack.NoEmitOnErrorsPlugin(),
                new Visualizer()
            ] :
            [
                new MiniCssExtractPlugin({
                    filename: 'css/[name].css'
                })
            ]
    )
}
