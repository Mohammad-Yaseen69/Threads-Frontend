import { Avatar, Divider, Flex, Image, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Actions } from '../components'

const Comment = ({ commentText , userName , likes , createdAt, pfp}) => {
    const { colorMode } = useColorMode()

    return (
        <Flex gap={2}>
            <Avatar size='md' src={pfp} name='Mark Zuck' />

            <Flex flex={1} gap={2} flexDirection={'column'}>
                <Flex justifyContent={'space-between'}>
                    <Flex alignItems={'center'}>
                        <Text fontSize={'sm'} fontWeight={'bold'}  >{userName}</Text>
                        <Image src='/verified.png' w={4} h={4} ml={1} />
                    </Flex>
                    <Flex alignItems={'center'}>
                        <Text size={'sm'} color={'gray.light'} mr={3}>{createdAt}</Text>
                        <BsThreeDots color={colorMode == 'dark' ? 'white' : 'gray'} cursor={'pointer'} />
                    </Flex>
                </Flex>


                <Text fontSize={'md'}>{commentText}</Text>

                <Actions />

                <Text color={'gray.light'} fontSize={'sm'}>{likes} likes</Text>


                <Divider my={3} />
            </Flex>

        </Flex>
    )
}

export default Comment
