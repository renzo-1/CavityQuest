/**
 * Webpack config for production electron main process
 */
import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import baseConfig from './webpack.config.base';
import webpackPaths from './webpack.paths';
import checkNodeEnv from '../scripts/check-node-env';
import deleteSourceMaps from '../scripts/delete-source-maps';

checkNodeEnv('production');
deleteSourceMaps();

const configuration: webpack.Configuration = {
  devtool: 'source-map',

  mode: 'production',

  target: 'electron-main',

  entry: {
    main: path.join(webpackPaths.srcMainPath, 'main.ts'),
    preload: path.join(webpackPaths.srcMainPath, 'preload.ts'),
  },

  output: {
    path: webpackPaths.distMainPath,
    filename: '[name].js',
    library: {
      type: 'umd',
    },
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
      analyzerPort: 8888,
    }),
    new CopyPlugin({
      // Use copy plugin to copy *.wasm to output folder.
      patterns: [
        {
          from: './src/models/tfjs/model.json',
          to: 'model.json',
        },
        {
          from: './src/models/tfjs/group1-shard1of6.bin',
          to: 'group1-shard1of6.bin',
        },
        {
          from: './src/models/tfjs/group1-shard2of6.bin',
          to: 'group1-shard2of6.bin',
        },
        {
          from: './src/models/tfjs/group1-shard3of6.bin',
          to: 'group1-shard3of6.bin',
        },
        {
          from: './src/models/tfjs/group1-shard4of6.bin',
          to: 'group1-shard4of6.bin',
        },
        {
          from: './src/models/tfjs/group1-shard5of6.bin',
          to: 'group1-shard5of6.bin',
        },
        {
          from: './src/models/tfjs/group1-shard6of6.bin',
          to: 'group1-shard6of6.bin',
        },
      ],
    }),
    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false,
    }),

    new webpack.DefinePlugin({
      'process.type': '"browser"',
    }),
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */

  node: {
    __dirname: false,
    __filename: false,
  },
};

export default merge(baseConfig, configuration);
