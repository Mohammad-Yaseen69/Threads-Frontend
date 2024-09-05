import React, { useEffect } from 'react'
import { UpdateDetails, ChangeUserName } from "../components"
import { useRecoilState } from "recoil"
import { userAtom } from "../Atoms/user"
import { useNavigate } from "react-router-dom"
import { Flex, Text, useColorMode } from '@chakra-ui/react'

const UpdateInfo = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const [activeTab, setActiveTab] = React.useState('info')
    const { colorMode } = useColorMode()
    const navigate = useNavigate()

    console.log(user)
    useEffect(() => {
        if (!user) {
            console.log("df")
            navigate("/auth")
        }
    }, [])
    return (
        <div style={{ width: '100%' }}>
            <Flex w='full' mb={3}>
                <Flex
                    flex={1}
                    borderBottom={activeTab == 'info' ? colorMode == 'dark' ? '1.5px solid white' : '2px solid black' : '1px solid gray'}
                    justifyContent={'center'} pb='3'
                    cursor={'pointer'}
                    onClick={() => setActiveTab('info')}
                    transition={'all 0.3s'}
                >
                    <Text fontWeight={'bold'} color={activeTab == 'info' ? colorMode == 'dark' ? 'white' : 'gray.dark' : 'gray.light'}>Update Info</Text>
                </Flex>
                <Flex
                    flex={1}
                    borderBottom={activeTab == 'pass' ? colorMode == 'dark' ? '1.5px solid white' : '2px solid black' : '1px solid gray'}
                    justifyContent={'center'}
                    pb='3'
                    cursor={'pointer'}
                    onClick={() => setActiveTab('pass')}
                    transition={'all 0.3s'}
                >
                    <Text fontWeight={'bold'} color={activeTab == 'pass' ? colorMode == 'dark' ? 'white' : 'gray.dark' : 'gray.light'}>Change Password</Text>
                </Flex>
                <Flex
                    flex={1}
                    borderBottom={activeTab == 'userN' ? colorMode == 'dark' ? '1.5px solid white' : '2px solid black' : '1px solid gray'}
                    justifyContent={'center'}
                    pb='3'
                    cursor={'pointer'}
                    onClick={() => setActiveTab('userN')}
                    transition={'all 0.3s'}
                >
                    <Text fontWeight={'bold'} color={activeTab == 'userN' ? colorMode == 'dark' ? 'white' : 'gray.dark' : 'gray.light'}>Change User name</Text>
                </Flex>
            </Flex>
            {activeTab == 'info' && <UpdateDetails />}
            {/* {activeTab == 'pass' && <ChangePassword />} */}
            {activeTab == 'userN' && <ChangeUserName />}
        </div>
    )
}

export default UpdateInfo
