import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import CategoryBadge from '../components/CategoryBadge';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    try {
      const res = await api.get(`/posts/${slug}`);
      setPost(res.data);
    } catch (err) {
      console.error('Failed to fetch post:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!post) return <p className="empty">Post not found.</p>;

  const date = new Date(post.createdAt || post.created_at).toLocaleDateString();

  return (
    <div>
      <div className="post-content">
        <h1>{post.title}</h1>
        <div className="meta">
          By {post.author} &middot; {date}
          {!post.published && <span className="badge badge-warning" style={{ marginLeft: '0.5rem' }}>Draft</span>}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          {post.categories?.map((cat) => (
            <CategoryBadge key={cat.id} name={cat.name} />
          ))}
        </div>
        <div className="body">{post.content}</div>
      </div>

      <div className="comments-section">
        <h3>Comments ({post.comments?.length || 0})</h3>
        <CommentList comments={post.comments} />
        <CommentForm postId={post.id} onCommentAdded={fetchPost} />
      </div>
    </div>
  );
}

export default PostPage;
