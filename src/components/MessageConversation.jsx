import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import { Avatar, Divider, Flex, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { Message, MessageInput } from './'
import { makeRequest } from '../Utils/api'
import { toastingSytex } from '../Helper/toastingSyntext'
import { useRecoilState } from 'recoil'
import { userAtom } from '../Atoms/user'
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom'

const MessageConversation = ({ conversationId , setAllConversations }) => {
    const [messages, setMessages] = useState([])
    const toast = useToast()
    const [loading, setLoading] = useState(true)
    const [user] = useRecoilState(userAtom)
    const [conversation, setConversations] = useState({})
    const messagesEndRef = useRef(null) // Ref for scrolling to the end
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true)
            const response = await makeRequest("chats/get/messages/" + conversationId)

            if (response.error) {
                toastingSytex(toast, 'error', response.error.message)
            }

            setLoading(false)
            setMessages(response.response?.data?.messages)
            setConversations(response.response?.data?.conversation)
        }
        getMessages()
    }, [conversationId])

    console.log(messages)

    useEffect(() => {
        // Scroll to the bottom when messages are updated
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
    }, [messages])

    const handleDelete = async () => {
        const response = await makeRequest(`chats/delete/conversation/${conversationId}`, {
            method: "DELETE"
        })
        if (response.error) {
            toastingSytex(toast, 'error', response.error.message)
        } else {
            toastingSytex(toast, 'success', response.response.message)
            navigate(`/chat/${null}`)
            setAllConversations((prev) => prev.filter((c) => c._id !== conversationId))
        }
    }

    const handleDeleteMessage = async (messageId) => {
        const response = await makeRequest(`chats/delete/message/${messageId}`, {
            method: "DELETE"
        })
        if (response.error) {
            toastingSytex(toast, 'error', response.error.message)
        } else {
            setMessages((prev) => prev.filter((m) => m._id !== messageId))
        }
    }

    return (
        <Flex
            flex={{
                base: 100,
                md: 70
            }}
            rounded={'lg'}
            flexDirection={'column'}
            bg={useColorModeValue('gray.200', 'gray.dark')}
            padding={2}
        >
            <Flex h={12} alignItems={'center'} w={'full'} justifyContent={'space-between'} gap={2}>
                <Flex cursor={'pointer'} onClick={() => navigate(`/profile/${conversation?.otherUser?.userName}`)} alignItems={'center'} gap={2}>
                    <Avatar size={'sm'} src={conversation?.otherUser?.pfp?.url} />
                    <Text fontWeight={'bold'}>{conversation?.otherUser?.name}</Text>
                </Flex>

                <Flex mr={2}>
                    <Button onClick={onOpen} padding={0}>
                        <RiDeleteBin5Fill fontSize={'1.5rem'} color={'red'} cursor={'pointer'} />
                    </Button>

                    <Modal isCentered isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay
                            backdropFilter='blur(10px) hue-rotate(90deg)'
                        />
                        <ModalContent>
                            <ModalHeader>Confirmation</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody >
                                <Text>Do You Really Wanna Delete This Chat?</Text>
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={onClose}>Close</Button>
                                <Button colorScheme='red' ml={3} onClick={handleDelete}>
                                    Delete
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Flex>
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
                        width: '2px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#c4c4c4',
                        borderRadius: '24px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#a3a3a3',
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

                {!loading && messages?.map((message) => (
                    <Message
                        message={message?.text}
                        messageId={message?._id}
                        ownMessage={message?.sender === user?._id}
                        key={message?._id}
                        otherUserInfo={conversation?.otherUser}
                        UserInfo={user}
                        handleDeleteMessage={handleDeleteMessage}
                    />
                ))}
                <div ref={messagesEndRef} /> {/* Empty div to scroll into view */}
            </Flex>
            <MessageInput isAllowed={conversation?.isAllowed} conversationId={conversation?._id} OtherParticipantId={conversation?.otherUser?._id} setMessages={setMessages} />
        </Flex>
    )
}

export default MessageConversation