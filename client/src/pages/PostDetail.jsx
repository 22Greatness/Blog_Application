import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Edit, Trash2 } from 'lucide-react';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:5000/api/posts/${id}`, { withCredentials: true });
        navigate('/');
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (!post) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading...</div>;

  return (
    <div className="post-detail">
      <div className="post-detail-header">
        <h1 className="post-detail-title">{post.title}</h1>
        <div className="post-detail-meta">
          <span>By <strong>{post.author.username}</strong> on {new Date(post.createdAt).toDateString()}</span>
          {currentUser && currentUser._id === post.author._id && (
            <div style={{display: 'flex', gap: '15px'}}>
              <Link to={`/edit/${post._id}`} style={{color: 'var(--text-secondary)'}}><Edit size={20} /></Link>
              <Trash2 size={20} style={{cursor: 'pointer', color: 'var(--accent-color)'}} onClick={handleDelete} />
            </div>
          )}
        </div>
      </div>
      <img src={post.coverImage} alt={post.title} className="post-detail-img" />
      <div className="post-detail-content" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
