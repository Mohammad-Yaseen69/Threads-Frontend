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

            if(response.error){
                toast({
                    title: "Error",
                    description: response.error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            }else{
                setUser(response.response.data[0])
            }
        }

        getUserProfile()
    }, [userName])

    return (
        <div>
            <UserHeader
                userName = {user?.userName}
                fullName = {user?.name}
                avatar = {user?.pfp?.url}
                bio= {user?.bio}
                instagram = {user?.instagram}
                followers = {user?.followersCount}    
                followed={user?.followed} 
                userId={user?._id}       
                sameUser={user?._id === loggedinUser?._id}   
            />

            <UserPost userId={user?._id} likes='1221' replies='122' postImg='/post1.png' postTitle="this is first post" />
            <UserPost userId={user?._id} likes='121' replies='12' postImg='/post2.png' postTitle="this is secpnd post" />
            <UserPost userId={user?._id} likes='121' replies='12' postImg='/post3.png' postTitle="this is secpnd post" />
            <UserPost userId={user?._id} likes='12221' replies='1' postTitle="without img post" />


        </div>
    )
}

export default UserPage
