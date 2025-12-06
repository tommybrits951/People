import {useState} from 'react'
import axios from '../utils/axios'

export default function PostForm() {
    const [formData, setFormData] = useState()
    const [images, setImages] = useState()
    function change(e) {
        setFormData(e.target.value)
    }
    function submit(e) {
        e.preventDefault()
    }
    return (
    <form encType='multipart/form-data' onSubmit={submit}>
        <textarea value={formData} onChange={change} placeholder={"What's on your mind?"} />
    </form>
  )
}
