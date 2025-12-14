import { createContext, useEffect, useState, useCallback } from "react";
import axios from "../utils/axios";
import { setAccessToken, getAccessToken, removeAccessToken } from "../utils/localStorage";
const UserContext = createContext();

const initRegister = {
  // Basic Info
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  
  // Profile Info
  dob: "",
  gender: "Private",
  phone: "",
  bio: "",
  street: "",
  city: "",
  state: "",
  postal: "",
  country: "",
  
  // Social & Professional
  occupation: "",
  company: "",
  education: "",
  website: "",
  facebook_url: "",
  twitter_url: "",
  instagram_url: "",
  linkedin_url: "",
  github_url: "",
  
  // Interests & Preferences
  interests: "",
  skills: "",
  relationship_status: "",
  timezone: "",
  notifications_enabled: true,
  profile_public: true,
};

const initLogin = {
  email: "",
  password: "",
};
export default function UserProvider({ children }) {
  const [registerForm, setRegisterForm] = useState(initRegister);
  const [loginForm, setLoginForm] = useState(initLogin);
  const [auth, setAuth] = useState(null);
  const [posts, setPosts] = useState(null)
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

  // Request to get all posts posted and update list every time a new post is posted
  useEffect(() => {
    !posts && axios.get("/posts", {
      headers: {
        Authorization: `Bearer ${auth}`
      }
    })
    .then(res => {
      console.log(res.data)
      setPosts(res.data)
    })
    .catch(err => console.log(err))
  }, [auth, posts])

  const logout = useCallback(async () => {
    try {
      await axios.post("/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${auth}`
        }
      })
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      removeAccessToken()
      setAuth(null)
      setUser(null)
      setRegisterForm(initRegister)
      setLoginForm(initLogin)
      setPosts(null)
    }
  }, [auth])

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
        posts,
        setPosts,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
export { UserContext };
