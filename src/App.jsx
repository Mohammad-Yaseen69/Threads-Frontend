import { Button } from "@chakra-ui/button"
import { Container } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"

function App() {

  return (
    <Container maxW="620px">
       <Button>Nigga</Button>
       <Outlet />
    </Container>
  )
}

export default App
