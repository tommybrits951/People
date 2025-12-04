import { createContext, useEffect, useState } from "react";
import axios from "../utils/axios";
import { setAccessToken, getAccessToken } from "../utils/localStorage";
const UserContext = createContext();

const initRegister = {
  first_name: "",
  last_name: "",
  dob: "",
  gender: "Private",
  postal: "",
  email: "",
  password: "",
};

const initLogin = {
  email: "",
  password: "",
};
export default function UserProvider({ children }) {
  const [registerForm, setRegisterForm] = useState(initRegister);
  const [loginForm, setLoginForm] = useState(initLogin);
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const token = getAccessToken();

  if (token && auth === null) {
    setAuth(token);
  }

  // Get authorization on refresh
  useEffect(() => {
      !token && axios
        .get("/auth")
        .then((res) => {
          setAuth(res.data);
          setAccessToken(res.data);
          console.log(res.data);
        })
        .catch((err) => console.log(err));
  }, [setAuth, token]);
  // Decode authorization token into user data
  useEffect(() => {
    auth && axios
      .get("/auth/decode", {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      })
      .then((res) => {
        setUser(res.data);
      
      })
      .catch((err) => console.log(err));
  }, [auth]);
  return (
    <UserContext.Provider
      value={{
        registerForm,
        setRegisterForm,
        loginForm,
        setLoginForm,
        initRegister,
        initLogin,
        auth,
        setAuth,
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
export { UserContext };
