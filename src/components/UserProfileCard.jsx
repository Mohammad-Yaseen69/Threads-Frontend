import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { makeRequest } from '../Utils/api'
import { useToast } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const UserProfileCard = ({ userName, fullName, avatar, followed, userId }) => {
    const [followedState, setFollowedState] = useState(followed)
    const [loading, setLoading] = useState(false)
    const toast = useToast()

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
        <Flex alignItems="center" justifyContent="space-between" mb={4}>
            <Flex alignItems="center">
                <Avatar src={avatar} size="md" />
                <Box ml={1} mr={2}>
                    <Link to={`/profile/${userName}`}>
                        <Text fontWeight="bold" >{userName}</Text>
                    </Link>
                    <Text color="gray.500" fontSize="sm" >{fullName}</Text>
                </Box>
            </Flex>
            <Button
                onClick={handleFollow}
                isLoading={loading}
                backgroundColor={!followedState ? "blue.500" : "gray.400"}
                color="white"
            >
                {followedState ? 'Unfollow' : 'Follow'}
            </Button>
        </Flex>
    )
}

export default UserProfileCard
