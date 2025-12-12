import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "../utils/axios";
import { UserContext } from "../context/UserContext";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";

export default function Users() {
  const navigate = useNavigate();
  const { auth, user: currentUser } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendStatuses, setFriendStatuses] = useState({});
  const [sendingRequest, setSendingRequest] = useState({});

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/users", {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
        setError(null);
        
        // Fetch friend status for each user
        const statuses = {};
        for (const user of response.data) {
          if (user.user_id !== currentUser?.user_id) {
            try {
              const statusRes = await axios.get(`/friends/status/${user.user_id}`, {
                headers: {
                  Authorization: `Bearer ${auth}`,
                },
              });
              statuses[user.user_id] = statusRes.data.status;
            } catch (err) {
              statuses[user.user_id] = "none";
            }
          }
        }
        setFriendStatuses(statuses);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (auth) {
      fetchUsers();
    }
  }, [auth, currentUser]);

  // Filter users based on search query with flexible matching
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      // Split query into individual terms for flexible matching
      const queryTerms = query.split(/\s+/).filter(term => term.length > 0);
      
      const filtered = users.filter((user) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const email = user.email.toLowerCase();
        const firstName = user.first_name.toLowerCase();
        const lastName = user.last_name.toLowerCase();
        
        // Check if all query terms match any part of name or email
        return queryTerms.every(term => {
          return (
            fullName.includes(term) ||
            email.includes(term) ||
            firstName.includes(term) ||
            lastName.includes(term)
          );
        });
      });
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleFriendRequest = async (e, userId) => {
    e.stopPropagation();
    setSendingRequest(prev => ({ ...prev, [userId]: true }));
    try {
      await axios.post("/friends/request", { friend_2_id: userId }, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      setFriendStatuses(prev => ({ ...prev, [userId]: "pending" }));
    } catch (err) {
      console.error("Error sending friend request:", err);
      alert(err.response?.data?.message || "Failed to send friend request");
    } finally {
      setSendingRequest(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full pt-16 px-8 flex items-center justify-center">
        <p className="text-xl text-gray-300">Loading users...</p>
      </div>
    );
  }

  return (
    <section className="w-full h-full pt-16 px-8 py-8 overflow-auto">
      {/* Header */}
      <div className="mb-8 max-w-5xl">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Discover People</h1>
        <p className="text-gray-400">Find and connect with other users</p>

        {/* Search Bar */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-500 transition-colors"
          />
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-400">
              Found {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 max-w-5xl">
          {error}
        </div>
      )}

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">
            {users.length === 0
              ? "No users found."
              : "No users match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 max-w-5xl">
          {filteredUsers.map((user) => (
            <div
              key={user.user_id}
              onClick={() => handleUserClick(user.user_id)}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:bg-white/15 cursor-pointer transition-all duration-200 shadow-lg"
            >
              <div className="flex items-center gap-4">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <img
                    src={`http://localhost:9000/images/profile/${user.email}.png`}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="h-16 w-16 rounded-full object-cover border-2 border-purple-500/50"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/64?text=No+Image";
                    }}
                  />
                </div>

                {/* User Info */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-white">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-sm text-gray-400 break-all">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Member since {new Date(user.joined).toLocaleDateString()}
                  </p>
                </div>

                {/* Current User Badge or Friend Request Button */}
                {currentUser && user.user_id === currentUser.user_id ? (
                  <div className="flex-shrink-0">
                    <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold rounded-full">
                      You
                    </span>
                  </div>
                ) : (
                  <div className="flex-shrink-0">
                    {friendStatuses[user.user_id] === "friends" && (
                      <button className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-semibold rounded-lg cursor-pointer" disabled>
                        <FaUserCheck /> Friends
                      </button>
                    )}
                    {friendStatuses[user.user_id] === "pending" && (
                      <button className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-semibold rounded-lg cursor-pointer" disabled>
                        Pending
                      </button>
                    )}
                    {friendStatuses[user.user_id] === "request" && (
                      <button className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold rounded-lg cursor-pointer" disabled>
                        Accept
                      </button>
                    )}
                    {friendStatuses[user.user_id] === "none" && (
                      <button onClick={(e) => handleFriendRequest(e, user.user_id)} disabled={sendingRequest[user.user_id]} className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-semibold rounded-lg cursor-pointer hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 transition-all">
                        <FaUserPlus /> Add Friend
                      </button>
                    )}
                  </div>
                )}

                {/* Arrow Icon */}
                <div className="flex-shrink-0 text-gray-400">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
