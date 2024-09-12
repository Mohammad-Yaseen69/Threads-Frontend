import { useRecoilState } from 'recoil'
import { useEffect, useState } from 'react'
import React from 'react'
import { makeRequest } from '../Utils/api'
import { Flex, Spinner, Stack } from '@chakra-ui/react'
import { Post } from "../components"
import { userAtom } from '../Atoms/user'


const Home = () => {
    const [loading, Setloading] = useState(true)
    const [posts, setPosts] = useState([])
    const [loggedinUser] = useRecoilState(userAtom)

    useEffect(() => {
        const getFeed = async () => {
            Setloading(true)
            const response = await makeRequest('users/feed', {
                method: "GET"
            })

            setPosts(response.response.data)
            Setloading(false)
        }

        getFeed()
    }, [])


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

    
    return (
        <div>
            <Stack>
                {
                    loading ?
                    <Flex height={'80vh'} alignItems={'center'} justifyContent={'center'} >
                        <Spinner />
                    </Flex> 
                     : posts.map((post) => {
                        const likeCount = post?.likes.length
                        const liked = post?.likes.includes(loggedinUser?._id)
                        const replyCount = post?.replies.length
                        const relativeTime = getRelativeTime(new Date(post?.createdAt))
                        const repliesUser = post?.replies?.slice(0, 3)
                        
                        return (
                            <>
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
                            </>
                        )
                    })
                }
            </Stack>
        </div>
    )
}

export default Home
