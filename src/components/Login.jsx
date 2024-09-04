import { useToast } from '@chakra-ui/react'
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Link,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { makeRequest } from '../Utils/api';
import { userAtom } from "../Atoms/user"
import { useRecoilState } from 'recoil';


export default function Login({ setAuthScreen }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useRecoilState(userAtom);
  const toast = useToast()


  const handleLogin = async () => {
    const isEmail = identifier.includes('@');
    let inputs = {
      password: password,
    }

    if (isEmail) {
      inputs.email = identifier
    } else {
      inputs.userName = identifier
    }

    try {
      setLoading(true)
      const res = await makeRequest("users/login", {
        method: "POST",
        data: inputs
      })

      setLoading(false)



      if (res.error) {
        toast({
          title: "Error",
          description: res.error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      } else {
        res.response.success && toast({
          title: "Success",
          description: res.response.success,
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        localStorage.setItem("user", JSON.stringify(res.response.data))
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <Flex
      minH={'70vh'}
      align={'center'}
      justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={0} px={0}>
        <Stack align={'center'}>
          <Heading fontSize={{
            base: "3xl",
            sm: "4xl"
          }} textAlign={"center"}>Login to your account</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}
          w={{
            base: "full",
            sm: "400px"
          }}
        >

          <Stack spacing={3}>
            <FormControl id="identifier">
              <FormLabel>Email or UserName</FormLabel>
              <Input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                />

                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Stack spacing={5}>

              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                mt={4}
                onClick={handleLogin}>
                Login
              </Button>

              {error && <Text color={"red.500"} textAlign={"center"}>{error}</Text>}
              {success && <Text color={"green.500"} textAlign={"center"}>{success}</Text>}
              {loading && <Text color={"blue.500"} textAlign={"center"}>Please Wait...</Text>}

              <Text textAlign={"center"}>Don't have an account? <Link color={"blue.500"} onClick={() => setAuthScreen('signup')}>Create Account</Link> </Text>
            </Stack>

          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}