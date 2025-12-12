import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import { Routes, Route } from "react-router";
import "./App.css";
import Register from "./components/Register";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Posts from "./components/Posts";
import Users from "./components/Users";

function App() {
  return (
    <main className="h-full">
      <Routes>
        <Route element={<PublicLayout />}>
          <Route element={<Register />} path="/register" />
          <Route element={<Login />} path="/" />
        </Route>
        <Route element={<PrivateLayout />}>
          <Route element={<Posts />} path="/home" />
          <Route element={<Profile />} path="/profile/:user_id" />
          <Route element={<Users />} path="/users" />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
