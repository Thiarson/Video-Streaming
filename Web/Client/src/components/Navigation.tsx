import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Home from "./Main/Home"
import VideoPlayer from "./Player/VideoPlayer"
import DirectPlayer from "./Player/DirectPlayer"
import Error from "./assets/Error"

function Navigation() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home/>}/>
        <Route path="watch-video/:videoId" element={<VideoPlayer/>}/>
        <Route path="watch-direct/:directId" element={<DirectPlayer/>}/>
        <Route path="*" element={<Error code={"404"}/>}/>
        <Route path="/" element={<Navigate to="home"/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default Navigation
