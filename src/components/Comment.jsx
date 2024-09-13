import { Avatar, Button, Divider, Flex, Image, Text, useColorMode } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Actions } from '../components'
import { useRecoilState } from 'recoil'
import { userAtom } from '../Atoms/user'
import { makeRequest } from '../Utils/api'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { Link } from 'react-router-dom'

const Comment = ({ createdAt, reply, postId, handleDelete }) => {
    const { colorMode } = useColorMode()
    const [likes, setLikes] = useState(reply?.likes?.length || 0)
    const [user] = useRecoilState(userAtom)
    const [liked, setLiked] = useState(reply?.likes?.includes(user?._id) || false)
    const [loading, setLoading] = useState(false)

    const handleLike = async () => {
        setLiked(!liked)
        if (!liked) {
            setLikes(likes + 1)
        } else {
            setLikes(likes - 1)
        }

        const response = await makeRequest(`posts/reply/like/${postId}/${reply._id}`, {
            method: "POST"
        })
    }
   

    return (
        <Flex gap={2}>
            <Avatar size='md' src={reply?.pfp} />

            <Flex flex={1} gap={2} flexDirection={'column'}>
                <Flex justifyContent={'space-between'}>
                    <Flex alignItems={'center'}>
                        <Link to={'/profile/'+ reply?.userName}>

                            <Text fontSize={'sm'} fontWeight={'bold'}  >{reply?.userName}</Text>
                        </Link>
                    </Flex>
                    <Flex alignItems={'center'}>
                        <Text size={'sm'} color={'gray.light'} mr={3}>{createdAt}</Text>
                        {user?._id === reply?.userId &&
                            <Button isLoading={loading} onClick={() => handleDelete(reply?._id, setLoading, loading)} padding={0}>
                                <RiDeleteBin5Fill fontSize={'1.5rem'} color={'red'} cursor={'pointer'} />
                            </Button>
                        }
                    </Flex>
                </Flex>


                <Text fontSize={'md'}>{reply?.text}</Text>

                <Actions isComment={true} handleLike={handleLike} liked={liked} />

                <Text color={'gray.light'} fontSize={'sm'}>{likes} likes</Text>


                <Divider my={3} />
            </Flex>

        </Flex>
    )
}

export default Comment
