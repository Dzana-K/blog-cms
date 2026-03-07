import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import PostForm from '../components/PostForm';

function PostEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      api.get(`/posts/all`).then((res) => {
        const found = res.data.posts.find((p) => p.id === parseInt(id));
        setPost(found || null);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id]);

  const handleSave = () => {
    navigate('/admin');
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>{id ? 'Edit Post' : 'New Post'}</h1>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
        <PostForm post={post} onSave={handleSave} />
      </div>
    </div>
  );
}

export default PostEditPage;
