import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Serve root-level JSON manifests with correct content-type
function serveRootJsonPlugin() {
  const servedFiles = ['revision.json', 'pages.json']
  return {
    name: 'serve-root-json',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const filename = (req.url || '').replace(/^\//, '').split('?')[0]
        if (servedFiles.includes(filename)) {
          const filePath = path.resolve(__dirname, filename)
          try {
            const content = fs.readFileSync(filePath, 'utf-8')
            JSON.parse(content) // validate
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.setHeader('Cache-Control', 'no-cache')
            res.end(content)
          } catch {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Invalid JSON in ' + filename }))
          }
          return
        }
        next()
      })
    },
  }
}


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    serveRootJsonPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})