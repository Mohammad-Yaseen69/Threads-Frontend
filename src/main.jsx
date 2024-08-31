import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react"
import { mode } from "@chakra-ui/theme-tools"
import { BrowserRouter, createRoutesFromElements, createBrowserRouter, Route, RouterProvider } from "react-router-dom"
import './index.css'
import { PostPage, UserPage, Auth } from './Pages'
import { RecoilRoot } from "recoil"

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
      <Route path='/:userId' element={<UserPage />} />
      <Route path='/:userId/post/:pId' element={<PostPage />} />
      <Route path='/auth' element={<Auth />} />
    </Route>
  )
)


const theme = extendTheme({ styles, config, colors })

createRoot(document.getElementById('root')).render(
  <RecoilRoot>
    <ChakraProvider theme={theme}>
      <RouterProvider router={routes}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </RouterProvider>
    </ChakraProvider >
  </RecoilRoot>
)