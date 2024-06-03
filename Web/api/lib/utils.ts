import crypto from "node:crypto"

import type { DynamicObject } from "../utils/types/object"

const replaceSpecialChar = (str: string) => {
  const correspondence: DynamicObject<string, string> = {
    'é': 'e',
    'è': 'e',
    'ê': 'e',
    'ë': 'e',
    'à': 'a',
    'â': 'a',
    'ä': 'a',
    'ô': 'o',
    'ö': 'o',
    'û': 'u',
    'ü': 'u',
    'ç': 'c',
    '\'': '_',
    ' ': '_',
  }

  const regex = /[éèêëàâäôöûüç' ]/g
  const newStr = str.replace(regex, (match) => correspondence[match])

  return newStr
}

const generateKey = (keyLength = 8) => crypto.randomBytes(keyLength).toString('base64url')

const generateTime = (duration: string) => {
  const time = new Date()
  const temp = duration.split(":")

  time.setHours(parseInt(temp[0]))
  time.setMinutes(parseInt(temp[1]))
  time.setSeconds(parseInt(temp[2]))

  return time
}

export { replaceSpecialChar, generateKey, generateTime }
