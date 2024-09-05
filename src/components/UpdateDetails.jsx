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

const UpdateDetails = () => {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [pfp, setPfp] = useState('/default-avatar.png')
  const [instagram, setInstagram] = useState('')
  const fileInputRef = useRef(null)
  const [user, setUser] = useRecoilState(userAtom)
  const toast = useToast()
  const {colorMode} = useColorMode()
  const [pfpFile, setPfpFile] = useState(null)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setBio(user.bio)
      setPfp(user.pfp?.url)
      setInstagram(user.instagram)
    }
  }, [user])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setPfpFile(file)
    if (file) {
      const fileType = file.type
      if (fileType.startsWith('image/')) {
        setPfp(URL.createObjectURL(file)) // Set the selected image as the profile picture
      } else {
        toast({
          title: "Error",
          description: "Only Image Type Available",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  const handleUpdate = async () => {
    if (!name) {
      toast({
        title: "Error",
        description: "Name can't be Empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return // Return early if name is missing to prevent the request
    }

    const formData = new FormData()

    // Corrected the order of the key-value pairs and added missing fields
    formData.append('name', name)
    bio && formData.append('bio', bio) // Corrected this line
    instagram && formData.append('instagram', instagram) // Appending Instagram URL
    pfpFile && formData.append('pfp', pfpFile)

    const response = await makeRequest("users/add", {
      method: "POST",
      data: formData,
    })


    if (response.error) {
      toast({
        title: "Error",
        description: response.error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
    else {
      toast({
        title: "User Details Changed",
        description: response.success,
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
          base: "full", // Ensures full width on small devices
          sm: "400px" // On small screens or larger, it will be 400px wide
        }}
        maxW={{
          base: "100%", // On the smallest screens, it will take 90% of the screen width
          sm: "400px", // On small to medium screens, it will be 400px wide
          md: "500px", // On medium screens, it will be 500px wide
          lg: "600px", // On large screens, it will be 600px wide
        }}

      >
        <Stack spacing={4}>

          {/* Profile Picture */}
          <FormControl id="pfp">
            <FormLabel>Profile Picture</FormLabel>
            <Flex align="center" justify="center">
              <Avatar
                size="xl"
                src={pfp}
                cursor="pointer"
                onClick={() => fileInputRef.current.click()}
              />
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                display="none" // Hide the input element
              />
            </Flex>
          </FormControl>

          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter your name"
            />
          </FormControl>

          <FormControl id="instagram" isRequired>
            <FormLabel>Insta Url</FormLabel>
            <Input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              type="text"
              placeholder="Your Insta Id Link/Url"
            />
          </FormControl>

          {/* Name Field */}

          <FormControl id="bio">
            <FormLabel>Bio</FormLabel>
            <Textarea
              value={bio}
              resize={'none'}
              onChange={(e) => setBio(e.target.value)}
              type="text"
              placeholder="Enter a short bio"
            />
          </FormControl>

          {/* Update Button */}
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
              Update Details
            </Button>
          </Stack>
        </Stack>
      </Box>

    </Flex>
  )
}

export default UpdateDetails
