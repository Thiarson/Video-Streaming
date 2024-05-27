import { useState, useEffect } from "react"

import { fetchServer } from "../fetch-server"
import type { FetchOptions, FetchCodeResponse, FetchUserResponse } from "../types/fetch"

type Response = FetchUserResponse | FetchCodeResponse

type Fetch = (url: string, options: FetchOptions) => { loading: boolean, response: Response, errors: any }

const useFetch: Fetch = (url, options = {}) => {
  const [ loading, setLoading ] = useState(true)
  const [ data, setData ] = useState<any>()
  const [ errors, setErrors ] = useState<any>()
  
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

export { useFetch }
