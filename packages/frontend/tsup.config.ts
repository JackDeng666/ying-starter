// import { defineConfig } from 'tsup'
// import { exec } from 'node:child_process'
// import { cp } from 'node:fs/promises'

// export default defineConfig(options => ({
//   entry: {
//     hooks: 'src/hooks/index.ts',
//     utils: 'src/utils/index.ts',
//     icons: 'src/icons/index.ts',
//     ui: 'src/ui/index.ts',
//     components: 'src/components/index.ts',
//     editor: 'src/editor/index.ts'
//   },
//   format: 'esm',
//   dts: false,
//   clean: !options.watch,
//   treeshake: true,
//   splitting: true,
//   loader: {
//     '.css': 'copy',
//     '.scss': 'copy'
//   },
//   onSuccess: async () => {
//     await cp('src/styles.css', 'dist/styles.css')
//     exec('tsc --emitDeclarationOnly --declaration --outDir ./dist-types', (err, stdout) => {
//       if (err) {
//         console.error(stdout)
//         if (!options.watch) {
//           process.exit(1)
//         }
//       }
//     })
//   }
// }))
