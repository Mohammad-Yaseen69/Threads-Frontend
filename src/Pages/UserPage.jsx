import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserHeader, UserPost } from '../components'
import { makeRequest } from '../Utils/api'
import { useToast } from '@chakra-ui/react'
import { useRecoilState } from 'recoil'
import { userAtom } from '../Atoms/user'

const UserPage = () => {
    const { userName } = useParams()
    const [user, setUser] = useState()
    const [loggedinUser] = useRecoilState(userAtom)
    const toast = useToast()

    useEffect(() => {
        async function getUserProfile() {
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
            }
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

    return (
        <div style={{ marginBottom: "10px" }}>
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

            {user?.posts?.map((post) => {
                const likeCount = post?.likes.length
                const liked = post?.likes.includes(loggedinUser?._id)
                const replyCount = post?.replies.length
                const relativeTime = getRelativeTime(new Date(post?.createdAt))
                const repliesUser = post?.replies?.slice(0, 2)

                return (
                    <>
                        <UserPost
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
                        />
                    </>
                )
            })}

        </div>
    )
}

export default UserPage
