import { Button, Flex, Image, useColorMode } from '@chakra-ui/react'
import React from 'react'
import LogoutBtn from './LogoutBtn'
import { useRecoilState } from 'recoil'
import { userAtom } from '../Atoms/user'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    const [user, setUser] = useRecoilState(userAtom)
    const navigate = useNavigate()

    return (
        <Flex position={"relative"} justifyContent={'center'} alignItems={"center"} mt={6} mb={12}>
            {/* <span></span> */}
            <Image
                src={colorMode === "light" ? "/dark-logo.svg" : "/light-logo.svg"}
                w={6}
                justifySelf={'center'}
                alt='logo'
                onClick={toggleColorMode}
                cursor={"pointer"}
            />

            {user && <LogoutBtn />}
        </Flex>
    )
}

export default Header
