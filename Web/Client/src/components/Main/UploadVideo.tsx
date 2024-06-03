import { FormEvent, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { useQuery } from "react-query"
import { AiOutlineClose } from "react-icons/ai"

import Field from "../assets/Field"
import Popup from "../assets/Popup"
import Spinner from "../assets/Spinner"
import InputError from "../assets/InputError"
import Invalid from "../assets/Error"
import { inputCheck, isFieldNull, showError } from "../utils/form-verif"
import { directSpec, videoSpec } from "../utils/media-spec"
import { useError } from "../utils/hooks/useError"
import { closeModal } from "../utils/features/modal"
import { useClient } from "../utils/context/client"
import { useInfo } from "../utils/context/info"
import { fetchPromise } from "../utils/fetch-server"
import type { FetchVoidResponse } from "../utils/types/fetch"
import type { DynamicObject } from "../utils/types/object"

import "../styles/Main/UploadVideo.css"

function UploadVideo() {
  const dispatch = useDispatch()
  const playlist = useRef<HTMLSelectElement>(null)
  const category = useRef<HTMLSelectElement>(null)
  const duration = useRef<HTMLSelectElement>(null)
  const video = useRef<HTMLInputElement>(null)
  const title = useRef<HTMLInputElement>(null)
  const price = useRef<HTMLInputElement>(null)
  const description = useRef<HTMLTextAreaElement>(null)
  const formData = useRef<FormData>(new FormData())
  const timeout = useRef<NodeJS.Timeout>()
  const { user } = useClient()
  const { myPlaylists } = useInfo()
  const [ status, setStatus ] = useState<"idle" | "success" | "error">("idle")
  const { inputError, setInputError, resetInputError } = useError([ "playlist", "title", "description", "video", "price", "category", "duration" ])

  const queryKey = ["upload-video"]
  const query = useQuery(queryKey, () => {
    return fetchPromise("/api/upload-video", {
      method: "POST",
      headers: { "Accept": "application/json; charset=UTF-8" },
    }, formData.current)
  }, { cacheTime: 0, enabled: false })

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
      myPlaylists.forEach((playlist) => {
        if(selects.playlist.value === playlist.playlistId) {
          validPlaylist = true
          return
        }  
      })
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

    const form = new FormData()

    form.append('playlist', selects.playlist.value)
    form.append('title', inputs.title.value)
    form.append('description', inputs.description.value)
    form.append('category', selects.category.value)
    form.append('duration', selects.duration.value)
    form.append('price', inputs.price.value)
    form.append('video', inputs.video.files[0])
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
            dispatch(closeModal("uploadVideo"))
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
      {status === "error" && <Popup type="offline">L'envoi de la vidéo a échoué</Popup>}
      {status === "success" && <Popup type="success">La vidéo a été envoyée avec succès</Popup>}
      <div className="upload-video-first-container transition">
        <div className="upload-video-second-container">
          <div className="upload-video-first-box">
            <div className="upload-video-close" onClick={handleClose}>
              <AiOutlineClose style={{ color: "white" }} size={20}/>
            </div>
            <h1 className="upload-video-title">Ajout de vidéo</h1>
            <hr/>
          </div>
          <div className="upload-video-second-box scrollbar-hide">
            <form className="upload-video-form" onSubmit={handleUpload}>
              <div style={{ position: "relative" }}>
                <select className="upload-video-playlist-option focus:outline-none focus:ring-0 peer" name="playlist" id="playlist" ref={playlist}>
                  <option value="">Aucune</option>
                  {myPlaylists.map((playlist) => <option key={playlist.playlistId} value={playlist.playlistId}>{playlist.playlistTitle}</option>)}
                </select>
                <label className="upload-video-playlist-label -translate-y-3 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75" htmlFor="playlist">Playlist</label>
              </div>
              {inputError["playlist"] && <InputError>{showError.input.playlist}</InputError>}
              <Field type="text" name="title" defaultValue="Titre" ref={title}>Titre</Field>
              {inputError["title"] && <InputError>{showError.input.title}</InputError>}
              <div style={{ position: "relative" }}>
                <textarea className="upload-video-description focus:outline-none focus:ring-0 peer scrollbar-hide" placeholder=" " name="description" id="description" cols={25} rows={2} defaultValue="Description de la vidéo !!!" ref={description}></textarea>
                <label className="upload-video-description-label transform -translate-y-3 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75" htmlFor="description">Description</label>
              </div>
              {inputError["description"] && <InputError>{showError.input.description}</InputError>}
              <div style={{ position: "relative" }}>
                <select className="upload-video-category-select focus:outline-none focus:ring-0 peer" name="category" id="category" ref={category}>
                  {videoSpec.categories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
                <label className="upload-video-category-label transform -translate-y-3 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75" htmlFor="category">Catégorie</label>
              </div>
              {inputError["category"] && <InputError>{showError.input.category}</InputError>}
              <div style={{ position: "relative" }}>
                <select className="upload-video-duration-select focus:outline-none focus:ring-0 peer" name="duration" id="duration" ref={duration}>
                  {directSpec.durations.map((duration) => <option key={duration.time} value={duration.value}>{duration.time}</option>)}
                </select>
                <label className="upload-video-duration-label transform -translate-y-3 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75" htmlFor="duration">Durée</label>
              </div>
              {inputError["duration"] && <InputError>{showError.input.duration}</InputError>}
              <Field type="text" name="price" defaultValue="0" ref={price}>Prix</Field>
              {inputError["price"] && <InputError>{showError.input.price}</InputError>}
              <div>
                <input className="upload-video-file file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-700 file:text-white hover:file:bg-neutral-600 file:cursor-pointer" type="file" accept="video/*" name="file" id="file" ref={video}/>
              </div>
              {inputError["video"] && <InputError>{showError.input.video}</InputError>}
              <button className={`upload-video-button flex justify-center hover:bg-red-700 ${query.isLoading && "upload-video-disabled-button"} transition`}>
                {query.isLoading ? <Spinner onButton/> : "Envoyer"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default UploadVideo
