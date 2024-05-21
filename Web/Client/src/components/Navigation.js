import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Home from './Main/Home'
import Error from './assets/Error'

function Navigation() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/home' element={<Home/>}/>
        <Route path='error' element={<Error/>}/>
        <Route path='/' element={<Navigate to='home'/>}/>
        <Route path='*' element={<Navigate to='error'/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default Navigation
