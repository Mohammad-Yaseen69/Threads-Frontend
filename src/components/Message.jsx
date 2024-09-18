import { Avatar, Flex, Text } from '@chakra-ui/react'
import React from 'react'

const Message = ({ ownMessage , message, otherUserInfo, UserInfo }) => {
    return (
        <>
            {ownMessage ? (
                <Flex justifyContent={'flex-end'} gap={2}>
                    <Text maxW={'350px'} bg={'blue.500'} p={1} borderRadius={"md"}>{message}</Text>
                    <Avatar size={'sm'} src={UserInfo?.pfp?.url} />
                </Flex>
            ) : (
                <Flex justifyContent={'flex-start'} gap={2}>
                    <Avatar size={'sm'} src={otherUserInfo?.pfp?.url} />
                    <Text maxW={'350px'} bg={'gray.600'} p={1} borderRadius={"md"}>{message}</Text>
                </Flex>
            )}
        </>
    )
}

export default Message
