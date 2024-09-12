import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserHeader, UserPost } from '../components'
import { makeRequest } from '../Utils/api'
import { Flex, Spinner, useToast } from '@chakra-ui/react'
import { useRecoilState } from 'recoil'
import { userAtom } from '../Atoms/user'
import { toastingSytex } from '../Helper/toastingSyntext'

const UserPage = () => {
    const { userName } = useParams()
    const [user, setUser] = useState()
    const [posts, setPosts] = useState()
    const [loggedinUser] = useRecoilState(userAtom)
    const [loading, setLoading] = useState(true)
    const toast = useToast()

    useEffect(() => {
        async function getUserProfile() {
            setLoading(true)
            const response = await makeRequest(`users/profile/${userName}`)

            if (response.error) {
                toast({
                    title: "Error",
                    description: response.error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                setUser(response.response.data[0])
                setPosts(response.response.data[0]?.posts)
            }

            setLoading(false)
        }

        getUserProfile()
    }, [userName])

    console.log(user)

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

    const handleDeletePost = async (postId) => {
        const response = await makeRequest(`posts/delete/${postId}`, {
            method: "DELETE"
        })

        if (response.error) {
            toastingSytex(toast, "error", "Error", response.error.message)
        }

        toastingSytex(toast, "success", "Success", response.response.message)
        setPosts(posts.filter(post => post._id !== postId))
    }

    return (
        <div style={{ marginBottom: "10px" }}>
            {loading &&
                <Flex width={'100%'} height={'80vh'} alignItems={'center'} justifyContent={'center'}>
                    <Spinner />
                </Flex>
            }

            {!loading &&
                <>

                    <UserHeader
                        userName={user?.userName}
                        fullName={user?.name}
                        avatar={user?.pfp?.url}
                        bio={user?.bio}
                        instagram={user?.instagram}
                        followers={user?.followersCount}
                        followed={user?.followed}
                        userId={user?._id}
                        sameUser={user?._id === loggedinUser?._id}
                    />

                    {posts?.map((post) => {
                        const likeCount = post?.likes.length
                        const liked = post?.likes.includes(loggedinUser?._id)
                        const replyCount = post?.replies.length
                        const relativeTime = getRelativeTime(new Date(post?.createdAt))
                        const repliesUser = post?.replies?.slice(0, 3)


                        return (
                            <>
                                <UserPost
                                    key={post?._id}
                                    userId={user?._id}
                                    likes={likeCount}
                                    replies={replyCount}
                                    postImg={post.postImg?.url}
                                    postTitle={post.postTitle}
                                    liked={liked}
                                    postId={post._id}
                                    date={relativeTime}
                                    userAvatar={post?.postedBy?.pfp?.url}
                                    userName={post?.postedBy?.userName}
                                    repliesUser={repliesUser}
                                    handleDeletePost={handleDeletePost}
                                />
                            </>
                        )
                    })}
                </>

            }

        </div>
    )
}

export default UserPage
