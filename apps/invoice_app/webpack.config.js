const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

// Get environment-based URLs
const getRemoteUrl = (appName, defaultPort) => {
  const envVar = process.env[`REACT_APP_${appName.toUpperCase()}_URL`];
  if (envVar) {
    return envVar.endsWith('/') ? envVar : `${envVar}/`;
  }
  return `http://localhost:${defaultPort}/`;
};

const getPublicPath = () => {
  const envVar = process.env.REACT_APP_INVOICE_URL;
  if (envVar) {
    return envVar.endsWith('/') ? envVar : `${envVar}/`;
  }
  return 'http://localhost:3001/';
};

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  entry: './src/bootstrap.js',
  mode: isProduction ? 'production' : 'development',
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
    publicPath: getPublicPath(),
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
        test: /\.html$/,
        use: ['html-loader']
      },
      { 
        test: /\.svg$/, 
        use: ['@svgr/webpack'] 
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),
    new ModuleFederationPlugin({
      name: 'invoice_app',
      filename: 'remoteEntry.js',
      remotes: {
        mrt_table_app: `mrt_table_app@${getRemoteUrl('mrt_table_app', 3003)}remoteEntry.js`,
      },
      exposes: {
        './App': './src/ReactWrapper.js',
        './InvoiceComponent': './src/ReactWrapper.js'
      },
      shared: {
        angular: {
          singleton: true,
          requiredVersion: '^1.8.3'
        },
        react: {
          singleton: true,
          requiredVersion: '^18.3.1'
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.3.1'
        }
      }
    }),
  ],
};