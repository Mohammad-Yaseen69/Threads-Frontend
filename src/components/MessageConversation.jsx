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
import { useSocket } from '../context/socketContext'

const MessageConversation = ({ conversationId, setAllConversations }) => {
    const [messages, setMessages] = useState([])
    const toast = useToast()
    const [loading, setLoading] = useState(true)
    const [user] = useRecoilState(userAtom)
    const [conversation, setConversations] = useState({})
    const messagesEndRef = useRef(null) // Ref for scrolling to the end
    const [canAllow, setCanAllow] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()
    const { socket } = useSocket()

    useEffect(() => {
        if (socket) {
            socket.on("messageDeleted", ({ messageId, conversationId: socketConvoId }) => {

                console.log(socketConvoId, conversationId)
                if(socketConvoId !== conversationId) return;
                // Remove the message from the state
                setMessages((prev) => {
                    const newMessages = prev.filter((m) => m._id !== messageId);

                    // Update the last message for the conversation
                    const lastMessage = newMessages[newMessages.length - 1] || null;
                    setAllConversations((prevConversations) =>
                        prevConversations.map((conv) => {
                            if (conv?._id === conversationId) {
                                return {
                                    ...conv,
                                    lastMessage: lastMessage ? { text: lastMessage.text, sender: lastMessage.sender } : { text: '', sender: '' }
                                };
                            }
                            return conv;
                        })
                    );

                    return newMessages; // Return the new state of messages
                });
            });
        }


        return () => {
            socket?.off("messageDeleted");
        };

    }, [socket])



    useEffect(() => {
        const getMessages = async () => {
            setLoading(true)
            const response = await makeRequest("chats/get/messages/" + conversationId)

            if (response.error) {
                toastingSytex(toast, 'error', response.error.message)
            }

            if (!response.response?.data?.conversation?.isAllowed) {
                const responseCanAllow = await makeRequest(`chats/canAllow/${conversationId}`)
                if (responseCanAllow.error) {
                    toastingSytex(toast, 'error', responseCanAllow.error.message)
                } else {
                    setCanAllow(responseCanAllow.response?.data?.canAllow)
                }
            }

            setLoading(false)
            setMessages(response.response?.data?.messages)
            setConversations(response.response?.data?.conversation)
        }
        getMessages()
    }, [conversationId])


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
        const response = await makeRequest(`chats/delete/message/${messageId}/${conversationId}`, {
            method: "DELETE"
        });
        if (response.error) {
            toastingSytex(toast, 'error', response.error.message);
        } else {
            // Update state locally
            setMessages((prev) => {
                const newMessages = prev.filter((m) => m._id !== messageId);

                // Update the last message for the conversation
                const lastMessage = newMessages[newMessages.length - 1] || null;
                setAllConversations((prevConversations) =>
                    prevConversations.map((conv) => {
                        if (conv?._id === conversationId) {
                            return {
                                ...conv,
                                lastMessage: lastMessage ? { text: lastMessage.text, sender: lastMessage.sender } : { text: '', sender: '' }
                            };
                        }
                        return conv;
                    })
                );

                return newMessages; // Return the new state of messages
            });
        }
    };
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
            mt={{
                base: '-20px',
                md: 0
            }}
        >
            <Flex h={12} alignItems={'center'} w={'full'} justifyContent={'space-between'} gap={2}>
                <Flex cursor={'pointer'} onClick={() => !loading && navigate(`/profile/${conversation?.otherUser?.userName}`)} alignItems={'center'} gap={2}>
                    <Avatar size={'sm'} src={!loading ? conversation?.otherUser?.pfp?.url : ""} />
                    <Text fontWeight={'bold'}>{!loading ? conversation?.otherUser?.name : ""}</Text>
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
            <MessageInput messagesLoading={loading} setConversations={setAllConversations} canAllow={canAllow} isAllowed={conversation?.isAllowed} conversationId={conversation?._id} OtherParticipantId={conversation?.otherUser?._id} setMessages={setMessages} />
        </Flex>
    )
}

export default MessageConversation