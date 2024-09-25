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
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { userAtom } from '../Atoms/user'
import { makeRequest } from '../Utils/api'

const ChangePass = () => {
    const [inputs, setInputs] = useState({
        newPassword: "",
    })
    const [user, setUser] = useRecoilState(userAtom)
    const toast = useToast()
    const { colorMode } = useColorMode()


    const handleUpdate = async () => {
        if (!inputs.newPassword) {
            toast({
                title: "Error",
                description: "Please Provide New Password",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            return
        }

        const response = await makeRequest("users/changePassword", {
            method: "POST",
            data: inputs
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
                    <FormLabel>New Password</FormLabel>
                    <Input
                        value={inputs.newPassword}
                        onChange={(e) => setInputs((prev) => ({...prev, newPassword: e.target.value}))}
                        type="text"
                        placeholder="Your New Password"
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
                        Change Password
                    </Button>
                </Stack>
            </Stack>
        </Box>
    </Flex>
)
}

export default ChangePass