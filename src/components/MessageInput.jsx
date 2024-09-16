import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import React from 'react'
import { IoSendSharp } from 'react-icons/io5'

const MessageInput = () => {
    return (
        <form>
            <InputGroup>
                <Input type='text' placeholder='Enter Your Message...' />
                <InputRightElement>
                    <IoSendSharp cursor={'pointer'} />
                </InputRightElement>

            </InputGroup>
        </form>
    )
}

export default MessageInput
