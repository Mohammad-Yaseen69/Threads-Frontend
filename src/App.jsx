import { Button } from "@chakra-ui/button"
import { Container } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import {Header} from "./components"

function App() {

  return (
    <Container maxW="620px">

      <Header />
       <Outlet />
    </Container>
  )
}

export default App
