import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router";
import { FaHome, FaUser } from "react-icons/fa";
export default function Nav() {
    const {user} = useContext(UserContext)
    return (
    <header className="fixed inline-flex justify-around top-0 left-0 bg-black w-full h-10">
      <Link to={"/home"} className="text-white text-3xl my-auto">
        <FaHome />
      </Link>
      <Link to={`/profile/${user.user_id}`} className="text-white text-2xl my-auto">
        <FaUser />
      </Link>
    </header>
  );
}
