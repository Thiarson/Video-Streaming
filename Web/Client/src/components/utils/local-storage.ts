const storage = {
  token: localStorage.getItem("token"),
  set: (key: string, value?: string) => {
    value && localStorage.setItem(key, value)
  },
  remove: (key: string) => {
    localStorage.removeItem(key)
  },
}

export default storage
