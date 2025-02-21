import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    babel({
      babelrc: false,
      presets: [['@babel/preset-env', { modules: false }], '@babel/react'],
      plugins: ['@babel/plugin-proposal-class-properties'],
      exclude: 'node_modules/**',
    }),
    resolve(),
    commonjs(),
  ],
};
