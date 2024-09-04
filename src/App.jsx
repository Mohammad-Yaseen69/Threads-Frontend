import { Container } from "@chakra-ui/react"
import { Outlet, useNavigate } from "react-router-dom"
import { Header, LogoutBtn } from "./components"
import { useRecoilState } from "recoil"
import { userAtom } from "./Atoms/user"
import { makeRequest } from "./Utils/api"
import { useEffect } from "react"

function App() {
  const [user, setUser] = useRecoilState(userAtom)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate("/auth")
  }, [user])


  return (
    <Container maxW="620px">

      <Header />

      <Outlet />
    </Container>
  )
}

export default App
