const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  devtool: 'eval-source-map',
  entry: './src/bootstrap.js',
  mode: 'development',
  devServer: {
    port: 3001,
    historyApiFallback: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  output: {
    publicPath: 'http://localhost:3001/',
    filename: '[name].bundle.js',
    clean: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
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
        test: /\.css$/, 
        use: ['style-loader', 'css-loader'] 
      },
      { 
        test: /\.svg$/, 
        use: ['@svgr/webpack'] 
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'legacyApp',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/ReactWrapper.js',
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
        }
      },
    }),
    new HtmlWebpackPlugin({ template: './index.html' }),
  ],
};