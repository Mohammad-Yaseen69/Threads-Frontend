import { useState } from 'react'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, Box, Button, Divider, Flex, Image, Img, Input, Spinner, Text, useColorMode, useToast } from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { Actions, Comment } from '../components'
import { makeRequest } from '../Utils/api'
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useRecoilState } from 'recoil'
import { userAtom } from '../Atoms/user'
import { toastingSytex } from '../Helper/toastingSyntext'



const PostPage = () => {
    const { postId } = useParams()
    const [post, setPost] = useState(null)
    const [date, setDate] = useState(null)
    const [liked, setLiked] = useState(null)
    const [likesCount, setLikesCount] = useState(null)
    const [repliesCount, setRepliesCount] = useState(null)
    const [user] = useRecoilState(userAtom)
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const toast = useToast()
    const navigate = useNavigate()

    const getRelativeTime = (date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000); // Difference in seconds

        // Define the time units and their corresponding seconds
        const timeIntervals = {
            year: 31536000,  // 365 * 24 * 60 * 60
            month: 2592000,  // 30 * 24 * 60 * 60
            week: 604800,    // 7 * 24 * 60 * 60
            day: 86400,      // 24 * 60 * 60
            hour: 3600,      // 60 * 60
            minute: 60,
            second: 1
        };

        for (const [unit, secondsInUnit] of Object.entries(timeIntervals)) {
            const interval = Math.floor(diffInSeconds / secondsInUnit);

            if (interval >= 1) {
                return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-interval, unit);
            }
        }



        return "just now"; // If less than a second
    };


    useEffect(() => {


        async function getPost() {
            setPageLoading(true)
            const response = await makeRequest(`posts/${postId}`)

            if (response.error) {
                console.log(response.error)
            }

            if (response.response.data[0]) {
                setPost(response.response.data[0])
                setDate(getRelativeTime(new Date(response.response.data[0].createdAt)))
                setLikesCount(response.response.data[0].likesCount)
                setRepliesCount(response.response.data[0].repliesCount)
                setLiked(response.response.data[0].likedByMe)
                setComments(response.response.data[0].replies)
            }

            setPageLoading(false)

        }

        getPost()
    }, [])

    const handleDeletePost = async () => {
        setLoading(true)
        const response = await makeRequest(`posts/delete/${postId}`, {
            method: "DELETE"
        })

        if (response.response) {
            setLoading(false)
            navigate('/')
        }
    }

    const handleLike = async () => {
        if (liked) {
            setLiked(false)
            setLikesCount(likesCount - 1)
        } else {
            setLiked(true)
            setLikesCount(likesCount + 1)
        }

        const response = await makeRequest(`posts/like/${postId}`, {
            method: "POST"
        })
    }



    const handleAddComment = async (e) => {
        e.preventDefault();

        if (comment.trim()) {
            const response = await makeRequest(`posts/reply/${postId}`, {
                method: "POST",
                data: { text: comment }
            });

            if (response.error) {
                toastingSytex(toast, 'error', response.error.message);
            } else if (response.response) {
                // Use the spread operator to add the new comment without mutating the state
                setComments([response.response.data, ...comments]);
                setComment('');  // Clear the input after successful submission
            }
        }
    };

    const deleteComment = async (commentId, setloading, loading) => {
        setloading(true)
        const response = await makeRequest(`posts/reply/${postId}/${commentId}`, {
            method: "DELETE"
        });

        if (response.response) {
            setloading(false)
            // Filter out the deleted comment
            setComments(comments.filter((comment) => comment._id !== commentId));
        }
    };

    console.log(post)

   

    return !pageLoading ?
        (<Flex flexDirection={'column'}>
            <Flex flex={1} gap={2} flexDirection={'column'}>
                <Flex justifyContent={'space-between'}>
                    <Flex alignItems={'center'} gap={3}>
                        <Avatar size={'md'} src={post?.postedBy[0]?.pfp?.url} />
                        <Link to={`/profile/${post?.postedBy[0]?.userName}`}>
                            <Text size={'sm'} fontWeight={'bold'}  >{post?.postedBy[0]?.userName}</Text>
                        </Link>
                    </Flex>
                    <Flex alignItems={'center'}>
                        <Text size={'sm'} color={'gray.light'} mr={3}>{date}</Text>
                        {user?._id === post?.postedBy[0]._id &&
                            <Button isLoading={loading} onClick={handleDeletePost} padding={0}>
                                <RiDeleteBin5Fill fontSize={'1.5rem'} color={'red'} cursor={'pointer'} />
                            </Button>
                        }
                    </Flex>
                </Flex>

                <Link>
                    <Text fontSize={'md'} mb={3}>{post?.postTitle}</Text>



                    {post?.postImg &&
                        <Box
                            borderRadius={4}
                            overflow={'hidden'}
                            border={'1px solid'}
                            borderColor={'gray.light'}
                            cursor={'pointer'}
                        >
                            <Image w={'full'} src={post?.postImg?.url} />
                        </Box>
                    }

                </Link>

                <Actions handleLike={handleLike} liked={liked} />

                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'} fontSize={'sm'}>{likesCount} likes</Text>
                    <Box w={1} h={1} bg={'gray.light'} borderRadius={'full'} ></Box>
                    <Text color={'gray.light'} fontSize={'sm'}>{repliesCount} replies</Text>
                </Flex>

            </Flex>


            <Divider my={4} />


            {/* ADD Comment Field */}

            <Flex as="form" onSubmit={handleAddComment} gap={3} flexDirection={'row'} mb={4}>
                <Flex flex={4} gap={2}>
                    <Avatar name={user?.userName} src={user?.pfp?.url} />
                    <Input

                        placeholder="Write a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </Flex>
                <Button flex={1} type="submit" disabled={!comment?.trim()}>
                    Post
                </Button>
            </Flex>
            <Divider my={4}></Divider>



            {comments?.map((reply) => [
                <Comment
                    reply={reply}
                    key={reply._id}
                    createdAt={getRelativeTime(new Date(reply?.createdAt))}
                    postId={postId}
                    handleDelete={deleteComment}
                />
            ])}

        </Flex>) : 
        (<Flex width={'100%'} height={'80vh'} alignItems={'center'} justifyContent={'center'}>
            <Spinner />
        </Flex>)

}

export default PostPage
