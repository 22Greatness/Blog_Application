import { useState, useEffect, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
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

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [oldCoverImage, setOldCoverImage] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setTitle(res.data.title);
        setSummary(res.data.summary);
        setContent(res.data.content);
        setOldCoverImage(res.data.coverImage);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPost();
  }, [id]);

  if (!currentUser) return <h2 style={{textAlign: 'center'}}>Please login to edit this post.</h2>;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let coverImage = oldCoverImage;
      
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        const uploadRes = await axios.post('http://localhost:5000/api/posts/upload', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        coverImage = uploadRes.data.url;
      }

      const updatedPost = { title, summary, content, coverImage };
      await axios.put(`http://localhost:5000/api/posts/${id}`, updatedPost, { withCredentials: true });
      navigate(`/post/${id}`);
    } catch (err) {
      console.log(err);
      alert("Error updating post");
    }
  };

  return (
    <div className="editor-container">
      <h1 className="form-title">Edit Post</h1>
      <form onSubmit={handleUpdate}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="text" placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} required />
        <div style={{marginBottom: '15px'}}>
          <p style={{marginBottom: '5px', color: 'var(--text-secondary)'}}>Cover Image (leave empty to keep current)</p>
          <input type="file" onChange={e => setFile(e.target.files[0])} accept="image/*" />
        </div>
        <ReactQuill 
          value={content} 
          onChange={setContent} 
          modules={modules} 
          formats={formats} 
          theme="snow"
        />
        <button className="btn" style={{marginTop: '20px', width: '100%'}}>Update Post</button>
      </form>
    </div>
  );
}
