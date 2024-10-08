import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { makeRequest } from '../Utils/api'
import { useRecoilState } from 'recoil'
import { userAtom } from '../Atoms/user'
import { useNavigate } from 'react-router-dom'

export default function SignupCard({ setAuthScreen }) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const usernameRegex = /^[a-z0-9._]+$/;
  const [user, setUser] = useRecoilState(userAtom)
  const navigate = useNavigate()
  const toast = useToast()


  const [inputs, setInputs] = useState({
    userName: '',
    email: '',
    password: '',
    name: ''
  })

  const handleSignup = async () => {
    if (!inputs.userName || !inputs.email || !inputs.password || !inputs.name) {
      toast({
        title: "Error",
        description: "All Fields are Required",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      setLoading(true)
      const res = await makeRequest("users/register", {
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
        setUser(res.response.data)
      }

    } catch (error) {
      console.log(error)
    }

    console.log(inputs)
  }

  return (
    <Flex
      align={'center'}
      justify={'center'}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
        </Stack>

        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}
          w={{
            base: "full",
            sm: "400px"
          }}>

          <Flex gap={2} mb={3}>
            <FormControl id="userName" isRequired>
              <FormLabel>User Name</FormLabel>
              <Input
                value={inputs.userName}
                onChange={(e) => {
                  const value = e.target.value;
                  // Check if the new value is valid
                  if (usernameRegex.test(value) || value === '') {
                    setInputs({ ...inputs, userName: value });
                  } else {
                    toast({
                      title: "Error",
                      description: "Only lowercase letters, numbers, '.' and '_' are allowed for the username.",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    })
                  }
                }}
                type="text"
              />
            </FormControl>

            <FormControl id="name" isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input value={inputs.name} onChange={(e) => setInputs({ ...inputs, name: e.target.value })} type="text" />
            </FormControl>
          </Flex>
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input value={inputs.email} onChange={(e) => setInputs({ ...inputs, email: e.target.value })} type="email" />
            </FormControl>


            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input value={inputs.password} onChange={(e) => setInputs({ ...inputs, password: e.target.value })} type={showPassword ? 'text' : 'password'} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>


            <Stack spacing={5} pt={2}>
              <Button
                loadingText="Submitting"
                onClick={handleSignup}
                size="lg"
                bg={'blue.400'}
                color={'white'}
                disabled={loading}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign up
              </Button>

              {loading && <Text color={"blue.500"} textAlign={"center"}>Please Wait...</Text>}
            </Stack>
            <Stack pt={2}>
              <Text align={'center'}>
                Already a user? <Link onClick={() => setAuthScreen('login')} color={'blue.400'}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}