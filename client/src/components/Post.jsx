import TimeAgo from "react-timeago";

export default function Post({ post }) {
  if (!post) {
    return <li className="p-4 text-gray-400">Loading post...</li>;
  }

  // Parse post text and image paths from post content
  // Backend stores images as: "text [images:path1,path2,...]"
  const imageRegex = /\[images:([^\]]+)\]$/;
  const match = post.post ? post.post.match(imageRegex) : null;
  const imagePaths = match ? match[1].split(",") : [];
  const postText = match ? post.post.replace(imageRegex, "").trim() : post.post;

  return (
    <li className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-6 hover:bg-white/15 transition-all duration-200">
      {/* Header: Author Info */}
      <div className="flex items-center gap-4 mb-4">
        <img
          className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/50"
          src={`http://localhost:9000/images/profile/${post.email}.png`}
          alt={`${post.first_name} ${post.last_name}`}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/56";
          }}
        />
        <div className="flex-grow">
          <h3 className="font-semibold text-white">
            {post.first_name} {post.last_name}
          </h3>
          <p className="text-xs text-gray-400">
            <TimeAgo date={new Date(post.time_posted)} />
          </p>
        </div>
      </div>

      {/* Post Text */}
      {postText && (
        <p className="text-gray-200 mb-4 leading-relaxed">{postText}</p>
      )}

      {/* Post Images Grid */}
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
    </li>
  );
}
