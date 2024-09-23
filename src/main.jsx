import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react"
import { mode } from "@chakra-ui/theme-tools"
import { BrowserRouter, createRoutesFromElements, createBrowserRouter, Route, RouterProvider, Navigate } from "react-router-dom"
import './index.css'
import { PostPage, UserPage, Auth, UpdateInfo, Home, Chat } from './Pages'
import { RecoilRoot } from "recoil"
import { SocketContextProvider } from "./context/socketContext.jsx"


const styles = {
  global: (props) => ({
    body: {
      color: mode('gray.800', ' whiteAlpha.900')(props),
      bg: mode('gray.100', '#101010')(props)
    }
  })
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true
}

const colors = {
  gray: {
    light: '#616161',
    dark: '#1e1e1e'
  }
}

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<Home />} />
      <Route path='/profile/:userName' element={<UserPage />} />
      <Route path='/post/:postId' element={<PostPage />} />
      <Route path='/auth' element={<Auth />} />
      <Route path='/updateProfile' element={<UpdateInfo />} />
      <Route path='/chat/:chatId' element={<Chat />} />
    </Route>
  )
)


const theme = extendTheme({ styles, config, colors })

createRoot(document.getElementById('root')).render(
  <RecoilRoot>
    <ChakraProvider theme={theme}>
      <SocketContextProvider>
        <RouterProvider router={routes}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </RouterProvider>
      </SocketContextProvider>
    </ChakraProvider>
  </RecoilRoot>
)