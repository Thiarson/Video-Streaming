const fetchServer = {
  post: (serverUrl, params = {}) => {
    const headers = { ...params.headers }
    const body = { ...params.body }

    return new Promise((resolve, reject) => {
      fetch(serverUrl, {
        method: 'POST',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...headers
        },
        body: JSON.stringify(body),
      })
        .then((response) => {
          if (response.ok)
            resolve(response.json())
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}

export { fetchServer }
