import TimeAgo from "react-timeago";

export default function Post({ post }) {
  if (!post) {
    return <li className="p-4 text-gray-500">Loading post...</li>;
  }

  // Parse post text and image paths from post content
  // Backend stores images as: "text [images:path1,path2,...]"
  const imageRegex = /\[images:([^\]]+)\]$/;
  const match = post.post ? post.post.match(imageRegex) : null;
  const imagePaths = match ? match[1].split(",") : [];
  const postText = match ? post.post.replace(imageRegex, "").trim() : post.post;

  return (
    <li className="bg-white border border-gray-200 rounded-lg shadow-md p-4 mb-4">
      {/* Header: Author Info */}
      <div className="flex items-center gap-3 mb-3">
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={`http://localhost:9000/images/profile/${post.email}.png`}
          alt={`${post.first_name} ${post.last_name}`}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/48"; // Fallback if image not found
          }}
        />
        <div>
          <h3 className="font-semibold text-gray-800">
            {post.first_name} {post.last_name}
          </h3>
          <p className="text-xs text-gray-500">
            <TimeAgo date={new Date(post.time_posted)} />
          </p>
        </div>
      </div>

      {/* Post Text */}
      {postText && (
        <p className="text-gray-700 mb-3 leading-relaxed">{postText}</p>
      )}

      {/* Post Images Grid */}
      {imagePaths.length > 0 && (
        <div className={`grid gap-2 mb-3 ${
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
              className="w-full h-40 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/200"; // Fallback
              }}
            />
          ))}
        </div>
      )}
    </li>
  );
}
