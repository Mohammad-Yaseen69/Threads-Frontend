import React, { useEffect } from 'react'
import {Login , Signup} from "../components"
import {useRecoilState} from "recoil"
import {authScreenAtom} from "../Atoms/authAtom"
import { userAtom } from '../Atoms/user'
import { useNavigate } from 'react-router-dom'

const Auth = () => {
  const [authScreen, setAuthScreen] = useRecoilState(authScreenAtom)
  const [user] = useRecoilState(userAtom)
  const navigate = useNavigate()
 
 
  // return !user ? authScreen === "login" ? <Login setAuthScreen={setAuthScreen}/> : <Signup setAuthScreen={setAuthScreen}/> : navigate("/")
  useEffect(() => {
    if(user) navigate("/")
  }, [user])

  return  authScreen === "login" ? <Login setAuthScreen={setAuthScreen}/> : <Signup setAuthScreen={setAuthScreen}/>
}

export default Auth
