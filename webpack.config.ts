import path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  entry: ['./src/DBService/server.ts'],
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'DBService.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'node',
};

export default config;
