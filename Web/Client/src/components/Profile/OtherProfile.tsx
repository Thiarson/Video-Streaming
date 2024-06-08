import { useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "react-query"
import type { FC } from "react"
import type { UserInfo } from "@prisma/client"

import ProfileNavbar from "./ProfileNavbar"
import ProfileMenu from "./ProfileMenu"
import Error from "../assets/Error"
import { baseURL, fetchServer } from "../utils/fetch-server"
import type { FetchUserResponse } from "../utils/types/fetch"

const OtherProfile: FC = () => {
  const { userId } = useParams()
  const user = useRef<UserInfo>()

  const queryKey = ["other-profile"]
  const query = useQuery(queryKey, () => {
    return fetchServer.get(`/api/other-profile/${userId}`)
  }, { cacheTime: 0, enabled: false })

  useEffect(() => {
    document.body.style.backgroundColor = "white"
    query.refetch()

    return () => { document.body.style.backgroundColor = "rgb(212 212 216)" }
  }, [])

  if (query.isError)
    console.error(query.error);

  if (query.isSuccess) {
    try {
      const response = query.data as FetchUserResponse
      const { success, data } = response

      // responseSchema.parse(response)
      
      if (success && data) {
        user.current = data
      } else {
        // databaseError === false && setDatabaseError(true)
      }
    } catch (e) {
      console.error(e);
      return <Error code="502" action="reload">Réessayer</Error>
    }    
  }


  return (
    <>
      <ProfileNavbar other/>
      {/* <BuyVideo visible={buyVideo} video={video} onClose={setBuyVideo}/> */}
      <div className="h-[89vh] flex">
        <div className="w-1/5 border-r-2 border-zinc-800 flex flex-col">
          <div className="h-[45%] flex flex-col items-center justify-center border-b-2 border-zinc-800">
            <img className="w-28 h-28 rounded-full overflow-hidden mt-6 mb-2 border-2 border-black cursor-pointer" src={baseURL+user.current?.userPhoto} alt="Profil"/>
            <p className="font-semibold text-lg">{user.current?.userPseudo}</p>
            <p className="text-sm text-zinc-500 font-mono text-center p-2">{user.current?.userBio}</p>
          </div>
          <div className="h-[55%] flex flex-col justify-center">
           <ProfileMenu other/>
          </div>
        </div>
        <div className="w-4/5">
          {null}
        </div>
      </div>
    </>
  )
}

export default OtherProfile
