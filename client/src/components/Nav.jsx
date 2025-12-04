import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router";
import { FaHome, FaUser } from "react-icons/fa";
export default function Nav() {
  return (
    <header className="fixed flex flex-col justify-between top-0 left-0 bg-black w-full h-10">
      <Link to={"/home"} className="text-white text-3xl my-auto">
        <FaHome />
      </Link>
    </header>
  );
}
