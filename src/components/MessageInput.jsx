import { useEffect, useState } from 'react'
import { Box, Button, Flex, Input, InputGroup, InputRightElement, Spinner, Text, useToast } from '@chakra-ui/react'
import React from 'react'
import { IoSendSharp } from 'react-icons/io5'
import { makeRequest } from '../Utils/api'
import { toastingSytex } from '../Helper/toastingSyntext'
import { useRecoilState } from 'recoil'
import { userAtom } from '../Atoms/user'
import { useParams } from 'react-router-dom'
import { useSocket } from '../context/socketContext'
import messageSound from '../Helper/livechat-129007.mp3'

const MessageInput = ({ setMessages, OtherParticipantId, isAllowed, conversationId, setConversations, messagesLoading, canAllow }) => {
    const [message, setMessage] = useState('')
    const toast = useToast()
    const [loading, setLoading] = useState(true)
    const [isAllowedState, setIsAllowed] = useState(undefined)
    const [user] = useRecoilState(userAtom)
    const { chatId } = useParams()
    const { socket } = useSocket()
    const [sendLoading, setSendLoading] = useState(false)

    useEffect(() => {
        socket?.on("conversationAllowed", (conversationId) => {
            if (conversationId === chatId) {
                setIsAllowed(true)
            }
        })
    }, [socket])


    useEffect(() => {
        const handleNewMessage = (newMessage) => {
            if (newMessage.conversation == conversationId) {
                setMessages((prev) => [...prev, newMessage]);
            }

            
            if(!document.hasFocus()){
                const audio = new Audio(messageSound);
                audio.play();
            }


            setConversations((prevConversations) =>
                prevConversations.map((conv) => {
                    if (conv?._id === newMessage.conversation) {
                        return {
                            ...conv,
                            lastMessage: {
                                text: newMessage.text,
                                sender: newMessage.sender
                            }
                        };
                    } else {
                        return conv;
                    }
                })
            );
            
            setConversations((prevConversations) => {
                const updatedConvo = prevConversations.find(conv => conv?._id === newMessage.conversation);
                const otherConvos = prevConversations.filter(conv => conv?._id !== newMessage.conversation);

                return [updatedConvo, ...otherConvos]; // Place updated conversation at the top
            });
        };

        if (socket) {
            socket.on('newMessage', handleNewMessage);
        }

        // Cleanup listener on component unmount
        return () => {
            if (socket) {
                socket.off('newMessage', handleNewMessage);
            }
        };
    }, [socket, conversationId, setMessages, setConversations]);



    useEffect(() => {
        setLoading(true)
        setIsAllowed(isAllowed)
        setLoading(false)

    }, [isAllowed, chatId])

    const handleSendMessage = async () => {
        if (!message) return;
        setSendLoading(true)


        const response = await makeRequest(`chats/send/${OtherParticipantId}`, {
            method: "POST",
            data: { message }
        })

        if (response.error) {
            toastingSytex(toast, 'error', response.error.message)
        }

        setSendLoading(false)
        setMessage('')
        setMessages((prev) => [...prev, response?.response?.data?.messageData])
        setConversations((prevConversations) =>
            prevConversations.map((conv) => {
                const currentConvo = conv?._id === conversationId
                if (currentConvo) {
                    return {
                        ...conv,
                        lastMessage: {
                            text: message,
                            sender: user?._id
                        }
                    };
                } else {
                    return conv;
                }
            })
        );
        setConversations((prevConversations) => {
            const updatedConvo = prevConversations.find(conv => conv?._id === conversationId);
            const otherConvos = prevConversations.filter(conv => conv?._id !== conversationId);

            return [updatedConvo, ...otherConvos]; // Place updated conversation at the top
        });

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
            {!messagesLoading && isAllowedState && <form onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
            }}>
                <InputGroup>
                    <Input value={message} onChange={(e) => setMessage(e.target.value)} type='text' placeholder='Enter Your Message...' />
                    <InputRightElement>
                        <Button isLoading={sendLoading} p={0} bg={'transparent'}>
                            <IoSendSharp onClick={handleSendMessage} cursor={'pointer'} />
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </form>}
            {loading && ""}

            {!messagesLoading && !isAllowedState && !canAllow && <Text textAlign={'center'} fontSize={'lg'} my={3} fontWeight={700}>You can't send more messages until this user allowed you</Text>}
            {!messagesLoading && !isAllowedState && canAllow &&
                <Flex mt={'-10'} mb={3} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={3}>
                    <Text textAlign={'center'} fontSize={'lg'} fontWeight={700}>Do you wanna Allow this user to chat with you?</Text>
                    <Flex gap={3}>
                        <Button colorScheme='red'>No</Button>
                        <Button onClick={handleAllow} colorScheme='green'>Yes</Button>
                    </Flex>
                </Flex>
            }
            {messagesLoading && <form>
                <InputGroup visibility={"hidden"} pointerEvents={"none"}>
                    <Input type='text' placeholder='Enter Your Message...' />
                    <InputRightElement>
                        <IoSendSharp onClick={handleSendMessage} cursor={'pointer'} />
                    </InputRightElement>
                </InputGroup>
            </form>}

        </>
    )
}

export default MessageInput
