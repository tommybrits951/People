import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import TimeAgo from "react-timeago";
import Comments from "./Comments";
import axios from '../utils/axios'

export default function Post({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState()
  const {auth} = useContext(UserContext)
  useEffect(() => {
    post.post_id && axios.get(`/comments/${post.post_id}`, {
      headers: {
        Authorization: `Bearer, ${auth}`
      }
    })
    .then(res => {
      setComments(res.data)
    })
    .catch(err => console.log(err))
  }, [auth, post.post_id])

  if (!post) {
    return <li className="p-4 text-gray-400">Loading post...</li>;
  }

  const imageRegex = /\[images:([^\]]+)\]$/;
  const match = post.post ? post.post.match(imageRegex) : null;
  const imagePaths = match ? match[1].split(",") : [];
  const postText = match ? post.post.replace(imageRegex, "").trim() : post.post;

  return (
    <li className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-6 hover:bg-white/15 transition-all duration-200">
      <div className="flex items-center gap-4 mb-4">
        <img
          className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/50"
          src={`http://localhost:9000/images/profile/${post.email}.png`}
          alt={`${post.first_name} ${post.last_name}`}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/56";
          }}
        />
        <div className="grow">
          <h3 className="font-semibold text-white">
            {post.first_name} {post.last_name}
          </h3>
          <p className="text-xs text-gray-400">
            <TimeAgo date={new Date(post.time_posted)} />
          </p>
        </div>
      </div>

      {postText && (
        <p className="text-gray-200 mb-4 leading-relaxed">{postText}</p>
      )}

      {imagePaths.length > 0 && (
        <div className={`grid gap-2 mb-2 ${
          imagePaths.length === 1 ? "grid-cols-1" :
          imagePaths.length === 2 ? "grid-cols-2" :
          imagePaths.length === 3 ? "grid-cols-3" :
          "grid-cols-4"
        }`}>
          {imagePaths.map((imgPath, idx) => (
            <img
              key={idx}
              src={`http://localhost:9000/images/gallery/${imgPath.trim()}`}
              alt={`post-image-${idx}`}
              className="w-full h-48 object-cover rounded-lg border border-white/10 hover:border-purple-500/50 transition-colors"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/200";
              }}
            />
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-white/10">
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer text-sm font-medium"
        >
          {showComments ? "Hide Comments" : `${comments ? comments.length : 0} Comment${post.comment_count !== 1 ? 's' : ''}`}
        </button>
      </div>

      {showComments && <Comments post_id={post.post_id} />}
    </li>
  );
}
