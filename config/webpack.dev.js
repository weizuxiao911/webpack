const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js'); // 公共配置

const devConfig = {
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.css'],
    },
    mode: 'development', // 开发模式
    entry: path.join(__dirname, "../src/index.tsx"), // 入口，处理资源文件的依赖关系
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /.s[ac]ss|.css$/,
                exclude: /.min.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: "global"
                            }
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        'postcss-preset-env',
                                        {
                                            // 其他选项
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /.min.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            }
        ]
    },
    devServer: {
        static: path.join(__dirname, '../'),
        host: '0.0.0.0',
        port: 3333,
        historyApiFallback: true,
        compress: true,
        hot: true
    },
    output: {
        path: path.join(__dirname, "../"),
        filename: "dev.js",
    },
};
module.exports = merge(devConfig, baseConfig); // 合并配置