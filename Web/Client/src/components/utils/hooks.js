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

function useError(inputArray) {
  const inputs = {}
  
  inputArray.forEach((input) => {
    inputs[input] = false
  })

  const [ inputError, setInputError ] = useState(inputs)

  const setInput = (elt, value) => {
    setInputError((state) => {
      const inputs = { ...state }

      inputs[elt] = value

      return inputs
    })
  }

  const resetInput = () => {
    setInputError((state) => {
      const inputs = { ...state }

      for (const input in inputs) {
        inputs[input] = false
      }

      return inputs
    })
  }

  return [ inputError, setInput, resetInput ]
}

export { useFetch, useError }
