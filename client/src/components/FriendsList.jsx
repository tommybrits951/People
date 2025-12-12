import {useContext, useEffect, useState} from 'react'
import { UserContext } from '../context/UserContext'
import axios from '../utils/axios'
import {Link} from "react-router"
import { FaUser, FaCheck, FaTimes } from 'react-icons/fa'

export default function FriendsList() {
  const [friends, setFriends] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [acceptingRequest, setAcceptingRequest] = useState({})
  const {auth, user} = useContext(UserContext)
  const [loading, setLoading] = useState(true)

  const fetchFriends = async () => {
    try {
      const friendsRes = await axios.get("/friends", {
        headers: {
          Authorization: `Bearer ${auth}`
        }
      });
      setFriends(friendsRes.data || []);
    } catch (err) {
      console.error(err);
      setFriends([]);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const pendingRes = await axios.get("/friends/pending", {
        headers: {
          Authorization: `Bearer ${auth}`
        }
      });
      setPendingRequests(pendingRes.data || []);
    } catch (err) {
      console.error(err);
      setPendingRequests([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchFriends(), fetchPendingRequests()]);
      } finally {
        setLoading(false);
      }
    };
    
    if (auth) {
      loadData();
    }
  }, [auth]);

  const handleAcceptRequest = async (friendRequestId) => {
    setAcceptingRequest(prev => ({ ...prev, [friendRequestId]: true }));
    try {
      await axios.put(`/friends/accept/${friendRequestId}`, {}, {
        headers: {
          Authorization: `Bearer ${auth}`
        }
      });
      setPendingRequests(prev => prev.filter(req => req.friend_id !== friendRequestId));
      await fetchFriends();
    } catch (err) {
      console.error(err);
      alert("Failed to accept request");
    } finally {
      setAcceptingRequest(prev => ({ ...prev, [friendRequestId]: false }));
    }
  };

  const handleRejectRequest = async (friendRequestId) => {
    try {
      await axios.delete(`/friends/reject/${friendRequestId}`, {
        headers: {
          Authorization: `Bearer ${auth}`
        }
      });
      setPendingRequests(prev => prev.filter(req => req.friend_id !== friendRequestId));
    } catch (err) {
      console.error(err);
      alert("Failed to reject request");
    }
  };

  if (loading) {
    return <div className="w-80 h-screen bg-white/5 backdrop-blur-xl border-r border-white/20 flex items-center justify-center"><p className="text-gray-300">Loading...</p></div>;
  }

  const totalItems = friends.length + pendingRequests.length;
  if (totalItems === 0) {
    return <div className="w-80 h-screen bg-white/5 backdrop-blur-xl border-r border-white/20 flex items-center justify-center text-center"><p className="text-gray-400 px-4">No friends or requests</p></div>;
  }

  return (
    <div className='w-80 h-full bg-white/5 backdrop-blur-xl border-r border-white/20 overflow-y-auto'>
      {/* Pending Requests Section */}
      {pendingRequests.length > 0 && (
        <div>
          <div className='bg-gradient-to-r from-orange-600/20 to-orange-500/10 border-b border-orange-500/20 px-4 py-3'>
            <p className='text-orange-300 font-bold text-sm'>PENDING REQUESTS ({pendingRequests.length})</p>
          </div>
          <ul>
            {pendingRequests.map((request, idx) => (
              <li key={idx} className='border-b border-white/5 px-4 py-4 flex items-center justify-between hover:bg-white/10 transition-colors'>
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                  <div className='h-10 w-10 flex-shrink-0'>
                    <img className='h-full w-full rounded-full object-cover border border-orange-500/30' src={`http://localhost:9000/images/profile/${request.email}.png`} alt={request.first_name} onError={(e) => e.target.src = "https://via.placeholder.com/40?text=No+Image"} />
                  </div>
                  <h4 className='text-sm text-gray-200 truncate'>{request.first_name}</h4>
                </div>
                <div className='flex gap-2 flex-shrink-0 ml-2'>
                  <button onClick={() => handleAcceptRequest(request.friend_id)} disabled={acceptingRequest[request.friend_id]} className='text-green-400 hover:text-green-300 cursor-pointer disabled:opacity-50 transition-colors'>
                    <FaCheck />
                  </button>
                  <button onClick={() => handleRejectRequest(request.friend_id)} className='text-red-400 hover:text-red-300 cursor-pointer transition-colors'>
                    <FaTimes />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Friends Section */}
      {friends.length > 0 && (
        <div>
          <div className='bg-gradient-to-r from-green-600/20 to-green-500/10 border-b border-green-500/20 px-4 py-3'>
            <p className='text-green-300 font-bold text-sm'>FRIENDS ({friends.length})</p>
          </div>
          <ul>
            {friends.map((friend, idx) => (
              <li key={idx} className='border-b border-white/5 px-4 py-4 flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer'>
                <div className='h-10 w-10 flex-shrink-0'>
                  <img className='h-full w-full rounded-full object-cover border border-green-500/30' src={`http://localhost:9000/images/profile/${friend.email}.png`} alt={friend.first_name} onError={(e) => e.target.src = "https://via.placeholder.com/40?text=No+Image"} />
                </div>
                <h4 className='text-sm text-gray-200 flex-grow truncate'>{friend.first_name} {friend.last_name}</h4>
                <FaUser className='text-blue-300 flex-shrink-0' />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
