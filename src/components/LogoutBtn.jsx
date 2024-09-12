import { useRecoilState } from 'recoil'
import { Button } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { makeRequest } from '../Utils/api'
import React, { useEffect } from 'react'
import { userAtom } from '../Atoms/user'
import { MdOutlineLogout } from "react-icons/md";

const LogoutBtn = () => {

    const [user, setUser] = useRecoilState(userAtom)
    const toast = useToast()


    const logout = async () => {
        const response = await makeRequest('users/logout', {
            method: "GET"
        })

        response.response?.success && toast({
            title: "Success",
            description: response.response.success,
            status: "success",
            duration: 3000,
            isClosable: true,
        })

        setUser(null)
        localStorage.removeItem("user")
    }



    return (
        <Button  _hover={{backgroundColor: "red.500"}} p={0} onClick={logout}  color={'white'}>
           <MdOutlineLogout fontSize={20} fontWeight={900} />
        </Button>
    )
}

export default LogoutBtn
