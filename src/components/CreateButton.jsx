import React, { useState } from 'react'
import { Box, Button, Flex, FormControl, Input, Text, FormLabel, useToast } from '@chakra-ui/react'
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

const CreateButton = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [postTitle, setPostTitle] = useState('')
    const toast = useToast()
    const [postImage, setPostImage] = useState(null)
    const [loading, setLoading] = useState(false)

    const onClose = () => setIsOpen(false)

    const handleImageChange = (e) => {
        setPostImage(e.target.files[0]) // Get the file from input
    }

    const handleSubmit = async () => {
        const formData = new FormData()
        formData.append('postTitle', postTitle)
        formData.append('media', postImage)

        // Log form data (for now)
        console.log('Post Title:', postTitle)
        console.log('Post Image:', postImage)

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
    }

    return (
        <>
            <Flex onClick={() => setIsOpen(true)} position={'fixed'} bottom={5} cursor={'pointer'} alignItems={'center'} right={10} border={'1px solid white'} borderRadius={'15px'} padding={'8px 15px'} color={'white'}>
                <IoIosAdd size={25} />
                <Text fontSize={'lg'} ml={2}>Post</Text>
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Post Title</FormLabel>
                            <Input
                                placeholder="Enter post title"
                                value={postTitle}
                                onChange={(e) => setPostTitle(e.target.value)}
                                required
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Post Image</FormLabel>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                pt={1}
                            />
                        </FormControl>
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
