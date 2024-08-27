import React from 'react'
import { useParams } from 'react-router-dom'
import { Avatar, Box, Button, Divider, Flex, Image, Img, Text, useColorMode } from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { Actions, Comment } from '../components'



const PostPage = () => {
    const { userId, pId } = useParams()
    const { colorMode } = useColorMode()


    const postTitle = 'This is a sample post title'
    const postImg = '/post1.png'




    return (
        <Flex flexDirection={'column'}>
            <Flex flex={1} gap={2} flexDirection={'column'}>
                <Flex justifyContent={'space-between'}>
                    <Flex alignItems={'center'}>
                        <Text size={'sm'} fontWeight={'bold'}  >markzuckerberg</Text>
                        <Img src='/verified.png' w={4} h={4} ml={1} />
                    </Flex>
                    <Flex alignItems={'center'}>
                        <Text size={'sm'} color={'gray.light'} mr={3}>1d</Text>
                        <BsThreeDots color={colorMode == 'dark' ? 'white' : 'gray'} cursor={'pointer'} />
                    </Flex>
                </Flex>

                <Link>
                    <Text fontSize={'md'} mb={3}>{postTitle}</Text>



                    {postImg &&
                        <Box
                            borderRadius={4}
                            overflow={'hidden'}
                            border={'1px solid'}
                            borderColor={'gray.light'}
                            cursor={'pointer'}
                        >
                            <Image w={'full'} src={postImg} />
                        </Box>
                    }

                </Link>

                <Actions />

                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'} fontSize={'sm'}>100 likes</Text>
                    <Box w={1} h={1} bg={'gray.light'} borderRadius={'full'} ></Box>
                    <Text color={'gray.light'} fontSize={'sm'}>144 replies</Text>
                </Flex>

            </Flex>


            <Divider my={4} />


            <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Flex alignItems={'center'} >
                    <Text fontSize={'2xl'}>👋</Text>
                    <Text fontSize={'md'} color={'gray.light'}>Get the app to like reply and post.</Text>
                </Flex>

                <Button>
                    Get
                </Button>
            </Flex>

            <Divider my={4}></Divider>


            <Comment
                commentText={'This is a sample comment'}
                createdAt={'2d'}
                likes={1}
                userName={'johndoe'}
                pfp='https://bit.ly/dan-abramov'
            />
          
            <Comment
                commentText={'This is a second comment'}
                createdAt={'6d'}
                likes={102}
                userName={'markwik'}
                pfp='https://bit.ly/dan-abramov'
            />
          
            <Comment
                commentText={'This is a third comment'}
                createdAt={'1w'}
                likes={1012}
                userName={'darinnunez'}
                pfp='https://bit.ly/dan-abramov'
            />
          
        </Flex>
    )
}

export default PostPage
