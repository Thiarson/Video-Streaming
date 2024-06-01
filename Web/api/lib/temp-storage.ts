import type { DynamicObject } from "../utils/types/object";

const inMemoryStore: DynamicObject<string, any> = {}

const set = (key: string, value: DynamicObject<string, any>, duration: number) => {
  inMemoryStore[key] = value

  setTimeout(() => {
    del(key)
  }, duration * 1000);
}

const get = (key: string) => {
  return inMemoryStore[key]
}

const del = (key: string) => {
  delete inMemoryStore[key]
}

export default { set, get, del}
