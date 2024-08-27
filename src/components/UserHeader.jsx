import { Avatar, Box, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, useColorMode, useToast, VStack } from '@chakra-ui/react'
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import React, { useState } from 'react'
import { color } from 'framer-motion'

const UserHeader = () => {
    const toast = useToast()
    const [activeTab, setActiveTab] = useState('threads')
    const {colorMode} = useColorMode()

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
                        Mark Zuckerberg
                    </Text>

                    <Flex alignItems={'center'} gap={2}>
                        <Text fontSize={'sm'}>markzuckerberg</Text>
                        <Text fontSize={'xs'} bg={'gray.dark'} color={'gray.light'} p={1} borderRadius={'full'}>
                            Threads.net
                        </Text>
                    </Flex>
                </Box>

                <Box>
                    <Avatar
                        name='mark zuckerberg'
                        src='../public/zuck-avatar.png'
                        size={"xl"}
                    />
                </Box>
            </Flex>

            <Text >Ceo of Facebook </Text>

            <Flex flexDirection={{
                base: 'column',
                sm: 'row'
            
            }} gap={3} justifyContent={'space-between'} w={'full'}>
                <Flex alignItems={'center'} gap={2}>
                    <Text color={'gray.light'}>3.7k followers</Text>
                    <Box w={1} h={1} borderRadius={'full'} bg={'gray.light'}></Box>
                    <Link color={'gray.light'}>instagram.com</Link>
                </Flex>

                <Flex alignItems={'center'}>
                    <Box w={'40px'} h={'40px'} className={colorMode === "dark" ?  'header-icons' : 'header-icons-light'}>
                        <BsInstagram size={24} color={colorMode == "light" ? "black" : 'white'} cursor={"pointer"} />
                    </Box>
                    <Box w={'40px'} h={'40px'} className={colorMode === "dark" ?  'header-icons' : 'header-icons-light'}>
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
                    <Text fontWeight={'bold'} color={activeTab == 'threads' ? colorMode == 'dark' ? 'white' : 'gray.dark': 'gray.light'}>Threads</Text>
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
