import { Textarea, useColorMode, useToast } from '@chakra-ui/react'
import {
    Avatar,
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Text,
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { userAtom } from '../Atoms/user'
import { makeRequest } from '../Utils/api'

const ChangeUserN = () => {
    const [userName, setUserName] = useState('')
    const [user, setUser] = useRecoilState(userAtom)
    const toast = useToast()
    const { colorMode } = useColorMode()

    useEffect(() => {
        if (user) {
            setUserName(user.userName)
        }
    }, [user])



    const handleUpdate = async () => {
        if (!userName) {
            toast({
                title: "Error",
                description: "User Name can't be Empty",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            return
        }

        const response = await makeRequest("users/changeUserName", {
            method: "POST",
            data: { userName }
        })

        if(response.error){
            toast({
                title: "Error",
                description: response.error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        }
        else{
            toast({
                title: "Success",
                description: response.response.message,
                status: "success",
                duration: 3000,
                isClosable: true,
            })
            localStorage.setItem('user', JSON.stringify(response.response.data))
            setUser(response.response.data)
        }
    }


return (
    <Flex spacing={1} w={'100%'} alignItems={'center'} justifyContent={'center'} mb={5}>

        <Box
            rounded={'lg'}
            bg={colorMode == "dark" ? "gray.dark" : "gray.100"}
            boxShadow={'lg'}
            p={6}
            w={{
                base: "full",
                sm: "400px"
            }}
            maxW={{
                base: "100%",
                sm: "400px",
                md: "500px",
                lg: "600px",
            }}

        >
            <Stack spacing={4}>

                <FormControl id="instagram" isRequired>
                    <FormLabel>Change User Name</FormLabel>
                    <Input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        type="text"
                        placeholder="Your User Name"
                    />
                </FormControl>


                <Stack spacing={5} pt={2}>
                    <Button
                        loadingText="Updating"
                        onClick={handleUpdate}
                        size="lg"
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                            bg: 'blue.500',
                        }}
                    >
                        Change User Name
                    </Button>
                </Stack>
            </Stack>
        </Box>
    </Flex>
)
}

export default ChangeUserN
