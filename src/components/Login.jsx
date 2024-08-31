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
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'


export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    const isEmail = identifier.includes('@');

    console.log(password)
    // Perform login logic based on whether the input is an email or username
    if (isEmail) {
      console.log('Logging in with email:', identifier);
      // Call login function for email
    } else {
      console.log('Logging in with username:', identifier);
      // Call login function for username
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
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'right'}
                cursor={'pointer'}
              >
                <Text color={'blue.400'}>Create Account</Text>
              </Stack>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleLogin}>
                Login
              </Button>
            </Stack>

          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}