import { FormEvent, useRef } from "react"
import { useDispatch } from "react-redux"
import { AiOutlineClose } from "react-icons/ai"

import Field from "../assets/Field"
import InputError from "../assets/InputError"
import { inputCheck, isFieldNull, showError } from "../utils/form-verif"
import { directSpec, videoSpec } from "../utils/media-spec"
import { useError } from "../utils/hooks/useError"
import { closeModal } from "../utils/features/modal"
import { useClient } from "../utils/context/client"
import type { DynamicObject } from "../utils/types/object"

function UploadVideo() {
  const dispatch = useDispatch()
  const playlist = useRef<HTMLSelectElement>(null)
  const category = useRef<HTMLSelectElement>(null)
  const duration = useRef<HTMLSelectElement>(null)
  const video = useRef<HTMLInputElement>(null)
  const title = useRef<HTMLInputElement>(null)
  const price = useRef<HTMLInputElement>(null)
  const description = useRef<HTMLTextAreaElement>(null)
  const { user } = useClient()
  const { inputError, setInputError, resetInputError } = useError([ "playlist", "title", "description", "video", "price", "category", "duration" ])

  const handleClose = () => {
    resetInputError()
    dispatch(closeModal("uploadVideo"))
  }

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault()

    let isFormValid = true
    let validCategory = false
    let validDuration = false 
    let validPlaylist = false

    const inputs = isFieldNull({
      title: title.current,
      description: description.current,
      video: video.current,
      price: price.current,
    }) as DynamicObject<string, HTMLInputElement>

    const selects = isFieldNull({
      category: category.current,
      duration: duration.current,
      playlist: playlist.current,
    }) as DynamicObject<string, HTMLSelectElement>

    for (const input in inputs) {
      const inputValid = inputCheck[input](inputs[input])
      isFormValid = isFormValid && inputValid

      if (!inputValid)
        setInputError(input, true)
      else
        setInputError(input, false)
    }

    videoSpec.categories.forEach((categ) => {
      if (selects.category.value === categ) {
        validCategory = true
        return
      }
    })

    if (!validCategory) {
      setInputError("category", true)
      isFormValid = false
    } else {
      setInputError("category", false)
    }

    directSpec.durations.forEach((dur) => {
      if (selects.duration.value === dur.value) {
        validDuration = true
        return
      }
    })
    
    if (!validDuration) {
      setInputError("duration", true)
      isFormValid = false
    } else {
      setInputError("duration", false)
    }

    if (selects.playlist.value === "") {
      validPlaylist = true
    } else {
      // playlists.forEach((element) => {
      //   if(selects.playlist.value === element.playlist_id) {
      //     validPlaylist = true
      //     return
      //   }  
      // })
    }

    if (!validPlaylist) {
      setInputError("playlist", true)
      isFormValid = false
    } else {
      setInputError("playlist", false)
    }

    if (!isFormValid)
      return

    if (!user)
      throw new Error("User must not be null")
    if (!inputs.video.files)
      throw new Error("Video files must not be null")

    const formData = new FormData()

    formData.append('playlist', selects.playlist.value)
    formData.append('title', inputs.title.value)
    formData.append('description', inputs.description.value)
    formData.append('category', selects.category.value)
    formData.append('duration', selects.duration.value)
    formData.append('price', inputs.price.value)
    formData.append('video', inputs.video.files[0])
    formData.append('userID', user.userId)
    
  //   fetch(serverUrl, {
  //     method: 'POST',
  //     header: {
  //       "Accept": "application/json",
  //     },
  //     body: formData,
  //   })
  //     .then((response) => {
  //       if(response.ok)
  //         return response.json()
  //     })
  //     .then(({ uploaded }) => {
  //       if(uploaded) {
  //         handleClose()
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('UPLOAD: ERROR');
  //       console.error(error);
  //     })
  }

  return (
    <div className="text-white z-50 transition duration-300 bg-zinc-700 bg-opacity-80 overflow-x-hidden overflow-y-auto fixed inset-0">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-[440px] bg-zinc-900 px-12 pt-8 rounded-t-md relative">
          <div className="cursor-pointer absolute top-3 right-3 h-8 w-8 rounded-full bg-black bg-opacity-70 flex items-center justify-center" onClick={handleClose}>
            <AiOutlineClose className="text-white" size={20}/>
          </div>
          <h1 className="text-3xl mb-4 font-semibold">Ajout de vidéo</h1>
          <hr/>
        </div>
        <div className="h-[70%] bg-zinc-900 px-12 pt-6 pb-8 rounded-b-md relative overflow-y-scroll scrollbar-hide">
          <form className="flex flex-col gap-4" onSubmit={handleUpload}>
            <div className="relative">
              <select className="block rounded-md px-6 pt-6 w-full h-14 text-md bg-neutral-700 focus:outline-none focus:ring-0 peer cursor-pointer" name="playlist" id="playlist" ref={playlist}>
                <option value="">Aucune</option>
                {/* {playlists.map((playlist) => <option key={playlist.playlist_id} value={playlist.playlist_id}>{playlist.playlist_title}</option>)} */}
              </select>
              <label className="absolute text-md text-zinc-400 duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75" htmlFor="playlist">Playlist</label>
            </div>
            {inputError["playlist"] && <InputError>{showError.input.playlist}</InputError>}
            <Field type="text" name="title" defaultValue="Titre" ref={title}>Titre</Field>
            {inputError["title"] && <InputError>{showError.input.title}</InputError>}
            <div className="relative">
              <textarea className="block rounded-md px-6 pt-6 w-full h-24 text-md bg-neutral-700 focus:outline-none focus:ring-0 peer scrollbar-hide" placeholder=" " name="description" id="description" cols={25} rows={2} defaultValue="Description de la vidéo !!!" ref={description}></textarea>
              <label className="absolute text-md text-zinc-400 duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75" htmlFor="description">Description</label>
            </div>
            {inputError["description"] && <InputError>{showError.input.description}</InputError>}
            <div className="relative">
              <select className="block rounded-md px-6 pt-6 w-full h-14 text-md bg-neutral-700 focus:outline-none focus:ring-0 peer cursor-pointer" name="category" id="category" ref={category}>
                {videoSpec.categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              <label className="absolute text-md text-zinc-400 duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75" htmlFor="category">Catégorie</label>
            </div>
            {inputError["category"] && <InputError>{showError.input.category}</InputError>}
            <div className="relative">
              <select className="block rounded-md px-6 pt-6 w-full h-14 text-md bg-neutral-700 focus:outline-none focus:ring-0 peer cursor-pointer" name="duration" id="duration" ref={duration}>
                {directSpec.durations.map((duration) => <option key={duration.time} value={duration.value}>{duration.time}</option>)}
              </select>
              <label className="absolute text-md text-zinc-400 duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75" htmlFor="duration">Durée</label>
            </div>
            {inputError["duration"] && <InputError>{showError.input.duration}</InputError>}
            <Field type="text" name="price" defaultValue="0" ref={price}>Prix</Field>
            {inputError["price"] && <InputError>{showError.input.price}</InputError>}
            <div>
              <input className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-700 file:text-white hover:file:bg-neutral-600 file:cursor-pointer" type="file" accept="video/*" name="file" id="file" ref={video}/>
            </div>
            {inputError["video"] && <InputError>{showError.input.video}</InputError>}
            <button className="bg-red-600 py-3 font-semibold rounded-md w-full mt-5 hover:bg-red-700 transition">Envoyer</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UploadVideo
