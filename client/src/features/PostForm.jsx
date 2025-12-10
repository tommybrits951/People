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
  
  const { auth, user } = useContext(UserContext);

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
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      // Only accept image files
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed");
        return false;
      }
      // Optional: limit file size (e.g., 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return false;
      }
      return true;
    });
    
    setImages((prev) => [...prev, ...validFiles]);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  // Remove image from selection
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!postText.trim() && images.length === 0) {
      setError("Please write something or add an image");
      return;
    }

    // Ensure user is authenticated and loaded
    if (!auth) {
      setError("Not authenticated. Please log in.");
      return;
    }

    if (!user || !user.user_id) {
      setError("User information not yet loaded. Please try again.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      
      // Append post text (trimmed)
      formData.append("post", postText.trim());
      
      // Append user_id from decoded token user data
      formData.append("user_id", user.user_id);
      
      // Append all selected images (backend handles single or multiple)
      images.forEach((file) => {
        formData.append("images", file);
      });

      // Submit to backend with Authorization header
      const response = await axios.post("/posts", formData, { 
        headers: {
          Authorization: `Bearer ${auth}`,
          // Note: Do NOT set Content-Type; browser will set it with multipart boundary
        },
      });

      // Clear form on successful submission
      setSuccess(response.data.message);
      setPostText("");
      setImages([]);
      setIsExpanded(false);
      if (fileInputRef.current) fileInputRef.current.value = null;

      // Trigger callback to refresh posts list (parent component responsibility)
      if (onPostSuccess) onPostSuccess();

      // Auto-clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create post";
      setError(errorMsg);
      console.error("Post submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6"
    >
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={postText}
        onChange={handleTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="What's on your mind?"
        className={`w-full p-3 border border-gray-300 rounded-lg resize-none overflow-hidden outline-none transition-all ${
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
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaX className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-3 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Form Controls - Visible when expanded */}
      {isExpanded && (
        <div className="mt-4 flex justify-end items-center gap-3">
          {/* File Input (hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Attach Images Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Attach images"
          >
            <FaPaperclip className="w-4 h-4" />
            Attach
          </button>

          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Clear
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors"
          >
            <IoSend className="w-4 h-4" />
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      )}
    </form>
  );
}
