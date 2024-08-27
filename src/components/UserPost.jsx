import { Avatar, Box, Flex, Image, Img, Text, useColorMode } from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { Actions } from './'

const UserPost = ({ likes, replies, postImg, postTitle , userId}) => {
    const { colorMode } = useColorMode()
    return (
        <Flex gap={3} pt={5} pb={5}>
            <Flex align={'center'} flexDirection={'column'}>
                <Avatar
                    size={'md'}
                    name='Mark ZuckerBerg'
                    src='../public/zuck-avatar.png'
                    mb={2}
                />

                <Box style={{ width: '1px' }} h={'full'} bg={'gray.light'}></Box>

                <Box position={"relative"} w={"full"}>
                    <Avatar
                        size='xs'
                        name='John doe'
                        src='https://bit.ly/dan-abramov'
                        position={"absolute"}
                        top={"0px"}
                        left='15px'
                        padding={"2px"}
                    />
                    <Avatar
                        size='xs'
                        name='John doe'
                        src='https://bit.ly/sage-adebayo'
                        position={"absolute"}
                        bottom={"0px"}
                        right='-5px'
                        padding={"2px"}
                    />
                    <Avatar
                        size='xs'
                        name='John doe'
                        src='https://bit.ly/prosper-baba'
                        position={"absolute"}
                        bottom={"0px"}
                        left='4px'
                        padding={"2px"}
                    />
                </Box>
            </Flex>


            <Flex flex={1} gap={2} flexDirection={'column'}>
                <Flex justifyContent={'space-between'}>
                    <Flex alignItems={'center'}>
                        <Text size={'sm'} fontWeight={'bold'}  >markzuckerberg</Text>
                        <Img src='../public/verified.png' w={4} h={4} ml={1} />
                    </Flex>
                    <Flex alignItems={'center'}>
                        <Text size={'sm'} color={'gray.light'} mr={3}>1d</Text>
                        <BsThreeDots color={colorMode == 'dark' ? 'white' : 'gray'} cursor={'pointer'} />
                    </Flex>
                </Flex>

                <Link to={`/${userId}/post/12121`}>
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
        </Flex>
    )
}

export default UserPost