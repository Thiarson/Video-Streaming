import { useState } from "react"

import type { DynamicObject } from "../types/object"

function useError(inputArray: string[]) {
  const inputs: DynamicObject<string, boolean> = {}
  
  inputArray.forEach((input) => {
    inputs[input] = false
  })

  const [ inputError, setInputError ] = useState(inputs)

  const setInput = (elt: string, value: boolean) => {
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

  return { inputError, setInputError: setInput, resetInputError: resetInput }
}

export { useError }
