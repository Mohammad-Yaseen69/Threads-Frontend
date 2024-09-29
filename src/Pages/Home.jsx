import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import React from 'react';
import { makeRequest } from '../Utils/api';
import { Flex, Stack, Box, Heading, SkeletonText, SkeletonCircle, Skeleton, Image } from '@chakra-ui/react';
import { Post, UserProfileCard } from "../components";
import { userAtom } from '../Atoms/user';

const Home = () => {
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [posts, setPosts] = useState([]);
    const [loggedinUser] = useRecoilState(userAtom);
    const [suggestedUsers, setSuggestedUsers] = useState([]);

    useEffect(() => {
        const getFeed = async () => {
            const response = await makeRequest('users/feed', { method: "GET" });
            setPosts(response.response.data);
            setLoadingPosts(false);
        }

        const getSuggestedUsers = async () => {
            const response = await makeRequest('users/suggested', { method: "GET" });
            setSuggestedUsers(response.response.data);
            setLoadingUsers(false);
        }

        Promise.all([getFeed(), getSuggestedUsers()]);
    }, []);

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
        <Flex
            flexDirection={{
                base: 'column',
                md: 'row'
            }}
            width={{
                base: 'full',
                lg: '750px'
            }}
            position={'absolute'}
            left={'50%'}
            transform={'translateX(-50%)'}
            p={3}
        >
            <Box display={{
                base: 'block',
                md: 'none'
            }} flex={1} mb={5} mt={4} ml={{
                base: 0,
                md: 4
            }}>
                <Heading as="h3" size="md" mb={4}>Suggested Users</Heading>
                {loadingUsers ? (
                    <SkeletonText noOfLines={3} spacing="4" />
                ) : (
                    suggestedUsers.map(user => (
                        <UserProfileCard
                            key={user?._id}
                            userId={user?._id}
                            userName={user?.userName}
                            fullName={user?.name}
                            avatar={user?.pfp?.url}
                            followed={user?.isFollowed}
                        />
                    ))
                )}
            </Box>

            <Stack flex={3}>
                {loadingPosts ? (
                    <Stack mt={7} spacing={6}>
                        {Array(3).fill("").map((_, index) => (
                            <Flex key={index} gap={3}>
                                <SkeletonCircle size="10" />
                                <Flex direction="column" flex="1">
                                    <SkeletonText noOfLines={1} width={"50%"} mt={3} mb={6} />
                                    <Flex justifyContent={'space-between'}>
                                        <SkeletonText noOfLines={1} width={"50%"} />
                                        <SkeletonText noOfLines={1} width={"15%"} />
                                    </Flex>
                                    <Skeleton borderRadius={4} height="200px" mt={4} />
                                </Flex>
                            </Flex>
                        ))}
                    </Stack>
                ) : (
                    posts.map((post) => {
                        const likeCount = post?.likes.length;
                        const liked = post?.likes.includes(loggedinUser?._id);
                        const replyCount = post?.replies.length;
                        const relativeTime = getRelativeTime(new Date(post?.createdAt));
                        const repliesUser = post?.replies?.slice(0, 3);

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
            <Box
                display={{
                    base: 'none',
                    md: 'block'
                }}
                flex={loadingPosts || loadingUsers ? 2 : 1}
                mb={5}
                mt={4}
                ml={{
                    base: 0,
                    md: 4
                }}
                minW={250}
                maxW={250}
            >
                <Heading as="h3" size="md" mb={4}>Suggested Users</Heading>
                {loadingUsers ? (
                    <SkeletonText noOfLines={3} spacing="4" />
                ) : (
                    suggestedUsers.map(user => (
                        <UserProfileCard
                            key={user?._id}
                            userId={user?._id}
                            userName={user?.userName}
                            fullName={user?.name}
                            display={user?.userName?.length > 15 ? "none" : "flex"}
                            avatar={user?.pfp?.url}
                            followed={user?.isFollowed}
                        />
                    ))
                )}
            </Box>
        </Flex>
    );
};

export default Home;