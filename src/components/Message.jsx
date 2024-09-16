import { Avatar, Flex, Text } from '@chakra-ui/react'
import React from 'react'

const Message = ({ ownMessage }) => {
    return (
        <>
            {ownMessage ? (
                <Flex justifyContent={'flex-end'} gap={2}>
                    <Text maxW={'350px'} bg={'blue.500'} p={1} borderRadius={"md"}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic temporibus quia sit deleniti doloribus est?</Text>
                    <Avatar size={'sm'} src={''} />
                </Flex>
            ) : (
                <Flex justifyContent={'flex-start'} gap={2}>
                    <Avatar size={'sm'} src={''} />
                    <Text maxW={'350px'} bg={'gray.600'} p={1} borderRadius={"md"}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic temporibus quia sit deleniti doloribus est?</Text>
                </Flex>
            )}
        </>
    )
}

export default Message
