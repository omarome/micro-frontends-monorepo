const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

// Get environment-based URLs
const getRemoteUrl = (appName, defaultPort) => {
  const envVar = process.env[`REACT_APP_${appName.toUpperCase()}_URL`];
  if (envVar) {
    return envVar.endsWith('/') ? envVar : `${envVar}/`;
  }
  return `http://localhost:${defaultPort}/`;
};

const getPublicPath = () => {
  const envVar = process.env.REACT_APP_SHELL_URL;
  if (envVar) {
    return envVar.endsWith('/') ? envVar : `${envVar}/`;
  }
  return 'http://localhost:3000/';
};

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: "./src/main.js",
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
            name: 'shell',
            remotes: {
                payment_app: `payment_app@${getRemoteUrl('payment_app', 3002)}remoteEntry.js`,
                invoice_app: `invoice_app@${getRemoteUrl('invoice_app', 3001)}remoteEntry.js`,
                mrt_table_app: `mrt_table_app@${getRemoteUrl('mrt_table_app', 3003)}remoteEntry.js`,
                analysis_app: `analysis_app@${getRemoteUrl('analysis_app', 3004)}remoteEntry.js`,
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
        port: 3000,
        historyApiFallback: true,
        hot: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    }
};