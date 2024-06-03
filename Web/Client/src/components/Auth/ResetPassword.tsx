import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useQuery } from "react-query"
import type { ChangeEvent, FC, FormEvent } from "react"

import Popup from "../assets/Popup"
import Error from "../assets/Error"
import DbError from "../assets/DbError"
import InputError from "../assets/InputError"
import { changeStyle, inputCheck, showError } from "../utils/form-verif"
import { useError } from "../utils/hooks/useError"
import { fetchServer } from "../utils/fetch-server"
import { responseSchema } from "../utils/data-validator"
import type { Code } from "../utils/types/data"
import type { FetchVoidResponse } from "../utils/types/fetch"

import "../styles/Auth/ResetPassword.css"

type Props = {
  data: Code | null,
}

const ResetPassword: FC<Props> = ({ data }) => {
  const navigate = useNavigate()
  const userData = useRef({ password: "", email: data?.email, })
  const [ password, setPassword ] = useState('fanantenana')
  const [ dbError, setDbError ] = useState(false)
  const [ updated, setUpdated ] = useState(false)
  const { inputError, setInputError } = useError([ "password" ])

  const queryKey = ["reset-password"]
  const query = useQuery(queryKey, () => {
    return fetchServer.post("/api/reset-password", { body: userData.current })
  }, { cacheTime: 0, enabled: false })

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 6) {
      changeStyle(e.target, "invalid")
      setInputError("password", true)
    } else {
      changeStyle(e.target, "valid")
      setInputError("password", false)
    }

    setPassword(e.target.value)
  }
  
  const handlePasswordReset = (e: FormEvent) => {
    e.preventDefault()
    
    if (data === null)
      window.location.reload()

    const passwordInput = document.getElementById('password') as HTMLInputElement

    if(passwordInput && !inputCheck['password'](passwordInput)) {
      setInputError("password", true)
      return
    }

    setInputError("password", false)
    userData.current = { password: password, email: data?.email, }
    query.refetch()
  }
    
  if (query.isError)
    console.error(query.error);

  if (query.isSuccess) {
    try {
      const response = query.data as FetchVoidResponse
      const { success } = response

      responseSchema.parse(response)
      
      if (success) {
        updated === false && setUpdated(() => {
          setTimeout(() => {
            navigate("/login")
          }, 1500);

          return true
        })
      } else {        
        !dbError && setDbError(true)
      }
    } catch (e) {
      console.error(e);
      return <Error code="502" action="reload">Réessayer</Error>
    }
  }

  return (
    <>
      {updated && <Popup type="success"/>}
      {query.isError && <Popup type="offline"/>}
      <div className="w-full h-full bg-white text-black overflow-x-scroll scrollbar-hide">
        <div className="reset-pass-first-container">
          <h1 className="reset-pass-first-title">Mot de passe oublié ?</h1>
          {dbError && <DbError>La réinitialisation n'a pas pu être éffecutée</DbError>}
          <div className="reset-pass-second-container">
            <h1 className="reset-pass-second-title">Réinitialisation</h1>
            <form className="reset-pass-form" onSubmit={handlePasswordReset}>
              <div className="relative">
                <input className="reset-pass-input focus:outline-none focus:ring-0 peer" placeholder=" " type="password" name="password" id="password" value={password} onChange={handlePasswordChange}/>
                <label className="reset-pass-label duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3" htmlFor="password">
                  Mot de passe
                </label>
              </div>
              {inputError["password"] && <InputError>{showError.input.password}</InputError>}
              <button className={`reset-pass-button hover:bg-red-700 transition ${query.isLoading && "reset-pass-disabled-button"}`} type="submit">
                Changer
                </button>
            </form>
            <p className="reset-pass-paragraph">Pour se connecter, <Link className="reset-pass-login-link hover:underline" to='/login'>cliquez ici</Link></p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResetPassword
