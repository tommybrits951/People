import { createContext, useState } from "react";


const UserContext = createContext()

const initRegister = {
    first_name: "",
    last_name: "",
    dob: "",
    gender: "Private",
    postal: "",
    email: "", 
    password: ""
}

const initLogin = {
    email: "", 
    password: ""
}
export default function UserProvider({children}) {
    const [registerForm, setRegisterForm] = useState(initRegister)
    const [loginForm, setLoginForm] = useState(initLogin)
    const [auth, setAuth] = useState(false)
    const [user, setUser] = useState(null)

    return (
        <UserContext.Provider value={{
            registerForm,
            setRegisterForm,
            loginForm,
            setLoginForm,
            initRegister,
            initLogin,
            auth,
            setAuth,
            user,
            setUser
        }}>
            {children}
        </UserContext.Provider>
    )
}
export {UserContext}