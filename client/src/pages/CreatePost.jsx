import { useState, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ]
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <h2 style={{textAlign: 'center'}}>Please login to create a post.</h2>;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a cover image");
      return;
    }

    try {
      // 1. Upload image
      const formData = new FormData();
      formData.append('image', file);
      const uploadRes = await axios.post('http://localhost:5000/api/posts/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const coverImage = uploadRes.data.url;

      // 2. Create post
      const newPost = { title, summary, content, coverImage };
      const postRes = await axios.post('http://localhost:5000/api/posts', newPost, { withCredentials: true });
      navigate(`/post/${postRes.data._id}`);
    } catch (err) {
      console.log(err);
      alert("Error creating post");
    }
  };

  return (
    <div className="editor-container">
      <h1 className="form-title">Create New Post</h1>
      <form onSubmit={handleCreate}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="text" placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} required />
        <input type="file" onChange={e => setFile(e.target.files[0])} accept="image/*" required />
        <ReactQuill 
          value={content} 
          onChange={setContent} 
          modules={modules} 
          formats={formats} 
          theme="snow"
          placeholder="Write your story..."
        />
        <button className="btn" style={{marginTop: '20px', width: '100%'}}>Publish Post</button>
      </form>
    </div>
  );
}
