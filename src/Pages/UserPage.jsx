import React from 'react'
import { useParams } from 'react-router-dom'
import { UserHeader , UserPost} from '../components'

const UserPage = () => {
    const { userId } = useParams()

    return (
        <div>
           <UserHeader 
           />

           <UserPost userId={userId} likes='1221' replies='122' postImg='/post1.png' postTitle="this is first post"/>
           <UserPost userId={userId} likes='121' replies='12' postImg='/post2.png' postTitle="this is secpnd post"/>
           <UserPost userId={userId} likes='121' replies='12' postImg='/post3.png' postTitle="this is secpnd post"/>
           <UserPost userId={userId} likes='12221' replies='1'  postTitle="without img post"/>


        </div>
    )
}

export default UserPage
