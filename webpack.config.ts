import path from 'path';
// import { Configuration } from 'webpack';
const HtmlWebpackPlugin = require('html-webpack-plugin');

import * as webpack from 'webpack';
import * as webpackDevServer from 'webpack-dev-server';

const config: webpack.Configuration = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.(ts|js|jsx|tsx)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              '@babel/preset-env',
              '@babel/preset-typescript',
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 4000,
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve('public/index.html'),
    }),
  ],
};
export default config;
