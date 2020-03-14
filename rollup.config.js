import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  external: [ 'crypto' ],
  plugins: [
    external(),
    postcss({
      modules: true
    }),
    url(),
    babel({
      babelrc: false,
      runtimeHelpers: true,
      presets: [
        ['@babel/preset-env', { modules: false }],
        '@babel/react',
      ],
      plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-function-bind',
      ],
      exclude: 'node_modules/**',
    }),
    resolve(),
    commonjs()
  ]
}
