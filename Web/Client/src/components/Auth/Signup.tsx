import { useRef, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useQuery, useQueryClient } from "react-query"
import type { FormEvent } from "react"

import Field from "../assets/Field"
import Popup from "../assets/Popup"
import CodeVerification from './CodeVerification';
import Error from "../assets/Error"
import DbError from "../assets/DbError"
import InputError from "../assets/InputError"
import storage from "../utils/local-storage"
import { openModal, closeModal } from "../utils/features/modal"
import { useClient } from "../utils/context/client"
import { useError } from "../utils/hooks/useError"
import { fetchServer } from "../utils/fetch-server"
import { responseSchema } from "../utils/data-validator"
import { sexCheck, confirmCheck, inputCheck, isBoxNull, isFieldNull, showError } from "../utils/form-verif"
import type { DynamicObject } from "../utils/types/object"
import type { FetchCodeResponse, FetchUserResponse } from "../utils/types/fetch"
import type { Code, Signup as Info} from "../utils/types/data"
import type { RootState } from "../utils/context/store"

import "../styles/Auth/Signup.css"

function Signup() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const male = useRef<HTMLInputElement>(null)
  const female = useRef<HTMLInputElement>(null)
  const pseudo = useRef<HTMLInputElement>(null)
  const email = useRef<HTMLInputElement>(null)
  const phone = useRef<HTMLInputElement>(null)
  const birth = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)
  const confirm = useRef<HTMLInputElement>(null)
  const formData = useRef<DynamicObject<string, string>>({})
  const modal = useSelector((store: RootState) => store.modal)
  const code = useRef<Code>({ code: 0, email: "", })
  const { setUser } = useClient()
  const [ databaseError, setDatabaseError ] = useState(false)
  const { inputError, setInputError, resetInputError } = useError([ "sex", "pseudo", "phone", "email", "birth", "password", "confirm" ])

  const queryCodeKey = ["signup"]
  const queryCode = useQuery(queryCodeKey, () => {
    return fetchServer.post("/api/signup", { body: formData.current })
  }, { cacheTime: 0, enabled: false })

  const queryUserKey = ["code-valid"]
  const queryUser = useQuery(queryUserKey, () => {
    return fetchServer.post("/api/code-valid", { body: code.current})
  }, { cacheTime: 0, enabled: false })

  const formVerif = (): Info | null => {
    let signupData: Info | null = null
    let isFormValid = true
    const inputs = isFieldNull({
      pseudo: pseudo.current,
      email: email.current,
      phone: phone.current,
      birth: birth.current,
      password: password.current,
    })
    const checkBox = isBoxNull([ male.current, female.current ])
    const confirmation = isFieldNull({ confirm: confirm.current, password: password.current })

    isFormValid = isFormValid && sexCheck(checkBox)
    isFormValid = isFormValid && confirmCheck(confirmation)

    for (const input in inputs) {
      const inputValid = inputCheck[input](inputs[input])
      isFormValid = isFormValid && inputValid

      if(!inputValid) {
        setInputError(input, true)
      }
      else {
        setInputError(input, false)
      }
    }

    if(isFormValid) {
      let sex = ''

      if(checkBox[0].checked)
        sex = checkBox[0].value
      else
        sex = checkBox[1].value

      signupData = {
        sex: sex,
        pseudo: inputs.pseudo.value,
        email: inputs.email.value,
        phone: inputs.phone.value,
        birth: inputs.birth.value,
        password: inputs.password.value,
      }
    }

    return signupData
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    resetInputError()

    const signupData = formVerif()

    if(signupData === null)
      return
    
    formData.current = signupData
    queryCode.refetch()
  }

  useEffect(() => {
    const inputs = isFieldNull({
      pseudo: pseudo.current,
      email: email.current,
      phone: phone.current,
      birth: birth.current,
      password: password.current,
    })
    const confirmation = isFieldNull({ confirm: confirm.current, password: password.current })

    confirmation.confirm.onblur = () => {
      const inputValid = confirmCheck(confirmation)

      if(!inputValid)
        setInputError("confirm", true)
      else
        setInputError("confirm", false)
    }

    for (const input in inputs) {
      inputs[input].onblur = () => {
        const inputValid = inputCheck[input](inputs[input])

        if(!inputValid)
          setInputError(input, true)
        else
          setInputError(input, false)
      } 
    }
  }, [])

  if (queryCode.isError)
    console.error(queryCode.error);
  if (queryUser.isError)
    console.error(queryUser.error);

  if (queryCode.isSuccess) {
    try {
      const response = queryCode.data as FetchCodeResponse
      const { success, data } = response

      responseSchema.parse(response)

      if (success) {
        if (data && email.current)
          code.current = { code: data.code, email: email.current.value  }

        dispatch(openModal("codeVerif"))
        queryClient.resetQueries(queryCodeKey)
      } else {
        databaseError === false && setDatabaseError(true)
      }
    } catch (e) {
      console.error(e);
      return <Error code="502" action="reload">Réessayer</Error>
    }    
  }

  if (queryUser.isSuccess) {
    try {
      const response = queryUser.data as FetchUserResponse
      const { success, data, token } = response

      responseSchema.parse(response)
      
      if (success) {
        storage.set("token", token)
        setUser(data)
        navigate("/home")
        queryClient.resetQueries(queryUserKey)
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
      {(queryCode.isError || queryUser.isError) && <Popup type="offline"/>}
      {modal.codeVerif.isOpen && <CodeVerification data={code.current} onValid={queryUser.refetch} onRetry={queryCode.refetch} onClose={() => dispatch(closeModal("codeVerif"))}/>}
      <div className="signup-first-div">
        <div className="signup-second-div">
          <h1 className="signup-first-h1">Veuillez-vous inscrire !</h1>
          {databaseError && <DbError style={{ width: "650px" }}>Le numéro de téléphone et l'adresse email ne doit pas être déjà utiliser</DbError>}
          <div className="signup-third-div">
            <h1 className="signup-second-h1">Inscription</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="signup-sex-container">
                <div>
                  <input type="radio" name="sex" id="male" value="M" ref={male} defaultChecked={true}/>
                  <label htmlFor="male"> Homme</label>
                </div>
                <div>
                  <input type="radio" name="sex" id="female" value="F" ref={female}/>
                  <label htmlFor="female"> Femme</label>
                </div>
              </div>
              {inputError["sex"] && <div className="flex justify-center">{<InputError>{showError.input.sex}</InputError>}</div>}
              <div className="signup-fourth-div">
                <div className="signup-div-container">
                  <Field inputStyle="signup-field focus:outline-none focus:ring-0 peer" type="text" name="pseudo" ref={pseudo} defaultValue="Thiarson">Pseudo</Field>
                  {inputError["pseudo"]  && <InputError>{showError.input.pseudo}</InputError>}
                  <Field inputStyle="signup-field text-md focus:outline-none focus:ring-0 peer" type="tel" name="phone" defaultValue="0346302300" ref={phone}>Téléphone</Field>
                  {inputError["phone"]  && <InputError>{showError.input.phone}</InputError>}
                  <Field inputStyle="signup-field text-md focus:outline-none focus:ring-0 peer" type="email" name="email" defaultValue="thiarsonantsa@gmail.com" ref={email}>Email</Field>
                  {inputError["email"]  && <InputError>{showError.input.email}</InputError>}
                </div>
                <div className="signup-div-container">
                  <Field inputStyle="signup-field focus:outline-none focus:ring-0 peer" type="date" name="birth" ref={birth} defaultValue="2002-07-08">Date de naissance</Field>
                  {inputError["birth"]  && <InputError>{showError.input.birth}</InputError>}
                  <Field inputStyle="signup-field focus:outline-none focus:ring-0 peer" type="password" name="password" ref={password}>Mot de passe</Field>
                  {inputError["password"]  && <InputError>{showError.input.password}</InputError>}
                  <Field inputStyle="signup-field focus:outline-none focus:ring-0 peer" type="password" name="confirm" ref={confirm}>Confirmation</Field>
                  {inputError["confirm"]  && <InputError>{showError.input.confirm}</InputError>}
                </div>
              </div>
              <button className={`signup-button hover:bg-red-700 transition ${queryCode.isLoading && "signup-disabled-button"} transition`} type="submit">S'inscrire</button>
            </form>
            <p className="signup-paragraph">Vous avez déjà un compte ? <Link className="signup-login-link hover:underline" to='/login'>Veuillez-vous connecter ici !</Link></p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup
