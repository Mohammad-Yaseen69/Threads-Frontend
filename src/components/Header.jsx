import { Button, Flex, Image, useColorMode } from '@chakra-ui/react'
import React from 'react'
import LogoutBtn from './LogoutBtn'
import { useRecoilState } from 'recoil'
import { userAtom } from '../Atoms/user'
import { useNavigate } from 'react-router-dom'
import { IoHome } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    const [user, setUser] = useRecoilState(userAtom)
    const navigate = useNavigate()

    return (
        <Flex position={"relative"} justifyContent={user ? 'space-between' : 'center'} alignItems={"center"} mt={6} mb={12}>
            {user && <IoHome onClick={() => navigate("/")} cursor={'pointer'} fontSize={30} color={colorMode == "dark" ? "white" : "black"} />}
            <Image
                src={colorMode === "light" ? "/dark-logo.svg" : "/light-logo.svg"}
                w={6}
                justifySelf={'center'}
                alt='logo'
                onClick={toggleColorMode}
                cursor={"pointer"}
                position={'relative'}
                left={{
                    base: '0',
                    sm: user ? '50px' : '0',
                }}
            />

            <Flex alignItems={"center"} gap={2}>
                {user && <IoIosSettings onClick={() => navigate("/")} cursor={'pointer'} fontSize={30} color={colorMode == "dark" ? "white" : "black"} />}
                {user && <CgProfile onClick={() => navigate(`/profile/${user.userName}`)} cursor={'pointer'} fontSize={30} color={colorMode == "dark" ? "white" : "black"} />}
                {user && <IoChatbubbleEllipsesSharp onClick={() => navigate("/chat/" + null)} cursor={'pointer'} fontSize={30} color={colorMode == "dark" ? "white" : "black"} />}
                {user && <LogoutBtn />}
            </Flex>
        </Flex>
    )
}

export default Header
