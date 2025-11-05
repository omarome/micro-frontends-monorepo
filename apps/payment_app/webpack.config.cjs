const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

// Get environment-based URLs
const getPublicPath = () => {
  const envVar = process.env.REACT_APP_PAYMENT_URL;
  if (envVar) {
    return envVar.endsWith('/') ? envVar : `${envVar}/`;
  }
  return 'http://localhost:3002/';
};

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: "./src/main.tsx",
    output: {
        publicPath: getPublicPath(),
        filename: '[name].bundle.js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ]
                    }
                }
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            },
            {
                test: /\.module\.css$/,
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, '../../libs/ui-styles/src')
                ],
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[name]__[local]--[hash:base64:5]',
                            },
                        },
                    },
                ]
            },
            {
                test: /(?<!\.module)\.css$/,
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, '../../libs/ui-styles/src')
                ],
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                type: 'asset/resource'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.mjs'],
        alias: {
            '@ui-styles': path.resolve(__dirname, '../../libs/ui-styles/src')
        }
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new ModuleFederationPlugin({
            name: 'payment_app',
            filename: 'remoteEntry.js',
            exposes: {
                './App': './src/App.tsx',
                './PaymentForm': './src/PaymentForm.tsx',
            },
            shared: {
                react: { 
                    singleton: true, 
                    requiredVersion: '^18.2.0',
                    strictVersion: false,
                    eager: false
                },
                'react-dom': { 
                    singleton: true, 
                    requiredVersion: '^18.2.0',
                    strictVersion: false,
                    eager: false
                },
                'react-router-dom': { 
                    singleton: true, 
                    requiredVersion: '^6.0.0',
                    strictVersion: false,
                    eager: false
                }
            }
        }),
    ],
    devServer: {
        port: 3002,
        historyApiFallback: true,
        hot: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    }
};