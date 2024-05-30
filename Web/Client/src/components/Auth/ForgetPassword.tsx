import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useQuery, useQueryClient } from 'react-query'
import type { FC, FormEvent } from "react"

import Field from "../assets/Field"
import ResetPassword from "./ResetPassword"
import CodeVerification from "./CodeVerification"
import Popup from "../assets/Popup"
import Error from "../assets/Error"
import DbError from "../assets/DbError"
import InputError from "../assets/InputError"
import { inputCheck, isFieldNull, showError } from "../utils/form-verif"
import { closeModal, openModal } from "../utils/features/modal"
import { useError } from "../utils/hooks/useError"
import { fetchServer } from "../utils/fetch-server"
import { responseSchema } from "../utils/data-validator"
import type { RootState } from "../utils/context/store"
import type { Code } from "../utils/types/data"
import type { FetchCodeResponse } from "../utils/types/fetch"
import { DynamicObject } from '../utils/types/object'

import "../styles/Auth/ForgetPassword.css"

const ForgetPassword: FC = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const modal = useSelector((store: RootState) => store.modal)
  const email = useRef<HTMLInputElement>(null)
  const emailData = useRef({ email: "" })
  const code = useRef<Code>({ code: 0, email: "" })
  const [ validEmail, setValidEmail ] = useState(false)
  const [ emailError, setEmailError ] = useState(false)
  const { inputError, setInputError } = useError([ "email" ])

  const queryCodeKey = ["forget-password"]
  const queryCode = useQuery(queryCodeKey, () => {
    return fetchServer.post("/api/forget-password", { body: emailData.current })
  }, { cacheTime: 0, enabled: false })

  
  const handleEmailVerif = (e: FormEvent) => {
    e.preventDefault()
    
    const inputs = isFieldNull({ email: email.current}) as DynamicObject<string, HTMLInputElement>

    if (!inputCheck["email"](inputs.email)) {
      setInputError("email", true)
      return
    }
    
    setInputError("email", false)
    emailData.current = { email: inputs.email.value }
    queryCode.refetch()
  }

  const handleValidCode = () => {
    validEmail === false && setValidEmail(true)
  }

  if (queryCode.isError)
    console.error(queryCode.error);

  if (queryCode.isSuccess) {
    try {
      const response = queryCode.data as FetchCodeResponse
      const { success, data } = response

      responseSchema.parse(response)
      
      if (success && data) {
        code.current = data
        dispatch(openModal("codeVerif"))
        queryClient.resetQueries(queryCodeKey)
        // userData.current = data
        // validEmail === false && setValidEmail(true)
      } else {        
        emailError === false && setEmailError(true)
      }
    } catch (e) {
      console.error(e);
      return <Error code="502" action="reload">Réessayer</Error>
    }
  }

  if (validEmail)
    return <ResetPassword data={code.current}/>

  return (
    <>
    {queryCode.isError && <Popup type="offline"/>}
    {modal.codeVerif.isOpen && <CodeVerification data={code.current} onValid={handleValidCode} onRetry={queryCode.refetch} onClose={() => dispatch(closeModal("codeVerif"))}/>}
      <div className="forget-pass-first-container">
        <h1 className="forget-pass-first-title">Mot de passe oublié ?</h1>
        {emailError && <DbError>Aucun compte n'a cette adresse email !</DbError>}
        <div className="forget-pass-second-container">
          <h1 className="forget-pass-second-title">Vérification</h1>
          <form  className="forget-pass-form" onSubmit={handleEmailVerif}>
            <Field inputStyle="forget-pass-field focus:outline-none focus:ring-0 peer" type="email" name="email" ref={email} defaultValue="thiarsonantsa@gmail.com">
              Email
            </Field>
            {inputError["email"] && <InputError>{showError.input.email}</InputError>}
            <button className={`forget-pass-button hover:bg-red-700 transition ${queryCode.isLoading && "forget-pass-disabled-button"}`} type="submit">
              Récupérer
            </button>
          </form>
          <p className="forget-pass-paragraph">Pour se connecter, <Link className="forget-pass-login-link hover:underline" to='/login'>cliquer ici</Link></p>
        </div>
      </div>
    </>
  )
}

export default ForgetPassword
