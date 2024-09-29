import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { makeRequest } from '../Utils/api'
import { useToast } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { userAtom } from '../Atoms/user'

const UserProfileCard = ({ userName, fullName, avatar, followed, userId, display }) => {
    const [followedState, setFollowedState] = useState(followed)
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const [user] = useRecoilState(userAtom)

    const handleFollow = async () => {
        setLoading(true)
        setFollowedState(!followedState)

        const response = await makeRequest(`users/follow/${userId}`, { method: "POST" })

        if (response.error) {
            toast({
                title: 'Error',
                description: response.error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            setFollowedState(followed) // Revert state if there's an error
        } else {
            toast({
                title: 'Success',
                description: followedState ? "Unfollowed User" : "Followed User",
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        }
        setLoading(false)
    }

    return (
        <Flex display={display} alignItems="center" justifyContent="space-between" mb={5}>
            <Flex alignItems="center">
                <Avatar src={avatar} size="md" />
                <Box ml={1} mr={2}>
                    <Link to={`/profile/${userName}`}>
                        <Text fontWeight="bold" >{userName}</Text>
                    </Link>
                    <Text lineHeight={1} color="gray.500" fontSize="sm" >{fullName?.slice(0, 30)}{fullName?.length >= 30 && '...'}</Text>
                </Box>
            </Flex>
            {user._id !== userId &&
                <Button
                    onClick={handleFollow}
                    isLoading={loading}
                    backgroundColor={!followedState ? "blue.500" : "gray.400"}
                    color="white"
                >
                    {followedState ? 'Unfollow' : 'Follow'}
                </Button>
            }
        </Flex>
    )
}

export default UserProfileCard
