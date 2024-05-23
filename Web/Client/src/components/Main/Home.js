import { useNavigate } from "react-router-dom"

import storage from "../utils/local-storage"
import { useClient } from "../utils/context/client"

function Home() {
  const navigate = useNavigate()
  const { setUser } = useClient()

  const signout = () => {
    storage.remove("token")
    setUser(null)
    navigate("/login")
  }

  return (
    <div>
      <h1>Home</h1>
      <button onClick={signout}>Deconnexion</button>
    </div>
  )
}

export default Home
