import path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  entry: { standalone: './src/standalone.ts', balancer: './src/balancer.ts' },
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
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'node',
};

export default config;
