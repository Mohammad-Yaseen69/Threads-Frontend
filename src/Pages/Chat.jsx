import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useToast } from '@chakra-ui/react'
import { Conversation, MessageConversation, } from "../components"
import { GiConversation } from "react-icons/gi"
import { useParams } from 'react-router-dom';
import { makeRequest } from '../Utils/api';
import { toastingSytex } from '../Helper/toastingSyntext';
import { useSocket } from '../context/socketContext';

const Chat = () => {
    const [convoLoading, setConvoLoading] = useState(true)
    const [search, setSearch] = useState('')
    const { chatId } = useParams()
    const [conversations, setConversations] = useState([])
    const toast = useToast()
    const {onlineUsers} = useSocket()



    useEffect(() => {
        async function getConversations() {
            setConvoLoading(true)
            const response = await makeRequest("chats/get/conversations")
            if (response.error) {
                toastingSytex(toast, 'error', response.error.message)
            }

            setConvoLoading(false)
            setConversations(response.response.data)
        }

        getConversations()
    }, [])

    console.log(onlineUsers)
    return (
        <Box
            position={'absolute'}
            left={'50%'}
            transform={'translateX(-50%)'}
            w={{
                base: "100%",
                md: "750px"
            }}
            padding={{
                base: 0,
                md: 0
            }}
        >
            <Flex
                flexDirection={{
                    base: 'column',
                    md: 'row'
                }}
                w={'100%'}
                gap={4}
                mx={'auto'}
            >
                {/* Conversation Sidebar */}
                <Flex
                    flex={{
                        base: 100,
                        md: 30
                    }}
                    flexDirection={'column'}
                    gap={4}
                    maxHeight={'80vh'}
                    overflowY={'auto'}
                    paddingRight={2}
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
                    <Text display={{
                        base: chatId == 'null' ? 'block' : 'none',
                        md: 'block'
                    }} fontWeight={'bold'}>Your Conversations</Text>

                    {convoLoading && (
                        [1, 2, 3, 4, 5].map((_, i) => (
                            <Flex key={i} alignItems={'center'} p={1} gap={3} borderRadius={'md'}>
                                <SkeletonCircle size={10} flexShrink={0} />
                                <Flex w={'full'} flexDirection={'column'} gap={3}>
                                    <Skeleton width={'80px'} height={"10px"} />
                                    <Skeleton width={'90%'} height={"8px"} />
                                    <Skeleton width={'90%'} height={"8px"} />
                                </Flex>
                            </Flex>
                        ))
                    )}

                    <Box display={{
                        base: chatId == 'null' ? 'block' : 'none',
                        md: 'block'
                    }}>
                        {!convoLoading && conversations.map((conversation) => (
                            <Conversation
                                key={conversation._id}
                                convoId={conversation._id}
                                avatar={conversation.participantsInfo?.pfp?.url}
                                name={conversation.participantsInfo?.name}
                                message={conversation.lastMessage?.text}
                                isOnline={onlineUsers?.includes(conversation.participantsInfo?._id)}
                            />
                        ))}
                    </Box>
                </Flex>

                {chatId == 'null' ?
                    <Flex
                        flex={70}
                        flexDirection={'column'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        borderRadius={'md'}
                        height={'400px'}
                        display={{
                            base: 'none',
                            md: 'flex'
                        }}
                    >
                        <GiConversation size={100} />
                        <Text fontSize={20}>Select a Conversation to Start Messaging</Text>
                    </Flex> :

                    <MessageConversation
                        conversationId={chatId}
                        setAllConversations={setConversations}
                    />
                }

            </Flex>
        </Box>
    )
}

export default Chat
