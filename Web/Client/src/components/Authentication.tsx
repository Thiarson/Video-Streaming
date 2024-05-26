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
        <Route path='*' element={<Error code={"404"}/>}/>
        <Route path='/' element={<Navigate to='login'/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default Authentication
