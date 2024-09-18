import { useState } from 'react'
import { Input, InputGroup, InputRightElement, useToast } from '@chakra-ui/react'
import React from 'react'
import { IoSendSharp } from 'react-icons/io5'
import { makeRequest } from '../Utils/api'

const MessageInput = ({ setMessages, OtherParticipantId }) => {
    const [message, setMessage] = useState('')
    const toast = useToast()

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
        setMessages((prev) => [...prev, response.response.data])
    }
    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
        }}>
            <InputGroup>
                <Input value={message} onChange={(e) => setMessage(e.target.value)} type='text' placeholder='Enter Your Message...' />
                <InputRightElement>
                    <IoSendSharp onClick={handleSendMessage} cursor={'pointer'} />
                </InputRightElement>
            </InputGroup>
        </form>
    )
}

export default MessageInput
