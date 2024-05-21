import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './Auth/Login'
import Signup from './Auth/Signup'
import ForgetPassword from './Auth/ForgetPassword'
import Error from './assets/Error'

function Authentication() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='login' element={<Login/>}/>
        <Route path='signup' element={<Signup/>}/>
        <Route path='forget-password' element={<ForgetPassword/>}/>
        <Route path='error' element={<Error/>}/>
        <Route path='/' element={<Navigate to='login'/>}/>
        <Route path='*' element={<Navigate to='error'/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default Authentication
