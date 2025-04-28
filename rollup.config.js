import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/calendly-fastload.min.js',
    format: 'umd',
    name: 'CalendlyFastLoad',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    terser(),
  ],
};
