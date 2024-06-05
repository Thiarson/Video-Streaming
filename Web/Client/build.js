const fs = require("node:fs")
const path = require("node:path")
const { execSync } = require("node:child_process")

try {
  execSync('npx react-scripts build', { stdio: 'inherit' })

  const build = path.join(__dirname, 'build')
  const web = path.dirname(__dirname)
  const server = path.join(web, 'server/public')

  console.log('Removing public directory...')
  fs.rmSync(server, { recursive: true, force: true })

  console.log('Moving build to client directory...')
  fs.renameSync(build, server)

  console.log('Build exécutée avec succès !');
} catch (e) {
  console.error("Erreur lors du build : ", e);
}
