import React from 'react'
import { useParams } from 'react-router-dom'

const PostPage = () => {
    const { userId, pId } = useParams()

    return (
        <div>
            <h1>{userId + pId}</h1>
        </div>
    )
}

export default PostPage
