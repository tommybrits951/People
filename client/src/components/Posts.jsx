import {useEffect, useState, useContext} from 'react'
import PostForm from '../features/PostForm'
import { UserContext } from '../context/UserContext'
import axios from '../utils/axios'
import Post from './Post'

export default function Posts() {
  const [posts, setPosts] = useState([])
  
  
  const {auth} = useContext(UserContext)
  
  useEffect(() => {
    axios.get("/posts", {
      headers: {
        Authorization: `Bearer ${auth}`
      }
    })
    .then(res => setPosts(res.data))
    .catch(err => console.log(err))
  }, [auth])


  return (
    <section className='w-full max-w-2xl mx-auto mt-8 pb-28 px-3 overflow-hidden'>
      {/* Post Form */}
      <PostForm  />
      
      {/* Posts List */}
     
        <ul className="relative h-11/12 overflow-y-scroll">
          {posts.length !== 0 ? posts.map((post, idx) => (
            <Post key={post.post_id || idx} post={post} />
            )) : null}
        </ul>
      
    </section>
  )
}
