import { Avatar, Box, Button, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, useColorMode, useToast, VStack } from '@chakra-ui/react'
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import React, { useEffect, useState } from 'react'
import { color } from 'framer-motion'
import { makeRequest } from '../Utils/api'

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
    const [activeTab, setActiveTab] = useState('threads')
    const { colorMode } = useColorMode()
    const [followedState, setFollowedState] = useState(followed)
    const [followerState, setFollowerState] = useState(followers)
    const [followFormat, setFollowFormat] = useState("")

    useEffect(() => {
        setFollowedState(followed)
    }, [followed])

    useEffect(() => {
        setFollowerState(followers)
    }, [followers])



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
                        <Text fontSize={'sm'}>{userName}</Text>
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

            <Flex flexDirection={{
                base: 'column',
                sm: 'row'

            }} gap={3} justifyContent={'space-between'} w={'full'}>
                <Flex alignItems={'center'} gap={2}>
                    <Text color={'gray.light'}>{followFormat} followers</Text>
                    {!sameUser &&
                        <Button _hover={!followedState && "blue.600"} onClick={handleFollow} backgroundColor={!followedState && "blue.700"}>
                            {followedState ? "Unfollow" : "Follow"}
                        </Button>
                    }
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

            <Flex w='full'>
                <Flex
                    flex={1}
                    borderBottom={activeTab == 'threads' ? colorMode == 'dark' ? '1.5px solid white' : '2px solid black' : '1px solid gray'}
                    justifyContent={'center'} pb='3'
                    cursor={'pointer'}
                    onClick={() => setActiveTab('threads')}
                    transition={'all 0.3s'}
                >
                    <Text fontWeight={'bold'} color={activeTab == 'threads' ? colorMode == 'dark' ? 'white' : 'gray.dark' : 'gray.light'}>Threads</Text>
                </Flex>
                <Flex
                    flex={1}
                    borderBottom={activeTab == 'replies' ? colorMode == 'dark' ? '1.5px solid white' : '2px solid black' : '1px solid gray'}
                    justifyContent={'center'}
                    pb='3'
                    cursor={'pointer'}
                    onClick={() => setActiveTab('replies')}
                    transition={'all 0.3s'}
                >
                    <Text fontWeight={'bold'} color={activeTab == 'replies' ? colorMode == 'dark' ? 'white' : 'gray.dark' : 'gray.light'}>Replies</Text>
                </Flex>
            </Flex>
        </VStack>
    )
}

export default UserHeader
