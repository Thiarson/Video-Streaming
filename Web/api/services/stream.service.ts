import path from "node:path"
import fs from "node:fs"

import type { DynamicObject } from "../utils/types/object"

const streamService: DynamicObject<string, Function> = {}

streamService.getContent = async (url: string) => {
  const src = path.dirname(__dirname)
  const root = path.dirname(src)
  const contentPath = path.join(root, 'data', url)
  const content = fs.readFileSync(contentPath)

  return content
}

export default streamService
