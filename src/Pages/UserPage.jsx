import React from 'react'
import { useParams } from 'react-router-dom'

const UserPage = () => {
    const { userId } = useParams()

    return (
        <div>
            <h1>{userId}</h1>
        </div>
    )
}

export default UserPage
