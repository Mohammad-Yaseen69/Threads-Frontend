import { Avatar, AvatarBadge, Flex, Stack, Text, useColorModeValue, WrapItem } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Conversation = ({ avatar, name, message, convoId, isOnline }) => {
    const navigate = useNavigate()
    return (
        <Flex
            gap={4}
            alignItems={'center'}
            _hover={{
                bg: useColorModeValue("gray.600", "gray.dark")
            }}
            cursor={'pointer'}
            p={2}
            borderRadius={'lg'}
            onClick={() => navigate(`/chat/${convoId}`)}

        >
            <WrapItem>
                <Avatar
                    size={{
                        base: "lg",
                        md: "md"
                    }}
                    src={avatar}
                >
                    {isOnline ? <AvatarBadge boxSize={'1em'} bg={"green"} /> : ""}
                </Avatar>
            </WrapItem>

            <Stack flexDirection={'column'} gap={0} fontSize={'sm'}>
                <Text fontWeight={'700'}>{name}</Text>
                <Text display={{
                    base: "none",
                    md: "block"
                }} fontWeight={'300'}>
                    {message?.slice(0, 18)}{message?.length > 19 ? "..." : ""}
                </Text>
                <Text display={{
                    base: "block",
                    md: "none"
                }} fontWeight={'300'}>
                    {message?.slice(0, 40)}{message?.length > 40 ? "..." : ""}
                </Text>
            </Stack>
        </Flex>
    )
}

export default Conversation
