import { useState, useContext, useEffect } from "react";
import {format} from 'date-fns'
import { UserContext } from "../context/UserContext";

export default function Profile() {
  const { auth, user } = useContext(UserContext);

  if (!user) {
    return <p className="absolute top-32">Loading</p>
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
