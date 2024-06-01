import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Home from "./Main/Home"
import MediaPlayer from "./Player/MediaPlayer"
import Error from "./assets/Error"

function Navigation() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home/>}/>
        <Route path="watch/:videoId" element={<MediaPlayer/>}/>
        <Route path="*" element={<Error code={"404"}/>}/>
        <Route path="/" element={<Navigate to="home"/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default Navigation
