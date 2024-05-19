const fs = require("node:fs")
const path = require("node:path")
const { execSync } = require("node:child_process")

try {
  execSync('npm run build', { stdio: 'inherit' })

  const build = path.join(__dirname, 'build')
  const web = path.dirname(__dirname)
  const root = path.dirname(web)
  const publicDir = path.join(root, 'Server/src/public')

  console.log('Removing public directory...')
  fs.rmSync(publicDir, { recursive: true, force: true })

  console.log('Moving build to public directory...')
  fs.renameSync(build, publicDir)

  console.log('Build exécutée avec succès !');
} catch (e) {
  console.error("Erreur lord du build : ", e);
}
