import { useState, useEffect } from "react"

function useFetch(url, options = {}) {
  const [ loading, setLoading ] = useState(true)
  const [ data, setData ] = useState(null)
  const [ errors, setErrors ] = useState(null)
  
  useEffect(() => {
    const headers = { ...options.headers }
    const body = { ...options.body }

    fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json; charset=UTF-8",
        ...headers
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.ok)
          return response.json()
      })
      .then((data) => {
        setData(data)
      })
      .catch((error) => {
        setErrors(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { loading, response: data, errors }
}

export default useFetch
