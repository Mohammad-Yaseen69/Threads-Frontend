import { Box, Container } from "@chakra-ui/react"
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
    <Box   style={{
      position: "relative",
      width: '100%'
    }}>
      <Container minH={'100vh'} maxW="650px">

        <Header />
        <CreateButton />

        <Outlet />
      </Container>
    </Box>
  )
}

export default App
