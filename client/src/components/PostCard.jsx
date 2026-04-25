import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className="post-card">
      <div className="post-card-img-wrapper">
        <Link to={`/post/${post._id}`}>
          <img src={post.coverImage} alt={post.title} className="post-card-img" />
        </Link>
      </div>
      <div className="post-card-content">
        <Link to={`/post/${post._id}`}>
          <h2 className="post-card-title">{post.title}</h2>
        </Link>
        <div className="post-card-meta">
          <span>By <strong>{post.author?.username}</strong></span>
          <span>{new Date(post.createdAt).toDateString()}</span>
        </div>
        <p className="post-card-summary">{post.summary}</p>
      </div>
    </div>
  );
}
