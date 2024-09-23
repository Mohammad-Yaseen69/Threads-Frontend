import { Avatar, Box, Button, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, useColorMode, useToast, VStack } from '@chakra-ui/react'
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import React, { useEffect, useState } from 'react'
import { color } from 'framer-motion'
import { makeRequest } from '../Utils/api'
import { useNavigate } from 'react-router-dom'

const UserHeader = ({
    userName,
    bio,
    fullName,
    followers,
    instagram,
    avatar,
    followed,
    userId,
    sameUser
}) => {
    const toast = useToast()
    const [activeTab, setActiveTab] = useState('posts')
    const { colorMode } = useColorMode()
    const [followedState, setFollowedState] = useState(followed)
    const [followerState, setFollowerState] = useState(followers)
    const [followFormat, setFollowFormat] = useState("")
    const [loading, setLoading] = useState(false)
    const [convoLoading, setConvoLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setFollowedState(followed)
    }, [followed])

    useEffect(() => {
        setFollowerState(followers)
    }, [followers])


    const handleNavigateConversation = async () => {
        setConvoLoading(true)
        const response = await makeRequest(`chats/getOrCreateConversation/${userId}`, {
            method: "POST"
        });

        setConvoLoading(false)

        console.log(response)

        if (response.response) {
            const conversationId = response.response.conversationId;
            navigate(`/chat/${conversationId}`);
        }

        else {
            toast({
                title: 'Error',
                description: response.error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    };



    useEffect(() => {
        const changeFollowersFormat = () => {
            if (followerState > 1000000) {
                setFollowFormat((followerState / 1000000).toFixed(1) + 'm')
            }
            // write this function for changing followers formats to numbers to "k" "m"
            if (followerState > 1000) {
                setFollowFormat((followerState / 1000).toFixed(1) + 'k')
            }

            return setFollowFormat(followerState)
        }

        changeFollowersFormat()
    }, [followers, followedState])

    const handleFollow = async () => {
        if (followedState) {
            setFollowedState(false)
            setFollowerState(followerState - 1)
        } else {
            setFollowedState(true)
            setFollowerState(followerState + 1)
        }

        setLoading(true)
        const response = await makeRequest(`users/follow/${userId}`, {
            method: "POST"
        })

        if (response.error) {
            toast({
                title: 'Error',
                description: response.error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
        else {
            toast({
                title: 'Success',
                description: !followedState ? "User Followed" : "User Unfollowed",
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
            setLoading(false)
        }
    }


    const copyUrl = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                toast({ description: 'Link Copied' })
            })
            .catch((error) => {
                console.error('Error copying URL to clipboard:', error);
            });
    }
    return (

        <VStack gap={6} alignItems={'start'}>
            <Flex justifyContent={'space-between'} alignItems={'center'} w={'full'}>
                <Box>
                    <Text fontSize={'2xl'} fontWeight={700}>
                        {fullName}
                    </Text>

                    <Flex alignItems={'center'} gap={2}>
                        <Text fontSize={'sm'}>@{userName}</Text>
                    </Flex>
                </Box>

                <Box>
                    <Avatar
                        src={avatar}
                        size={"xl"}
                    />
                </Box>
            </Flex>

            <Text >{bio} </Text>

            {sameUser &&
                <Button onClick={() => navigate('/updateProfile')}>
                    Edit Profile
                </Button>
            }


            <Flex flexDirection={{
                base: 'column',
                sm: 'row'

            }} gap={3} justifyContent={'space-between'} w={'full'}>
                <Flex alignItems={'center'} gap={2}>
                    <Text color={'gray.light'}>{followFormat} followers</Text>
                </Flex>

                <Flex alignItems={'center'}>

                    {instagram &&
                        <a href={instagram} target='_blank'>
                            <Box w={'40px'} h={'40px'} className={colorMode === "dark" ? 'header-icons' : 'header-icons-light'}>
                                <BsInstagram size={24} color={colorMode == "light" ? "black" : 'white'} cursor={"pointer"} />
                            </Box>
                        </a>
                    }

                    <Box w={'40px'} h={'40px'} className={colorMode === "dark" ? 'header-icons' : 'header-icons-light'}>
                        <Menu>
                            <MenuButton>
                                <CgMoreO className='icon' size={24} color={colorMode == "light" ? "black" : 'white'} cursor={"pointer"} />
                            </MenuButton>
                            <Portal>
                                <MenuList bg={colorMode == 'dark' ? 'gray.dark' : 'gray.light'}>
                                    <MenuItem onClick={copyUrl} bg={colorMode == 'dark' ? 'gray.dark' : 'gray.light'}>Copy Link</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>

            <Flex alignItems={'center'} gap={4}>
                {!sameUser &&
                    <Button
                        isLoading={loading}
                        _hover={!followedState && "blue.600"}
                        onClick={handleFollow}
                        backgroundColor={!followedState && "blue.700"}>
                        {followedState ? "Unfollow" : "Follow"}
                    </Button>
                }
                {!sameUser &&
                    <Button isLoading={convoLoading} onClick={handleNavigateConversation}>
                        Message
                    </Button>
                }
            </Flex>

            <Flex w='full'>
                <Flex
                    flex={1}
                    borderBottom={activeTab == 'posts' ? colorMode == 'dark' ? '1.5px solid white' : '2px solid black' : '1px solid gray'}
                    justifyContent={'center'} pb='3'
                    cursor={'pointer'}
                    onClick={() => setActiveTab('posts')}
                    transition={'all 0.3s'}
                >
                    <Text fontWeight={'bold'} color={activeTab == 'posts' ? colorMode == 'dark' ? 'white' : 'gray.dark' : 'gray.light'}>Posts</Text>
                </Flex>
            </Flex>
        </VStack>
    )
}

export default UserHeader
