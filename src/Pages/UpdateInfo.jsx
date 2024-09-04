import React, { useEffect } from 'react'
import { UpdateDetails } from "../components"
import { useRecoilState } from "recoil"
import { userAtom } from "../Atoms/user"
import { useNavigate } from "react-router-dom"

const UpdateInfo = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const navigate = useNavigate()

    console.log(user)
    useEffect(() => {
        if (!user) {
            console.log("df")
            navigate("/auth")
        }
    }, [])
    return (
        <div style={{width: '100%'}}>
            <UpdateDetails />
        </div>
    )
}

export default UpdateInfo
