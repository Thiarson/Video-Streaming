import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from 'framer-motion';
import type { FC, RefObject } from "react"

import Countdowm from "../assets/Countdown"
import OneField from "../assets/OneField"
import type { Code } from "../utils/types/data"

import "../styles/Auth/CodeVerification.css"

type Props = {
  data: Code,
  onClose: Function,
  onRetry: Function,
  onValid: Function,
}

type CodeVerifStatus = "idle" | "valid" | "wrong"

const CodeVerification: FC<Props> = ({ data, onClose, onRetry, onValid }) => {  
  const first = useRef<HTMLInputElement>(null)
  const second = useRef<HTMLInputElement>(null)
  const third = useRef<HTMLInputElement>(null)
  const fourth = useRef<HTMLInputElement>(null)
  const fields = [ first, second, third, fourth ]
  const [ visible, setVisible ] = useState(false)
  const [ status, setStatus ] = useState<CodeVerifStatus>("idle")
  const [ stop, setStop ] = useState(false)

  const handleTimeout = () => {
    console.log('Timeout')
    setStatus("wrong")
    changeStyles([ first, second, third, fourth ])
  }

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => {
      onClose()
    }, 500);
  }

  const handleRetry = () => {
    handleClose()
    setTimeout(() => {
      onRetry()
    }, 1000);
  }

  const handleVerif = () => {
    const valid = fieldsVerif(data.code, first, second, third, fourth)    

    if (valid) {
      onValid()
      handleClose()
    }
  }

  const fieldsVerif = (code: number, ...fields: (RefObject<HTMLInputElement> | null)[]) => {
    let userTry = ""

    fields.forEach((field) => {
      if (field === null || !field.current)
        throw new Error("Code must be number")

      userTry += field.current.value
    })

    if (code !== parseInt(userTry)) {
      changeStyles(fields)
      setStatus("wrong")

      return false
    }

    setStatus("valid")
    return true
  }

  const changeStyles = (fields: (RefObject<HTMLInputElement> | null)[]) => {
    fields.forEach((field) => {
      if (field === null || !field.current)
        throw new Error("Code must be number")

      field.current.style.borderWidth = "2px"
      field.current.style.borderRadius = "5px"
      field.current.style.borderColor = "red"
      setStop(true)
    })
  }

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <AnimatePresence>
      {visible &&
      (<motion.div
        className="code-first-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="code-second-container"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="code-title-container">
            <h1 className="code-title">Code de vérification</h1>
            <hr className="code-hr"/>
          </div>
          <div className="code-content-container">
            <div className="code-text-container">
              <div className="code-timeout">
                <Countdowm finish="Le code n'est plus valide !" start={60} stop={stop} onTimeout={handleTimeout}>
                  Le message expire dans :
                </Countdowm>
              </div>
              <div className="flex flex-row justify-around w-full">
                {fields.map((field, index) =>
                  <OneField key={index} ref={field}/>)}
              </div>
              <p><button onClick={handleRetry} className="code-resend-link hover:underline">Renvoyer le code</button></p>
            </div>
            <div className="code-button-container">
              <button className={`code-button ${status !== "idle" ? "code-disabled-button" : "bg-red-600 hover:bg-red-700 "} transition`} onClick={handleVerif}>Vérifier</button>
              <button className=" code-button bg-zinc-500 hover:bg-zinc-600 transition"onClick={handleClose}>Annuler</button>
            </div>
          </div>
        </motion.div>
      </motion.div>)}
    </AnimatePresence>
  )
}

export default CodeVerification
