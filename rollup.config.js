import babel from 'rollup-plugin-babel';
import json from '@rollup/plugin-json';
import karas from 'rollup-plugin-karas';

export default [{
  input: 'src/index.js',
  output: {
    name: 'Dragonbones',
    file: 'index.js',
    format: 'umd',
    sourcemap: true,
    globals: {
      karas: 'karas',
    },
  },
  plugins: [
    karas(),
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
      runtimeHelpers: true
    }),
    json(),
  ],
}];
