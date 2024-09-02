import React from 'react'
import {Login , Signup} from "../components"
import {useRecoilState} from "recoil"
import {authScreenAtom} from "../Atoms/authAtom"

const Auth = () => {
  const [authScreen, setAuthScreen] = useRecoilState(authScreenAtom)

  console.log(authScreen)
  return (
    <div>

      {authScreen === "login" ? <Login setAuthScreen={setAuthScreen}/> : <Signup setAuthScreen={setAuthScreen}/>}
      {/* <Login setAuthScreen={setAuthScreen}/>
      <Signup setAuthScreen={setAuthScreen}/> */}
    </div>
  )
}

export default Auth
