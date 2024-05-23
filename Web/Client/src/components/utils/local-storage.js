const storage = {
  token: localStorage.getItem("token"),
  set: (key, value) => {
    localStorage.setItem(key, value)
  },
  remove: (key) => {
    localStorage.removeItem(key)
  },
}

export default storage
