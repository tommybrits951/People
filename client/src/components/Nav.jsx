import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router";
import { FaHome, FaUser, FaUsers, FaSignOutAlt } from "react-icons/fa";

export default function Nav() {
    const {user, logout} = useContext(UserContext)
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate("/")
    }

    return (
        <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-md border-b border-purple-500/30 z-50 shadow-2xl">
            <div className="h-16 flex items-center justify-around px-6 max-w-7xl mx-auto w-full">
                <Link to={"/home"} className="text-white text-2xl hover:text-purple-300 transition-colors duration-200 cursor-pointer">
                    <FaHome />
                </Link>
                <Link to={"/users"} className="text-white text-2xl hover:text-purple-300 transition-colors duration-200 cursor-pointer">
                    <FaUsers />
                </Link>
                {user && (
                    <Link to={`/profile/${user.user_id}`} className="text-white text-2xl hover:text-purple-300 transition-colors duration-200 cursor-pointer">
                        <FaUser />
                    </Link>
                )}
                <button onClick={handleLogout} className="text-white text-2xl hover:text-red-400 transition-colors duration-200 bg-none border-none cursor-pointer">
                    <FaSignOutAlt />
                </button>
            </div>
        </header>
    );
}
