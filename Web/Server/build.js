const fs = require("node:fs")
const path = require("node:path")
const { execSync } = require("node:child_process")

try {
  const root = path.dirname(__filename)
  const distDir = path.join(root, "dist")

  console.log('Removing dist directory...')
  fs.rmSync(distDir, { recursive: true, force: true })
  
  console.log("Building...");
  execSync('npx tsc', { stdio: 'inherit' })

  console.log('Build exécutée avec succès !');
} catch (e) {
  console.error("Erreur lors du build : ", e);
}
