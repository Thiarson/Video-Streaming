import { useNavigate } from "react-router-dom"

import storage from "../utils/local-storage"
import { useClient } from "../utils/context/client"

function Home() {
  const navigate = useNavigate()
  const { user, setUser } = useClient()

  const logout = () => {
    storage.remove("token")
    setUser(null)
    navigate("/login")
  }

  return (
    <div>
      <h1>Home</h1>
      <p>Bonjour {user.userPseudo}</p>
      <button onClick={logout}>Deconnexion</button>
    </div>
  )
}

export default Home
