import { useState, useContext, useEffect } from 'react'
import axios from '../utils/axios'
import { UserContext } from '../context/UserContext'
import CommentForm from '../features/CommentForm'
import TimeAgo from 'react-timeago'
import Comment from './Comment'
export default function Comments({ post_id }) {
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { auth } = useContext(UserContext)

    useEffect(() => {
    const fetchComments = () => {
        axios.get(`/comments/${post_id}`, {
            headers: {
                Authorization: `Bearer ${auth}`
            }
        })
        .then(res => {
            setComments(res.data)
            console.log(res.data)
            setIsLoading(false)
        })
        .catch(err => {
            console.error(err)
            setIsLoading(false)
        })
    }

        post_id && fetchComments()
    }, [auth, post_id])

    const handleCommentAdded = (newComment) => {
        setComments(prev => [newComment, ...prev])
    }


    if (comments.length === 0 && !isLoading) {
        return <p className='text-white text-xs'>No Comments.</p>
    }
    return (
        <div className="mt-4 border-t border-white/10 pt-4">
            <CommentForm post_id={post_id} onCommentAdded={handleCommentAdded} />

            {isLoading ? (
                <p className='text-white text-xs'>Comments Loading...</p>
            ) : (
                <ul>
                    {comments.map((comment, idx) => <Comment comment={comment} key={idx} />)}
                </ul>
            )}
        </div>
    )
}
