import { Fragment, Reducer, useEffect, useReducer, type FC } from "react"
import { useSelector } from "react-redux"

import Navbar from "./Navbar"
import UploadVideo from "./UploadVideo"
import SortContent from "./MenuSortContent"
import CreateContent from "./MenuCreateContent"
import Account from "./MenuAccount"
import { MenuProvider } from "../utils/context/menu"
import type { HomeMenu, HomeMenuType } from "../utils/types/data"
import type { RootState } from "../utils/context/store"
import Carousel from "./Carousel"

const menus: HomeMenu = {
  none: Fragment,
  sortContent: SortContent,
  createContent: CreateContent,
  account: Account,
}

const reducer: Reducer<FC, keyof HomeMenuType> = (state, type) => {
  if (menus[type] === state)
    return menus.none

  return menus[type]
}

const Home: FC = () => {
  const modal = useSelector((store: RootState) => store.modal)
  const [ Menu, dispatch ] = useReducer(reducer, Fragment)
  // const showStore = (filter = null, search = '') => {
  //   const list = []

  //   for (const category in directList) {
  //     if(directList[category].length !== 0) {
  //       list.push(<DirectList key={category} data={directList[category]} directPurchased={directPurchased} openInfoModal={openInfoModal} isPurchased={setPurchased} setBuyDirect={setBuyVideo} setDirect={setVideo} search={search}>{filter}</DirectList>)
  //     }
  //   }

  //   for (const category in videoList) {
  //     if(videoList[category].length !== 0) {
  //       list.push(<MovieList key={category} data={videoList[category]} category={category} videoPurchased={videoPurchased} openInfoModal={openInfoModal} isPurchased={setPurchased} setBuyVideo={setBuyVideo} setVideo={setVideo} search={search}>{filter}</MovieList>)
  //     }
  //   }

  //   return list
  // }

  // const showCategory = (filter) => {
  //   const list = []

  //   if(filter === 'Direct') {
  //     for (const category in directList) {
  //       if(directList[category].length !== 0) {
  //         list.push(
  //           <div className="mt-4">
  //             <p className="text-white text-2xl font-semibold font-mono px-12">Direct</p>
  //             <div className="flex flex-wrap items-center px-12 py-4 gap-4 relative transition-all">
  //               {directList[category].map((direct) => (
  //                 !directPurchased[direct.directId] ? <DirectCard key={direct.directId} direct={direct} directPurchased={directPurchased} openInfoModal={openInfoModal} isPurchased={setPurchased} setBuyDirect={setBuyVideo} setDirect={setVideo} reverse={true}/> : null
  //               ))}
  //             </div>
  //           </div>
  //         )
  //       }
  //     }
  //   }
  //   else {
  //     for (const category in videoList) {
  //       let result = null

  //       if(videoList[category].length !== 0 && category === filter) {
  //         result = videoList[category].map((video) => {
  //         const ID = video.videoId !== null ? video.videoId : video.directId

  //         return (
  //           !videoPurchased[ID] ? <MovieCard key={ID} movie={video} category={category} openInfoModal={openInfoModal} videoPurchased={videoPurchased} isPurchased={setPurchased} buyVideo={setBuyVideo} video={setVideo}/> : null
  //         )})

  //         list.push(
  //           <div className="mt-4">
  //             <h1 className="text-white text-2xl font-semibold font-mono pl-12 pr-6">{category}</h1>
  //             <div className="flex flex-wrap px-12 py-4 gap-4 transition-all duration-500 relative">
  //               {result}
  //             </div>
  //           </div>
  //         )
  //       }
  //     }
  //   }

  //   return list
  // }

  useEffect(() => {

  }, [])

  return (
    <MenuProvider value={{ Menu, toggleMenu: dispatch }}>
      {modal.uploadVideo.isOpen && <UploadVideo/>}
      <Navbar/>
      <Carousel/>
    </MenuProvider>
  )

  // return (
  //   <>
  //     <Navbar uploadVideo={setUploadVideo} programDirect={setProgramDirect} setFilter={dispatch} setSearch={setSearch}/>
  //     <UploadVideo visible={uploadVideo} onClose={setUploadVideo} playlists={playlists}/>
  //     <ProgramDirect visible={programDirect} onClose={setProgramDirect}/>
  //     <InfoModal visible={modal} info={infoModal} purchased={purchased} buyVideo={setBuyVideo} video={setVideo} onClose={closeInfoModal} users={users} allPlaylist={allPlaylist}/>
  //     <BuyVideo visible={buyVideo} video={video} onClose={setBuyVideo} isModalOpen={modal} closeInfoModal={closeInfoModal}/>
  //     <Carousel openInfoModal={openInfoModal} isPurchased={setPurchased} buyVideo={setBuyVideo} video={setVideo}/>
  //     {/* <Billboard onOpen={setModal}/> */}
  //     <div className="pb-24">
  //       {show}
  //     </div>
  //   </>
  // )
}

export default Home
