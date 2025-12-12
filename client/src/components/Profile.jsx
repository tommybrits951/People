import { useState, useContext, useEffect } from "react";
import {format} from 'date-fns'
import { UserContext } from "../context/UserContext";
import { useParams } from "react-router";
import axios from '../utils/axios'
import { FaUserPlus, FaUserCheck } from "react-icons/fa";

export default function Profile() {
  const [user, setUser] = useState(null)
  const {user_id} = useParams()
  const {auth, user: currentUser} = useContext(UserContext)
  const [friendStatus, setFriendStatus] = useState("none")
  const [loading, setLoading] = useState(true)
  const [sendingRequest, setSendingRequest] = useState(false)

  useEffect(() => {
    const fetchUserAndStatus = async () => {
      try {
        setLoading(true);
        const userRes = await axios.get(`/users/${user_id}`, {
          headers: {
            Authorization: `Bearer ${auth}`
          }
        });
        setUser(userRes.data);
        
        if (userRes.data.user_id !== currentUser?.user_id) {
          const statusRes = await axios.get(`/friends/status/${user_id}`, {
            headers: {
              Authorization: `Bearer ${auth}`
            }
          });
          setFriendStatus(statusRes.data.status);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (auth && user_id) {
      fetchUserAndStatus();
    }
  }, [auth, user_id, currentUser?.user_id])

  const handleFriendRequest = async () => {
    setSendingRequest(true);
    try {
      await axios.post("/friends/request", { friend_2_id: parseInt(user_id) }, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      setFriendStatus("pending");
    } catch (err) {
      console.error("Error sending friend request:", err);
      alert(err.response?.data?.message || "Failed to send friend request");
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading || user === null) {
    return <div className="flex items-center justify-center h-full"><p className="text-white text-xl">Loading...</p></div>
  }

  const isOwnProfile = currentUser?.user_id === user.user_id;

  return (
    <section className="w-full h-full p-8 overflow-auto">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
        <div className="flex flex-col items-center mb-8">
          <img 
            className="h-40 w-40 rounded-full object-cover border-4 border-purple-500/50 shadow-lg mb-6" 
            src={`http://localhost:9000/images/profile/${user.email}.png`} 
            alt={`${user.first_name} ${user.last_name}`}
            onError={(e) => e.target.src = "https://via.placeholder.com/160?text=No+Image"}
          />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-gray-300">{user.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-gray-400 text-sm uppercase tracking-wide">Gender</p>
            <p className="text-white font-semibold mt-1">{user.gender}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-gray-400 text-sm uppercase tracking-wide">Date of Birth</p>
            <p className="text-white font-semibold mt-1">{format(user.dob, "MMM do, yyyy")}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-gray-400 text-sm uppercase tracking-wide">Zip Code</p>
            <p className="text-white font-semibold mt-1">{user.postal}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-gray-400 text-sm uppercase tracking-wide">Member Since</p>
            <p className="text-white font-semibold mt-1">{format(new Date(user.joined), "MMM yyyy")}</p>
          </div>
        </div>

        {user.bio && (
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-8">
            <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">About</p>
            <p className="text-gray-200">{user.bio}</p>
          </div>
        )}
      
        {!isOwnProfile && (
          <div className="flex justify-center mt-8">
            {friendStatus === "friends" && (
              <button className="flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg font-semibold" disabled>
                <FaUserCheck /> Friends
              </button>
            )}
            {friendStatus === "pending" && (
              <button className="flex items-center gap-2 px-6 py-3 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 rounded-lg font-semibold" disabled>
                Pending
              </button>
            )}
            {friendStatus === "request" && (
              <button className="flex items-center gap-2 px-6 py-3 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg font-semibold" disabled>
                Accept
              </button>
            )}
            {friendStatus === "none" && (
              <button 
                onClick={handleFriendRequest} 
                disabled={sendingRequest} 
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 cursor-pointer transition-all duration-200"
              >
                <FaUserPlus /> {sendingRequest ? "Sending..." : "Add Friend"}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
