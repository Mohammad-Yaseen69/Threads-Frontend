import { Avatar, Box, Flex, Menu, MenuButton, MenuItem, MenuList, Text, useColorMode } from '@chakra-ui/react'
import { CgMoreVertical } from 'react-icons/cg'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Message = ({ ownMessage, message, otherUserInfo, UserInfo, handleDeleteMessage, messageId }) => {
    const { colorMode } = useColorMode()
    const navigate = useNavigate()

    return (
        <Flex
            justifyContent={ownMessage ? 'flex-end' : 'flex-start'}
            gap={2}
            position='relative'
            _hover={{ '.menu-icon': { display: 'block' } }}
        >
            {!ownMessage && (
                <Avatar cursor={'pointer'} onClick={() => navigate(`/profile/${otherUserInfo?.userName}`)} size={'sm'} src={otherUserInfo?.pfp?.url} />
            )}

            <Flex alignItems='center'>


                {ownMessage && (
                    <Menu colorScheme='black'>
                        <MenuButton
                            as={Box}
                            className='menu-icon'
                            display='none'
                            ml={2}
                            _hover={{ cursor: 'pointer' }}
                            position='relative'
                        >
                            <CgMoreVertical size={15} color={colorMode === 'light' ? 'black' : 'white'} />
                        </MenuButton>
                        <MenuList
                            bg={'gray.900'}
                            borderRadius='md'
                            boxShadow='md'
                            position='absolute'
                            top='100%'
                            right={-10}
                            // p={0}
                            border={'1px solid white'}
                        >
                            <MenuItem bg={'gray.900'} onClick={() => handleDeleteMessage(messageId)}>Delete Message</MenuItem>
                        </MenuList>
                    </Menu>
                )}
            </Flex>

            <Text
                maxW={'350px'}
                bg={ownMessage ? 'blue.500' : 'gray.600'}
                p={1}
                borderRadius={"md"}
            >
                {message}
            </Text>

            {ownMessage && (
                <Avatar cursor={'pointer'} onClick={() => navigate(`/profile/${UserInfo?.userName}`)} size={'sm'} src={UserInfo?.pfp?.url} />
            )}
        </Flex>
    )
}

export default Message
