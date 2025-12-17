import { useState, useContext } from 'react'
import axios from '../utils/axios'
import { UserContext } from '../context/UserContext'

export default function CommentForm({ post_id, onCommentAdded }) {
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { auth, user } = useContext(UserContext)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!comment.trim() || !user?.user_id) return

        setIsSubmitting(true)
        try {
            const res = await axios.post(
                `/comments/${post_id}`,
                {
                    comment: comment.trim(),
                    user_id: user.user_id
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth}`
                    }
                }
            )
            setComment('')
            if (onCommentAdded) {
                onCommentAdded(res.data)
            }
        } catch (err) {
            console.error('Error posting comment:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    disabled={isSubmitting}
                    className="flex-grow px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={isSubmitting || !comment.trim()}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                    {isSubmitting ? 'Posting...' : 'Post'}
                </button>
            </div>
        </form>
    )
}
