import { Avatar, Divider, Flex, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Message, MessageInput } from './'

const MessageConversation = () => {
    const [messages, setMessages] = useState([])
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
                <Avatar size={'sm'} src={''} />
                <Text fontWeight={'bold'}>Dan Abramov</Text>
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
                {false &&
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

                {/* {messages.map((message) => (
                    <Message message={message} key={message._id} />
                ))} */}

                <Message ownMessage={true} />
                <Message ownMessage={false} />
                <Message ownMessage={false} />
                <Message ownMessage={true} />
                <Message ownMessage={false} />


            </Flex>
            <MessageInput />
        </Flex>
    )
}

export default MessageConversation
