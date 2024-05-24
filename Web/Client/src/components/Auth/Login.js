import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useQuery } from "react-query"
import { VscError } from "react-icons/vsc"
import { BiError } from "react-icons/bi"

import Field from "../assets/Field"
import Offline from "../assets/Offline"
import useError from "../utils/hooks/useError"
import storage from "../utils/local-storage"
import { useClient } from "../utils/context/client"
import { inputCheck, showError } from "../utils/form-verif"
import { fetchServer } from "../utils/fetch-server"

import "../styles/Login.css"

function Login() {
  const navigate = useNavigate()
  const { setUser } = useClient()
  const login = useRef(null)
  const password = useRef(null)
  const formData = useRef(null)
  const [ inputError, setInputError, resetInputError ] = useError([ "login", "password" ])
  const [ databaseError, setDatabaseError ] = useState(false)

  const queryKey = ["login"]
  const query = useQuery(queryKey, () => {
    return fetchServer.post("/api/login", { body: formData.current })
  }, { enabled: false })

  const dbError = (
    <div className="login-error">
      <BiError size={25}/>
      <p>L'email ou le mot de passe est invalide !</p>
    </div>
  )

  const error = (input) => (
    <div className="input-error">
      <VscError size={20}/>
      <p>{input}</p>
    </div>
  )
 
  const formVerif = () => {
    let loginData = null
    let isFormValid = true
    const inputs = {
      login: login.current,
      password: password.current,
    }

    for (const input in inputs) {
      const inputValid = inputCheck[input](inputs[input])
      isFormValid = isFormValid && inputValid

      if (!inputValid)
        setInputError(input, true)
    }

    if (isFormValid) {
      loginData = {
        login: login.current.value,
        password: password.current.value,
      }
    }

    return loginData
  }

  const handleSubmit = async (e) => {
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
    const { success, data, token } = query.data
      if (success) {
        storage.set("token", token)
        setUser(data)
        navigate("/home")
      } else {
        setDatabaseError(true)
      }

    query.remove()
  }

  return (
    <>
      {query.isError && <Offline/>}
      <div className="first-div scrollbar-hide">
        <div className="second-div">
          <h1 className="first-h1">Veuillez-vous connecter !</h1>
          {databaseError === true ? dbError : null}
          <div className="third-div">
            <h1 className="second-h1">Connexion</h1>
            <form className="login-form" onSubmit={handleSubmit}>
              <Field inputStyle="login-field focus:outline-none focus:ring-0 peer" type="text" name="login" defaultValue="0346302300" ref={login}>Email ou Téléphone</Field>
              {inputError["login"] === true ? error(showError.input.login) : null}
              <Field inputStyle="login-field focus:outline-none focus:ring-0 peer" type="password" name="password" ref={password}>Mot de passe</Field>
              {inputError["password"] === true ? error(showError.input.password) : null}
              <button className={`login-button hover:bg-red-700 ${query.isLoading && "disabled-button"}`} type="submit">Se connecter</button>
            </form>
            <p className="forget-password hover:underline"><Link to="/forget-password">Mot de passe oublié ?</Link></p>
          </div>
          <div className="fourth-div">
            <hr className="hr"/>
            <p className="new-p">Vous êtes nouveau ?</p>
            <Link style={{ width: "100%" }} to="/signup"><button className="signup-button hover:bg-red-700" type="submit">Créer un nouveau compte</button></Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
