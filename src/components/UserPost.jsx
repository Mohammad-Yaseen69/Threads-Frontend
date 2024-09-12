import { Button, useToast } from '@chakra-ui/react'
import { Avatar, Box, Flex, Image, Img, Text, useColorMode } from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { Actions } from './'
import { useState } from 'react'
import { makeRequest } from '../Utils/api'
import { toastingSytex } from "../Helper/toastingSyntext"
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useRecoilState } from 'recoil'
import { userAtom } from '../Atoms/user'

const UserPost = ({ likes, replies, postImg, postTitle, userName, userId, liked, postId, userAvatar, date, repliesUser , handleDeletePost }) => {
    const { colorMode } = useColorMode()
    const [likedState, setLikedState] = useState(liked);
    const [likesState, setLikesState] = useState(likes)
    const toast = useToast()
    const [user] = useRecoilState(userAtom)
    const [loading, Setloading] = useState(false)

    console.log(repliesUser)

    async function handleLike() {
        setLikedState(!likedState);
        if (likedState) {
            setLikesState(likesState - 1);
        } else {
            setLikesState(likesState + 1);
        }

        const response = await makeRequest(`posts/like/${postId}`, {
            method: "POST"
        })

        if (response.error) {
            toastingSytex(toast, "error", "Error", response.error.message)
        }

        console.log(response.response.message)
    }

    const handleDelete = async () => {
        Setloading(true)
        const response = await handleDeletePost(postId)
        Setloading(false)
    }

    return (
        <Flex gap={3} pt={5} pb={5}>
            <Flex align={'center'} flexDirection={'column'}>
                <Avatar
                    size={'md'}
                    src={userAvatar}
                    mb={2}
                />

                <Box style={{ width: '1px' }} h={'full'} bg={'gray.light'}></Box>

                <Box position={"relative"} w={"full"}>

                    {repliesUser && (
                        <>
                            <Avatar
                                size='xs'
                                src={repliesUser[0]?.pfp}
                                position={"absolute"}
                                top={"0px"}
                                left='15px'
                                padding={"2px"}
                            />


                            {repliesUser[1]?.pfp && <Avatar
                                size='xs'
                                src={repliesUser[1]?.pfp}
                                position={"absolute"}
                                bottom={"0px"}
                                right='-5px'
                                padding={"2px"}
                            />}

                            {repliesUser[2]?.pfp && <Avatar
                                size='xs'
                                src={repliesUser[2]?.pfp}
                                position={"absolute"}
                                bottom={"0px"}
                                left='4px'
                                padding={"2px"}
                            />}
                        </>
                    )}
                </Box>
            </Flex>


            <Flex flex={1} gap={2} flexDirection={'column'}>
                <Flex justifyContent={'space-between'}>
                    <Flex alignItems={'center'}>
                        <Link to={`/profile/${userName}`} ><Text size={'sm'} fontWeight={'bold'}  >{userName}</Text></Link>
                    </Flex>
                    <Flex alignItems={'center'}>
                        <Text size={'sm'} color={'gray.light'} mr={3}>{date}</Text>
                        {/* <BsThreeDots color={colorMode == 'dark' ? 'white' : 'gray'} cursor={'pointer'} /> */}



                        {user?._id === userId &&
                            <Button onClick={handleDelete} padding={0}>
                                <RiDeleteBin5Fill fontSize={'1.5rem'} color={'red'} cursor={'pointer'} />
                            </Button>
                        }
                    </Flex>
                </Flex>

                <Link to={`/post/${postId}`}>
                    <Text fontSize={'md'} mb={3}>{postTitle}</Text>



                    {postImg &&
                        <Box
                            borderRadius={4}
                            overflow={'hidden'}
                            border={'1px solid'}
                            borderColor={'gray.light'}
                            cursor={'pointer'}
                            maxH={'500px'}
                        >
                            <Image w={'full'} src={postImg} />
                        </Box>
                    }

                </Link>

                <Actions handleLike={handleLike} liked={likedState} />

                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'} fontSize={'sm'}>{likesState} likes</Text>
                    <Box w={1} h={1} bg={'gray.light'} borderRadius={'full'} ></Box>
                    <Text color={'gray.light'} fontSize={'sm'}>{replies} replies</Text>
                </Flex>

            </Flex>
        </Flex>
    )
}

export default UserPost