import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import { Routes, Route } from "react-router";
import "./App.css";
import Register from "./components/Register";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import Login from "./components/Login";
import Profile from "./components/Profile";

function App() {
  const {user} = useContext(UserContext)
  if (user) {

    return (
      <main>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route element={<Register />} path="/register" />
          <Route element={<Login />} path="/" />
        </Route>
        <Route element={<PrivateLayout />}>
          <Route element={<Profile />} path="/home" />
        </Route>
      </Routes>
    </main>
  )
}
}

export default App;
