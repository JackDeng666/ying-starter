const { NxWebpackPlugin } = require('@nx/webpack')
const { join } = require('path')

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/server')
  },
  plugins: [
    new NxWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets', './src/i18n'],
      optimization: false,
      outputHashing: 'none',
      transformers: [
        { name: '@nestjs/swagger/plugin', options: { dtoFileNameSuffix: ['.dto.ts', '.entity.ts', '.vo.ts'] } }
      ]
    })
  ]
}
