import { useRecoilState } from 'recoil'
import { useEffect, useState } from 'react'
import React from 'react'
import { makeRequest } from '../Utils/api'
import { Flex, Spinner, Stack, Box, Heading } from '@chakra-ui/react'
import { Post , UserProfileCard} from "../components"
import { userAtom } from '../Atoms/user'
  // Import the new component


const Home = () => {
    const [loading, Setloading] = useState(true)
    const [posts, setPosts] = useState([])
    const [loggedinUser] = useRecoilState(userAtom)
    const [suggestedUsers, setSuggestedUsers] = useState([])

    useEffect(() => {
        const getFeed = async () => {
            Setloading(true)
            const response = await makeRequest('users/feed', { method: "GET" })
            setPosts(response.response.data)
            Setloading(false)
        }

        const getSuggestedUsers = async () => {
            Setloading(true)
            const response = await makeRequest('users/suggested', { method: "GET" })
            setSuggestedUsers(response.response.data)
            Setloading(false)
        }

        getSuggestedUsers()
        getFeed()
    }, [])

    const getRelativeTime = (date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        const timeIntervals = {
            year: 31536000,  
            month: 2592000,  
            week: 604800,    
            day: 86400,      
            hour: 3600,      
            minute: 60,
            second: 1
        };

        for (const [unit, secondsInUnit] of Object.entries(timeIntervals)) {
            const interval = Math.floor(diffInSeconds / secondsInUnit);

            if (interval >= 1) {
                return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-interval, unit);
            }
        }

        return "just now";
    }

    return (
        <Flex>
            <Stack flex={3}>
                {loading ? (
                    <Flex height={'80vh'} alignItems={'center'} justifyContent={'center'}>
                        <Spinner />
                    </Flex>
                ) : (
                    posts.map((post) => {
                        const likeCount = post?.likes.length
                        const liked = post?.likes.includes(loggedinUser?._id)
                        const replyCount = post?.replies.length
                        const relativeTime = getRelativeTime(new Date(post?.createdAt))
                        const repliesUser = post?.replies?.slice(0, 3)

                        return (
                            <Post
                                key={post?._id}
                                userId={post?.user[0]._id}
                                likes={likeCount}
                                replies={replyCount}
                                postImg={post.postImg?.url}
                                postTitle={post.postTitle}
                                liked={liked}
                                postId={post._id}
                                date={relativeTime}
                                userAvatar={post?.user[0]?.pfp?.url}
                                userName={post?.user[0]?.userName}
                                repliesUser={repliesUser}
                            />
                        )
                    })
                )}
            </Stack>

            {/* Suggested Users Section */}
            <Box flex={1} mt={4} ml={4}>
                <Heading as="h3" size="md" mb={4}>Suggested Users</Heading>
                {suggestedUsers.map(user => (
                    <UserProfileCard
                        key={user?._id}
                        userId={user?._id}
                        userName={user?.userName}
                        fullName={user?.name}
                        avatar={user?.pfp?.url}
                        followed={user?.isFollowed}
                    />
                ))}
            </Box>
        </Flex>
    )
}

export default Home
