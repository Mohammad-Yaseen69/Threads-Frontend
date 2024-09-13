import { useNavigate } from 'react-router-dom'
import React, { useRef, useState } from 'react'
import { Box, Button, Flex, FormControl, Input, Text, FormLabel, useToast, Textarea, Image } from '@chakra-ui/react'
import { IoIosAdd } from "react-icons/io";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { makeRequest } from '../Utils/api';
import { toastingSytex } from '../Helper/toastingSyntext';
import { FaImage } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const CreateButton = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [postTitle, setPostTitle] = useState('')
    const toast = useToast()
    const [postImage, setPostImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)
    const navigate = useNavigate()

    const ref = useRef()

    const onClose = () => {
        setIsOpen(false)
        setPostTitle('')
        setPostImage(null)
        setImagePreview(null)
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        setPostImage(file)
        if (file) {
            const fileType = file.type
            if (fileType.startsWith('image/')) {
                setImagePreview(URL.createObjectURL(file)) // Set the selected image as the preview
            } else {
                setImagePreview(null)
                toast({
                    title: "Error",
                    description: "Only image files are allowed",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            }
        }
    }

    const handleSubmit = async () => {
        const formData = new FormData()
        formData.append('postTitle', postTitle)
        formData.append('media', postImage)

        if (postTitle.length > 500) {
            toastingSytex(toast, 'error', 'Post title should be less than 500 characters')
            return
        }

        setLoading(true)
        const response = await makeRequest(`posts/create`, {
            method: 'POST',
            data: formData,
        })

        if (response.error) {
            toastingSytex(toast, 'error', response.error.message)
        }
        else {
            toastingSytex(toast, 'success', response.response.message)
            onClose()
        }
        setLoading(false)
        setPostTitle('')
        setPostImage(null)
        setImagePreview(null)
        navigate("/")
    }

    return (
        <>
            <Flex zIndex={'12'} onClick={() => setIsOpen(true)} position={'fixed'} bottom={5} cursor={'pointer'} alignItems={'center'} right={{
                base: '10px',
                md: '30px',
                lg: '30px',
            }} backgroundColor={'gray.dark'} borderRadius={'10px'} padding={'8px 15px'} color={'white'}>
                <IoIosAdd size={25} fontWeight={'700'} />
                <Text fontWeight={'700'}>Post</Text>
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Post Content</FormLabel>
                            <Textarea
                                placeholder="Enter Post Content"
                                value={postTitle}
                                onChange={(e) => setPostTitle(e.target.value)}
                                required
                                resize={'none'}
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Post Image</FormLabel>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                pt={1}
                                display={'none'}
                                ref={ref}
                            />
                        </FormControl>

                        <Flex gap={3}>
                            <FaImage
                                size={25}
                                style={{ cursor: 'pointer' }}
                                onClick={() => ref.current.click()}
                            />
                            {imagePreview &&
                                <IoMdClose
                                    size={25}
                                    style={{ cursor: 'pointer', backgroundColor: "gray", padding: '3px', borderRadius: '2px' }}
                                    position={'absolute'}
                                    top={2}
                                    right={2}
                                    onClick={() => {
                                        setImagePreview(null)
                                        setPostImage(null)
                                    }} />
                            }
                        </Flex>

                        {imagePreview &&
                            <Flex position={'relative'} justifyContent={'center'} width={'100%'}>
                                <Image src={imagePreview} alt="Post Image" mt={4} maxH="200px" objectFit="cover" />

                            </Flex>
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button isLoading={loading} colorScheme="green" onClick={handleSubmit}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreateButton
