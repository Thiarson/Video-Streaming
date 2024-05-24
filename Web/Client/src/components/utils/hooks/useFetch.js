import { useState, useEffect } from "react"
import { fetchServer } from "../fetch-server"

function useFetch(url, options = {}) {
  const [ loading, setLoading ] = useState(true)
  const [ data, setData ] = useState(null)
  const [ errors, setErrors ] = useState(null)
  
  useEffect(() => {
    fetchServer.post(url, options)
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setErrors(error);
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { loading, response: data, errors }
}

export default useFetch
