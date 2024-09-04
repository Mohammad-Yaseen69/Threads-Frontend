import { useRecoilState } from 'recoil'
import { Button } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { makeRequest } from '../Utils/api'
import React, { useEffect } from 'react'
import { userAtom } from '../Atoms/user'

const LogoutBtn = () => {

    const [user, setUser] = useRecoilState(userAtom)
    const toast = useToast()


    const logout = async () => {
        const response = await makeRequest('users/logout', {
            method: "GET"
        })

        response.response?.success && toast({
            title: "Success",
            description: res.response.success,
            status: "success",
            duration: 3000,
            isClosable: true,
        })

        setUser(null)
        localStorage.removeItem("user")
    }



    return (
        <Button  _hover={{backgroundColor: "red.500"}} onClick={logout} right={0} top={-1}  backgroundColor={"red.400"}  position={"absolute"} color={'white'}>
            Logout
        </Button>
    )
}

export default LogoutBtn
