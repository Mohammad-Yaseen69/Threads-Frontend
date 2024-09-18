import { useToast } from '@chakra-ui/react'
import { Avatar, Divider, Flex, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Message, MessageInput } from './'
import { makeRequest } from '../Utils/api'
import { toastingSytex } from '../Helper/toastingSyntext'
import { useRecoilState } from 'recoil'
import { userAtom } from '../Atoms/user'

const MessageConversation = ({ conversationId, currentConversation }) => {
    const [messages, setMessages] = useState([])
    const toast = useToast()
    const [loading, setLoading] = useState(true)
    const [user] = useRecoilState(userAtom)

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true)
            const response = await makeRequest("chats/get/messages/" + conversationId)

            if (response.error) {
                toastingSytex(toast, 'error', response.error.message)
            }

            setLoading(false)
            setMessages(response.response?.data)
        }
        getMessages()
    }, [conversationId])

    return (
        <Flex
            flex={{
                base: 100,
                md: 70
            }}
            rounded={'lg'}
            // p={2}
            flexDirection={'column'}
            bg={useColorModeValue('gray.200', 'gray.dark')}
            padding={2}
        >
            <Flex h={12} alignItems={'center'} w={'full'} gap={2}>
                <Avatar size={'sm'} src={currentConversation?.participantsInfo?.pfp?.url} />
                <Text fontWeight={'bold'}>{currentConversation?.participantsInfo?.name}</Text>
            </Flex>
            <Divider />

            <Flex
                flexDirection={'column'}
                height={'400px'}
                gap={3}
                my={4}
                overflowY={'auto'}
                sx={{
                    '&::-webkit-scrollbar': {
                        width: '2px', // Thin scrollbar
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent', // Transparent background
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#c4c4c4', // Scrollbar color (like Instagram)
                        borderRadius: '24px', // Rounded edges
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#a3a3a3', // Slightly darker on hover
                    },
                }}
            >
                {loading &&
                    [...Array(5)].map((_, i) => (
                        <Flex
                            key={i}
                            gap={2}
                            alignItems={'center'}
                            p={1}
                            borderRadius={'md'}
                            alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
                        >
                            {i % 2 === 0 && <SkeletonCircle size={7} />}

                            <Flex flexDirection={'column'} gap={2}>
                                <Skeleton h={'5px'} w={'250px'} />
                                <Skeleton h={'5px'} w={'250px'} />
                                <Skeleton h={'5px'} w={'250px'} />
                            </Flex>

                            {i % 2 !== 0 && <SkeletonCircle size={7} />}

                        </Flex>
                    ))
                }

                {messages?.map((message) => (
                    <Message
                        message={message?.text}
                        ownMessage={message?.sender === user?._id}
                        key={message._id}
                        otherUserInfo={currentConversation?.participantsInfo}
                        UserInfo={user}
                    />
                ))}



            </Flex>
            <MessageInput OtherParticipantId={currentConversation?.participantsInfo?._id} setMessages={setMessages}/>
        </Flex>
    )
}

export default MessageConversation
