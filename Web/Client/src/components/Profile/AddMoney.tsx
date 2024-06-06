import { useRef, useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import type { ChangeEvent, FC } from "react"

import Field from "../assets/Field"
import Error from "../assets/Error"
import InputError from "../assets/InputError"
import DbError from "../assets/DbError"
import { fetchServer } from "../utils/fetch-server"
import { useDispatch } from "react-redux"
import { closeModal } from "../utils/features/modal"
import { useClient } from "../utils/context/client"
import { formRegex, isFieldNull } from "../utils/form-verif"
import type { DynamicObject } from "../utils/types/object"
import type { Payement } from "../utils/types/data"
import type { FetchUserResponse } from "../utils/types/fetch"

const payments: Payement[]  = [
  "Mvola",
  "Airtel Money",
  "Orange Money",
]

const AddMoney: FC = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { setUser } = useClient()
  const [ paymentError, setPaymentError ] = useState(false)
  const [ phoneError, setPhoneError ] = useState(false)
  const [ amountError, setAmountError ] = useState(false)
  const [ codeError, setCodeError ] = useState(false)
  const [ showError, setShowError ] = useState(false)
  const [ payment, setPayment ] = useState<Payement>("Mvola")
  const phone = useRef<HTMLInputElement>(null)
  const amount = useRef<HTMLInputElement>(null)
  const code = useRef<HTMLInputElement>(null)

  const queryKey = ["add-money"]
  const query = useQuery(queryKey, () => {
    return fetchServer.put("/api/add-money", { body: { amount: amount.current?.value } })
  }, { cacheTime: 0, enabled: false })

  const handleClose = () => {
    setPhoneError(false)
    setAmountError(false)
    setPaymentError(false)
    setCodeError(false)
    setShowError(false)
    dispatch(closeModal("addMoney"))
  }

  const handleOptionSelected = (e: ChangeEvent<HTMLSelectElement>) => {
    payments.forEach((pay) => {
      if (e.target.value === pay) {
        setPayment(e.target.value)
        return
      }
    })
  }

  const handleSubmit = () => {
    let validCategory = false
    let isFormValid = true
    const inputs = isFieldNull({
      phone: phone.current,
      amount: amount.current,
      code: code.current,
    }) as DynamicObject<string, HTMLInputElement>

    if(!formRegex.phone.test(inputs.phone.value)) {
      setPhoneError(true)
      isFormValid = false
    }
    if(!formRegex.price.test(inputs.amount.value)) {
      setAmountError(true)
      isFormValid = false
    }
    if(inputs.code.value !== "0123") {
      setCodeError(true)
      isFormValid = false
    }

    payments.forEach((pay) => {
      if(payment === pay)
        validCategory = true
    })

    if(!validCategory) {
      setPaymentError(true)
      isFormValid = false
    }

    if(!isFormValid)
      return

    setPaymentError(false)
    setPhoneError(false)
    setAmountError(false)
    setCodeError(false)
    
    query.refetch()
  }

  if (query.isError)
    console.error(query.error);

  if (query.isSuccess) {
    try {
      const response = query.data as FetchUserResponse
      const { success, data } = response

      // responseSchema.parse(response)
      
      if (success && data) {
        setUser(data)
        handleClose()
        queryClient.resetQueries(queryKey)
      } else {
        // databaseError === false && setDatabaseError(true)
      }
    } catch (e) {
      console.error(e);
      return <Error code="502" action="reload">Réessayer</Error>
    }    
  }

  return (
    <div className="z-50 transition duration-300 bg-black bg-opacity-60 overflow-x-hidden overflow-y-auto fixed inset-0">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-[440px] text-white bg-zinc-900 px-12 pt-8 rounded-t-md">
          <h1 className="text-3xl mb-4 font-semibold flex justify-center">Dépôt d'argent</h1>
          <hr/>
        </div>
        <div className="max-h-[70%] text-white bg-zinc-900 px-12 pt-6 pb-8 rounded-b-md relative overflow-y-scroll scrollbar-hide">
          <div className="flex flex-col gap-4">
            {showError && <DbError style={{ width: "340px" }}>Compte {payment} invalide !</DbError>}
            <div className="relative">
              <select className="block rounded-md px-6 pt-6 w-full h-14 text-md bg-neutral-700 focus:outline-none focus:ring-0 peer cursor-pointer" name="moyen" id="moyen" value={payment} onChange={handleOptionSelected}>
                {payments.map((payment, index) =>
                  <option key={index} value={payment}>{payment}</option>)}
              </select>
              <label className="absolute text-md text-zinc-400 duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75" htmlFor="category">Moyen</label>
            </div>
            {paymentError && <InputError>Séléctionnez un moyen de payement dans la liste</InputError>}
            <Field type="tel" name="phone" ref={phone} defaultValue="0346302300">Téléphone</Field>
            {phoneError && <InputError>Le numero de téléphone n'est pas valide</InputError>}
            <Field type="text" name="amount" ref={amount} defaultValue="100000">Montant</Field>
            {amountError && <InputError>Veuillez entrer le montant en nombre</InputError>}
            <Field type="password" name="code" ref={code} defaultValue="0123">Code {payment}</Field>
            {codeError && <InputError>Code invalide</InputError>}
            <div className="flex gap-4 w-[344px]">
              <button onClick={handleSubmit} className="bg-red-600 py-3 font-semibold rounded-md w-full mt-5 hover:bg-red-700 transition">Confirmer</button>
              <button onClick={handleClose} className="bg-white text-black py-3 font-semibold rounded-md w-full mt-5 hover:bg-opacity-80 transition">Annuler</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddMoney
