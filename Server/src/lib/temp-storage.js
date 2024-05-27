const inMemoryStore = {}

const set = (key, value, duration) => {
  inMemoryStore[key] = value

  setTimeout(() => {
    del(key)
  }, duration * 1000);
}

const get = (key) => {
  return inMemoryStore[key]
}

const del = (key) => {
  delete inMemoryStore[key]
}

module.exports = { set, get, del }
