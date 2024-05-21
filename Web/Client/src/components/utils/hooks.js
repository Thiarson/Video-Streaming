import { useState } from "react"

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

export { useError }
