import buble from '@rollup/plugin-buble'

export default {
  base: './',
  server: {
    host: '0.0.0.0',
  },
  build: {
    assetsDir: 'js',
    polyfillModulePreload: false,
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['pixi.js', 'pako'],
      output: {
        dir: 'dist/js',
        globals: {
          'pixi.js': 'PIXI',
          pako: 'pako',
        },
      },
      plugins: [
        //去掉'=>'等es6代码
        buble(),
      ],
    },
  },
}
