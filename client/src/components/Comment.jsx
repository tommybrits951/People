import React from 'react'
import TimeAgo from 'react-timeago'

export default function Comment({comment}) {
    if (!comment) {
        return <p>Loading...</p>
    }

    return (
        <li className="bg-white/5 rounded-lg p-3 border border-white/10 mb-2">
            <div className="flex items-start gap-3">
                <img
                    className="w-8 h-8 rounded-full object-cover border border-purple-500/50"
                    src={`http://localhost:9000/images/profile/${comment.email}.png`}
                    alt={`${comment.first_name} ${comment.last_name}`}
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/32"
                    }}
                />
                <div className="flex-grow">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white text-sm">
                            {comment.first_name} {comment.last_name}
                        </h4>
                        <span className="text-xs text-gray-400">
                            <TimeAgo date={new Date(comment.time_commented)} />
                        </span>
                    </div>
                    <p className="text-gray-200 text-sm mt-1">{comment.comment}</p>
                </div>
            </div>
        </li>
    )
}
