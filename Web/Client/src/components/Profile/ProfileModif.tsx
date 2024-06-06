import { useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { VscError } from "react-icons/vsc"
import type { FC } from "react"

import Field from "../assets/Field"
import { useClient } from "../utils/context/client"
import { closeModal } from "../utils/features/modal"
import { baseURL, fetchPromise, fetchServer } from "../utils/fetch-server"
import { formRegex, isFieldNull } from "../utils/form-verif"
import type { FetchUserResponse } from "../utils/types/fetch"
import type { DynamicObject } from "../utils/types/object"

const ProfileModif: FC = () => {
  const dispatch = useDispatch()
  const pseudo = useRef(null)
  const bio = useRef(null)
  const image = useRef(null)
  const { user, setUser } = useClient()
  const [ photo, setPhoto ] = useState(user?.userPhoto)
  const [ pseudoError, setPseudoError ] = useState(false)
  const [ bioError, setBioError ] = useState(false)

  if (!user)
    throw new Error("User is undefined")

  const handleClose = () => {
    setPhoto(user?.userPhoto)
    setPseudoError(false)
    setBioError(false)
    dispatch(closeModal("profileModif"))
  }

  const handleChangePhoto = async () => {
    const input = isFieldNull({ image: image.current }) as DynamicObject<string, HTMLInputElement>

    if (!input.image.files)
      throw new Error("Image files must not be null")

    const formData = new FormData()

    formData.append('image', input.image.files[0])
    formData.append('userId', user?.userId)

    const response = await fetchPromise("/api/change-photo", {
      method: "PUT",
      headers: { "Accept": "application/json; charset=UTF-8" },
    }, formData)
    
    const { success, data: photo } = response as { success: boolean, data: string }

    if (success)
      setPhoto(photo)
  }

  const handleSubmit = async () => {
    const inputs = isFieldNull({
      pseudo: pseudo.current,
      bio: bio.current,
    }) as DynamicObject<string, HTMLInputElement>

    if(!formRegex.pseudo.test(inputs.pseudo.value)) {
      setPseudoError(true)
      return
    }
    if(inputs.bio.value.length < 10 || inputs.bio.value.length > 50) {
      setBioError(true)
      return
    }

    const response = await fetchServer.put("/api/profile-modif", {
      body: {
        photo: photo,
        pseudo: inputs.pseudo.value,
        bio: inputs.bio.value,
      }
    })
    
    const { success, data } = response as FetchUserResponse

    if (success) {
      setUser(data)
      handleClose()
    }
  }
  
  return (
    <div className="z-50 transition duration-300 bg-black bg-opacity-60 overflow-x-hidden overflow-y-auto fixed inset-0">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-[440px] text-white bg-zinc-900 px-12 pt-8 rounded-t-md">
          <h1 className="text-3xl mb-4 font-semibold flex justify-center">Modification du profil</h1>
          <hr/>
        </div>
        <div className=" bg-zinc-900 w-[440px] text-white px-12 pt-6 pb-8 rounded-b-md relative overflow-y-scroll scrollbar-hide">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2">
              <img className="w-28 h-28 rounded-full" src={baseURL+photo} alt="Profil"/>
              <label className="text-sm text-zinc-400 hover:opacity-70 font-semibold cursor-pointer" htmlFor="image">Importer une photo</label>
              <input style={{ display: 'none' }} type="file" accept="image/*" name="image" id="image" onChange={handleChangePhoto} ref={image}/>
            </div>
            <Field type="text" name="pseudo" defaultValue={user?.userPseudo} ref={pseudo}>Pseudo</Field>
            {pseudoError === false ? null : <div className="flex gap-2 items-center text-red-600 h-1 mb-2 text-sm">
              <VscError size={20}/>
              <p>Pseudo doit être compris entre 4 et 10 caractères</p>
            </div>}
            <Field type="text" name="bio" defaultValue={user?.userBio ?? "Bio..."} ref={bio}>Bio</Field>
            {bioError === false ? null : <div className="flex gap-2 items-center text-red-600 h-1 mb-2 text-sm">
              <VscError size={20}/>
              <p>Bio doit être compris entre 10 et 50 caractères</p>
            </div>}
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

export default ProfileModif
