import { useEffect, useState } from 'react'
import { Box, Button, Flex, Input, InputGroup, InputRightElement, Spinner, Text, useToast } from '@chakra-ui/react'
import React from 'react'
import { IoSendSharp } from 'react-icons/io5'
import { makeRequest } from '../Utils/api'
import { toastingSytex } from '../Helper/toastingSyntext'

const MessageInput = ({ setMessages, OtherParticipantId, isAllowed, conversationId }) => {
    const [message, setMessage] = useState('')
    const toast = useToast()
    const [canAllow, setCanAllow] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isAllowedState, setIsAllowed] = useState(undefined)


    useEffect(() => {
        setIsAllowed(isAllowed)
        setLoading(false)

    }, [isAllowed])

    useEffect(() => {
        const canAllowUser = async () => {
            if (conversationId) {
                setLoading(true)
                const response = await makeRequest(`chats/canAllow/${conversationId}`)
                if (response.error) {
                    toastingSytex(toast, 'error', response.error.message)
                } else {
                    setCanAllow(response.response?.data?.canAllow)

                }
                setLoading(false)
            }
        }
        canAllowUser()
    }, [conversationId])


    const handleSendMessage = async () => {
        if (!message) return;


        const response = await makeRequest(`chats/send/${OtherParticipantId}`, {
            method: "POST",
            data: { message }
        })

        if (response.error) {
            toastingSytex(toast, 'error', response.error.message)
        }

        setMessage('')
        setMessages((prev) => [...prev, response?.response?.data?.messageData])

        if (response?.response?.data?.isAllowed !== undefined) {
            setIsAllowed(response?.response?.data?.isAllowed);
        }
    }

    const handleAllow = async () => {
        setLoading(true)
        const response = await makeRequest(`chats/allow/${conversationId}`, {
            method: "POST"
        })
        if (response.error) {
            toastingSytex(toast, 'error', response.error.message)
        } else {
            setIsAllowed(true)
        }
        setLoading(false)
    }


    return (
        <>
            {isAllowedState && <form onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
            }}>
                <InputGroup>
                    <Input value={message} onChange={(e) => setMessage(e.target.value)} type='text' placeholder='Enter Your Message...' />
                    <InputRightElement>
                        <IoSendSharp onClick={handleSendMessage} cursor={'pointer'} />
                    </InputRightElement>
                </InputGroup>
            </form>}
            {loading && <Spinner />}

            {!isAllowedState && !canAllow && <Text textAlign={'center'} fontSize={'lg'} my={3} fontWeight={700}>You can't send more messages until this user allowed you</Text>}
            {!isAllowedState && canAllow &&
                <Flex mt={'-10'} mb={3} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={3}>
                    <Text textAlign={'center'} fontSize={'lg'} fontWeight={700}>Do you wanna Allow this user to chat with you?</Text>
                    <Flex gap={3}>
                        <Button colorScheme='red'>No</Button>
                        <Button onClick={handleAllow} colorScheme='green'>Yes</Button>
                    </Flex>
                </Flex>
            }
        </>
    )
}

export default MessageInput
