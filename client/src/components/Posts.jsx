import { useContext } from "react";
import PostForm from "../features/PostForm";
import { UserContext } from "../context/UserContext";

import Post from "./Post";

export default function Posts() {
  const { posts } = useContext(UserContext);

  if (!posts) {
    return <div className="flex items-center justify-center h-full"><p className="text-white text-xl">Loading...</p></div>;
  }

  return (
    <section className="w-full max-w-2xl mx-auto py-8 pb-28 px-4 overflow-hidden">
      {/* Post Form */}
      <PostForm />

      {/* Posts List */}
      <ul className="space-y-4 mt-6">
        {posts.length !== 0
          ? posts.map((post, idx) => (
              <Post key={post.post_id || idx} post={post} />
            ))
          : <li className="text-center text-gray-400 py-12">No posts yet. Be the first to share!</li>}
      </ul>
    </section>
  );
}
