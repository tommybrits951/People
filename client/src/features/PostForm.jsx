import { useState, useContext, useRef, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import axios from "../utils/axios";
import { IoSend } from "react-icons/io5";
import { FaPaperclip, FaX } from "react-icons/fa6";

export default function PostForm({ onPostSuccess }) {
  const [postText, setPostText] = useState("");
  const [images, setImages] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const { auth, user, posts, setPosts } = useContext(UserContext);

  // Auto-expand textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [postText]);

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!postText.trim()) {
      setIsExpanded(false);
    }
  };

  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  // Handle file selection and add to images array

  // Clear all form data
  const handleClear = (e) => {
    e.preventDefault();
    setPostText("");
    setImages([]);
    setError("");
    setSuccess("");
    if (fileInputRef.current) fileInputRef.current.value = null;
    setIsExpanded(false);
  };

  // Submit post to backend
  function handleSubmit() {
    setLoading(true)
    const pkg = new FormData()
    pkg.append("user_id", user.user_id)
    pkg.append("post", postText)
    axios.post("/posts", pkg, {
      headers: {
        Authorization: `Bearer ${auth}`
      }
    })
    .then(res => {
      console.log(res.data)
      setPosts([res.data, ...posts])
    })
    .catch(err => console.log(err))
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 mb-6"
    >
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={postText}
        onChange={handleTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="What's on your mind?"
        className={`w-full p-4 bg-white/5 border border-white/20 rounded-xl resize-none overflow-hidden outline-none text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all ${
          isExpanded ? "min-h-24" : "h-12"
        }`}
      />

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                className="w-full h-24 object-cover rounded-lg border border-white/20"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <FaX className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div className="mt-3 p-3 bg-red-500/10 text-red-400 rounded-lg text-sm border border-red-500/30">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-3 p-3 bg-green-500/10 text-green-400 rounded-lg text-sm border border-green-500/30">
          {success}
        </div>
      )}

      {/* Form Controls - Visible when expanded */}
      {isExpanded && (
        <div className="mt-4 flex justify-end items-center gap-3">
          
          
          

          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 text-gray-300 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-colors"
          >
            Clear
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all font-semibold"
          >
            <IoSend className="w-4 h-4" />
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      )}
    </form>
  );
}
