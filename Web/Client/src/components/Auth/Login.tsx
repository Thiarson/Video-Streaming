import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useQuery } from "react-query"
import type { FormEvent } from "react"

import Field from "../assets/Field"
import Popup from "../assets/Popup"
import Error from "../assets/Error"
import DbError from "../assets/DbError"
import InputError from "../assets/InputError"
import storage from "../utils/local-storage"
import { useError } from "../utils/hooks/useError"
import { useClient } from "../utils/context/client"
import { inputCheck, isFieldNull, showError } from "../utils/form-verif"
import { fetchServer } from "../utils/fetch-server"
import { responseSchema } from "../utils/data-validator"
import type { DynamicObject } from "../utils/types/object"
import type { FetchUserResponse } from "../utils/types/fetch"
import type { Login as Id } from "../utils/types/data"

import "../styles/Auth/Login.css"

function Login() {
  const navigate = useNavigate()
  const login = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)
  const formData = useRef<DynamicObject<string, string>>({})
  const { setUser } = useClient()
  const [ databaseError, setDatabaseError ] = useState(false)
  const { inputError, setInputError, resetInputError } = useError([ "login", "password" ])

  const queryKey = ["login"]
  const query = useQuery(queryKey, () => {
    return fetchServer.post("/api/login", { body: formData.current })
  }, { cacheTime: 0, enabled: false })
 
  const formVerif = (): Id | null => {
    let loginData: Id | null = null
    let isFormValid = true

    const inputs= isFieldNull({
      login: login.current,
      password: password.current,
    }) as DynamicObject<string, HTMLInputElement>

    for (const input in inputs) {
      const inputValid = inputCheck[input](inputs[input])
      isFormValid = isFormValid && inputValid

      if (!inputValid)
        setInputError(input, true)
    }

    if (isFormValid) {
      loginData = {
        login: inputs.login.value,
        password: inputs.password.value,
      }
    }

    return loginData
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    resetInputError()

    const loginData = formVerif()

    if (loginData === null)
      return

    formData.current = loginData
    query.refetch()
  }

  if (query.isError)
    console.error(query.error);

  if (query.isSuccess) {
    try {
      const response = query.data as FetchUserResponse
      const { success, data, token } = response

      responseSchema.parse(response)
      
      if (success) {
        storage.set("token", token)
        setUser(data)
        navigate("/home")
      } else {
        databaseError === false && setDatabaseError(true)
      }
    } catch (e) {
      console.error(e);
      return <Error code="502" action="reload">Réessayer</Error>
    }    
  }

  return (
    <>
      {query.isError && <Popup type="offline"/>}
      <div className="login-first-div scrollbar-hide">
        <div className="login-second-div">
          <h1 className="login-first-h1">Veuillez-vous connecter !</h1>
          {databaseError && <DbError>L'email ou le mot de passe est invalide !</DbError>}
          <div className="login-third-div">
            <h1 className="login-second-h1">Connexion</h1>
            <form className="login-form" onSubmit={handleSubmit}>
              <Field inputStyle="login-field focus:outline-none focus:ring-0 peer" type="text" name="login" defaultValue="0346302300" ref={login}>Email ou Téléphone</Field>
              {inputError["login"] && <InputError>{showError.input.login}</InputError>}
              <Field inputStyle="login-field focus:outline-none focus:ring-0 peer" type="password" name="password" ref={password}>Mot de passe</Field>
              {inputError["password"] && <InputError>{showError.input.password}</InputError>}
              <button className={`login-button hover:bg-red-700 ${query.isLoading && "login-disabled-button"} transition`} type="submit">Se connecter</button>
            </form>
            <p className="login-forget-password hover:underline"><Link to="/forget-password">Mot de passe oublié ?</Link></p>
          </div>
          <div className="login-fourth-div">
            <hr className="login-hr"/>
            <p className="login-new-paragraph">Vous êtes nouveau ?</p>
            <Link style={{ width: "100%" }} to="/signup"><button className="login-signup-button hover:bg-red-700 transition" type="submit">Créer un nouveau compte</button></Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
