import {useContext, useEffect, useState} from 'react'
import { UserContext } from '../context/UserContext'
import axios from '../utils/axios'
import {Link} from "react-router"
import { FaUser } from 'react-icons/fa'
export default function FriendsList() {
  const [friends, setFriends] = useState([])
  const {auth} = useContext(UserContext)

  useEffect(() => {
    axios.get("/friends", {
      headers: {
        Authorization: `Bearer ${auth}`
      }
    })
    .then(res => {
      setFriends(res.data)
    })
    .catch(err => console.log(err))
  }, [auth])
  if (friends.length === 0) {
    return <p>Loading...</p>
  }
  return (
    <ul className='w-2/10 h-full mt-10 border-2 bg-stone-600'>
      {friends.map((friend, idx) => {
        return (
          <li key={idx} className='border-b-2 p-3 flex justify-between text-white'>
            <div className='h-10'>
              <img className='h-full rounded-full' src={`http://localhost:9000/images/profile/${friend.email}.png`} />
            </div>
            <h4 className='text-white'>{friend.first_name}</h4>
          </li>
        )
      })}
    </ul>
  )
}
