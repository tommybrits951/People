import { useState, useContext, useEffect } from "react";
import {format} from 'date-fns'
import { UserContext } from "../context/UserContext";
import { useParams } from "react-router";
import axios from '../utils/axios'

export default function Profile() {
  const [user, setUser] = useState(null)
  const {user_id} = useParams()
  const {auth} = useContext(UserContext)

  useEffect(() => {
    axios.get(`/users/${user_id}`, {
      headers: {
        Authorization: `Bearer ${auth}`
      }
    })
    .then(res => {
      setUser(res.data)
    })
    .catch(err => console.log(err))
    
  }, [auth, user_id])
  if (user === null) {
    return <p className="col-start-3 col-end-7 absolute top-32">Loading</p>
  }

  return (
    <section className="pt-12 px-5 bg-stone-300 h-full col-start-3 col-end-7">
      <div className="h-42 rounded-full">
        <img className="h-full rounded-full" src={`http://localhost:9000/images/profile/${user.email}.png`} />
      </div>
      <h2 className="text-4xl mt-5">{user.first_name} {user.last_name}</h2>
      <h4 className="text-lg mt-5">{user.gender}</h4>
      <h4 className="text-lg mt-5">Date of Birth: {format(user.dob, "MMMM do yyyy")}</h4>
      <h4 className="text-lg mt-5">Zip Code: {user.postal}</h4>
      <h4 className="text-lg mt-5">Email: {user.email}</h4>
      <h4 className="text-lg mt-5">Member Since: {user.joined}</h4>
      
    </section>
  )
}
