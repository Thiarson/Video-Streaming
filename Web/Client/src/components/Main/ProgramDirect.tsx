import { useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { useQuery } from "react-query"
import { AiOutlineClose } from "react-icons/ai"
import type { FC, FormEvent } from "react"

import Field from "../assets/Field"
import Popup from "../assets/Popup"
import InputError from "../assets/InputError"
import Invalid from "../assets/Error"
import { directSpec } from "../utils/helpers/media-spec"
import { useError } from "../utils/hooks/useError"
import { closeModal } from "../utils/features/modal"
import { useClient } from "../utils/context/client"
import { fetchPromise } from "../utils/fetch-server"
import { showError, inputCheck, isFieldNull } from "../utils/form-verif"
import type { DynamicObject } from "../utils/types/object"
import type { FetchVoidResponse } from "../utils/types/fetch"
import Spinner from "../assets/Spinner"

const now = new Date()
let month = (now.getMonth() + 1).toString()
let date = (now.getDate() + 2).toString()

month = month > '9' ? month : '0' + month
date = date > '9' ? date : '0' + date

const start = `${now.getFullYear()}-${month}-${date}`

const ProgramDirect: FC = () => {
  const dispatch = useDispatch()
  const description = useRef<HTMLTextAreaElement>(null)
  const duration = useRef<HTMLSelectElement>(null)
  const title = useRef<HTMLInputElement>(null)
  const date = useRef<HTMLInputElement>(null)
  const time = useRef<HTMLInputElement>(null)
  const price = useRef<HTMLInputElement>(null)
  const image = useRef<HTMLInputElement>(null)
  const formData = useRef<FormData>(new FormData())
  const timeout = useRef<NodeJS.Timeout>()
  const { user } = useClient()
  const [ status, setStatus ] = useState<"idle" | "success" | "error">("idle")
  const { inputError, setInputError, resetInputError } = useError([ "title", "description", "date", "time", "duration", "price", "image" ])

  const queryKey = ["program-direct"]
  const query = useQuery(queryKey, () => {
    return fetchPromise("/api/program-direct", {
      method: "POST",
      headers: { "Accept": "application/json; charset=UTF-8" },
    }, formData.current)
  }, { cacheTime: 0, enabled: false })

  const handleClose = () => {
    resetInputError()
    dispatch(closeModal("programDirect"))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    let isFormValid = true
    let validDuration = false 

    const inputs = isFieldNull({
      title: title.current,
      description: description.current,
      date: date.current,
      time: time.current,
      price: price.current,
      image: image.current,
    }) as DynamicObject<string, HTMLInputElement>

    const select = isFieldNull({
      duration: duration.current,
    }) as DynamicObject<string, HTMLSelectElement>

    for (const input in inputs) {
      const inputValid = inputCheck[input](inputs[input])
      isFormValid = isFormValid && inputValid

      if(!inputValid)
        setInputError(input, true)
      else
        setInputError(input, false)
    }

    directSpec.durations.forEach((element) => {
      if(select.duration.value === element.value)
        validDuration = true
    })
    
    if(!validDuration) {
      setInputError("duration", true)
      isFormValid = false
    } else {
      setInputError("duration", false)
    }

    if(!isFormValid)
      return

    if (!user)
      throw new Error("User must not be null")
    if (!inputs.image.files)
      throw new Error("Video files must not be null")

    const form = new FormData()

    form.append('title', inputs.title.value)
    form.append('description', inputs.description.value)
    form.append('date', inputs.date.value)
    form.append('time', inputs.time.value)
    form.append('duration', select.duration.value)
    form.append('price', inputs.price.value)
    form.append('image', inputs.image.files[0])
    form.append('userId', user.userId)

    formData.current = form
    query.refetch()
  }

  if (query.isError)
    console.error(query.error);

  if (query.isSuccess) {
    try {
      const response = query.data as FetchVoidResponse

      // responseSchema.parse(response)
      
      if (response.success) {
        status !== "success" && setStatus("success")
        if (timeout.current === undefined) {
          timeout.current = setTimeout(() => {
            dispatch(closeModal("programDirect"))
            window.location.reload()
          }, 3000);
        }
      } else {
        status!== "error" && setStatus("error")
      }
    } catch (e) {
      console.error(e);
      return <Invalid code="502" action="reload">Réessayer</Invalid>
    }    
  } 

  return (
    <>
      {query.isError && <Popup type="offline"/>}
      {status === "error" && <Popup type="offline">La requête de diffusion a échoué</Popup>}
      {status === "success" && <Popup type="success">La requête a été envoyée avec succès</Popup>}
      <div className="z-50 transition duration-300 bg-black bg-opacity-60 overflow-x-hidden overflow-y-auto fixed inset-0 scrollbar-hide">
        <div className="w-full h-full flex flex-col justify-center items-center text-white">
          <div className="w-[440px] px-12 pt-8 rounded-t-md bg-zinc-900 relative">
            <div className="cursor-pointer absolute top-3 right-3 h-8 w-8 rounded-full bg-black bg-opacity-70 flex items-center justify-center" onClick={handleClose}>
              <AiOutlineClose className="text-white" size={20}/>
            </div>
            <h1 className="text-3xl mb-4 font-semibold">Programmer un direct</h1>
            <hr/>
          </div>
          <div className="h-[70%] bg-zinc-900 px-12 pt-6 pb-8 rounded-b-md relative overflow-y-scroll scrollbar-hide">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Field type="text" name="title" defaultValue="Titre" ref={title}>Titre</Field>
              {inputError["title"] && <InputError>{showError.input.title}</InputError>}
              <div className="relative">
                <textarea className="block rounded-md px-6 pt-6 w-full h-24 text-md bg-neutral-700 focus:outline-none focus:ring-0 peer scrollbar-hide" placeholder=" " name="description" id="description" cols={25} rows={2} defaultValue="Description du direct !!!" ref={description}></textarea>
                <label className="absolute text-md text-zinc-400 duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75" htmlFor="description">Description</label>
              </div>
              {inputError["description"] && <InputError>{showError.input.description}</InputError>}
              <Field type="date" name="date" ref={date} defaultValue={start}>Date</Field>
              {inputError["date"] && <InputError>Séléctionnez une date à partir du {start}</InputError>}
              <Field type="time" name="time" ref={time} defaultValue={"08:00"}>Heure</Field>
              {inputError["time"] && <InputError>{showError.input.time}</InputError>}
              <div className="relative">
                <select className="block rounded-md px-6 pt-6 w-full h-14 text-md bg-neutral-700 focus:outline-none focus:ring-0 peer cursor-pointer" name="duration" id="duration" ref={duration}>
                  {directSpec.durations.map((duration) => <option key={duration.time} value={duration.value}>{duration.time} </option>)}
                </select>
                <label className="absolute text-md text-zinc-400 duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75" htmlFor="duration">Durée</label>
              </div>
              {inputError["duration"] && <InputError>{showError.input.duration}</InputError>}
              <Field type="text" name="price" defaultValue="0" ref={price}>Prix</Field>
              {inputError["price"] && <InputError>{showError.input.price}</InputError>}
              <div>
                <input className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-700 file:text-white hover:file:bg-neutral-600 file:cursor-pointer" type="file" accept="image/*" name="image" id="image" ref={image}/>
              </div>
              {inputError["image"] && <InputError>{showError.input.image}</InputError>}
              <button className={`bg-red-600 py-3 flex justify-center font-semibold rounded-md w-full mt-5 ${query.isLoading && "program-direct-disabled-button"} hover:bg-red-700 transition`}>
                {query.isLoading ? <Spinner onButton/> : "Programmer"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProgramDirect
