import { useRef } from "react"
import { useQuery, useQueryClient } from "react-query"
import { useDispatch } from "react-redux"
import type { FC } from "react"

import Field from "../assets/Field"
import Error from "../assets/Error"
import InputError from "../assets/InputError"
import { inputCheck, isFieldNull, showError } from "../utils/form-verif"
import { useError } from "../utils/hooks/useError"
import { fetchServer } from "../utils/fetch-server"
import { closeModal } from "../utils/features/modal"
import type { DynamicObject } from "../utils/types/object"
import type { FetchVideoResponse } from "../utils/types/fetch"

const CreatePlaylist: FC = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const title = useRef<HTMLInputElement>(null)
  const description = useRef<HTMLTextAreaElement>(null)
  const { inputError, setInputError, resetInputError } = useError([ "title", "description" ])

  const queryKey = ["create-playlist"]
  const query = useQuery(queryKey, () => {
    return fetchServer.post("/api/create-playlist", {
      body: { title: title.current?.value, description: description.current?.value }
    })
  }, { cacheTime: 0, enabled: false })

  const handleClose = () => {
    resetInputError()
    dispatch(closeModal("createPlaylist"))
  }

  const handleSubmit = () => {
    let isFormValid = true
    const inputs = isFieldNull({
      title: title.current,
      description: description.current,
    }) as DynamicObject<string, HTMLInputElement>

    for (const input in inputs) {
      const inputValid = inputCheck[input](inputs[input])
      isFormValid = isFormValid && inputValid

      if(!inputValid)
        setInputError(input, true)
      else
        setInputError(input, false)
    }

    if(!isFormValid)
      return

    query.refetch()
  }

  if (query.isError)
    console.error(query.error);

  if (query.isSuccess) {
    try {
      const response = query.data as FetchVideoResponse

      // responseSchema.parse(response)
      
      if (response.success) {
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
          <h1 className="text-3xl mb-4 font-semibold flex justify-center">Créer un playlist</h1>
          <hr/>
        </div>
        <div className="max-h-[70%] w-[440px] text-white bg-zinc-900 px-12 pt-6 pb-8 rounded-b-md relative overflow-y-scroll scrollbar-hide">
          <div className="flex flex-col gap-4">
            <Field type="text" name="title" ref={title} defaultValue="Playlist">Titre</Field>
            {inputError["title"] && <InputError>{showError.input.title}</InputError>}
            <div className="relative">
              <textarea className="block rounded-md px-6 pt-6 w-full h-24 text-md bg-neutral-700 focus:outline-none focus:ring-0 peer scrollbar-hide" placeholder=" " name="description" id="description" cols={25} rows={2} defaultValue="Description de la playlist !!!" ref={description}></textarea>
              <label className="absolute text-md text-zinc-400 duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75" htmlFor="description">Description</label>
            </div>
            {inputError["description"] && <InputError>{showError.input.description}</InputError>}
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

export default CreatePlaylist
