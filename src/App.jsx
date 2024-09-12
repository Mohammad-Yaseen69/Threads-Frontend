import { Container } from "@chakra-ui/react"
import { Outlet, useNavigate } from "react-router-dom"
import { Header, LogoutBtn, CreateButton } from "./components"
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
    <div>
      <Container minH={'100vh'} maxW="620px">

        <Header />
        <CreateButton />

        <Outlet />
      </Container>

    </div>
  )
}

export default App
