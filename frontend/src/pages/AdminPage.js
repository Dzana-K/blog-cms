import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

function AdminPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts/all');
      setPosts(res.data.posts);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Manage Posts</h1>
        <Link to="/admin/posts/new" className="btn btn-primary">New Post</Link>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="empty">No posts yet. Create your first post!</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Author</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td><Link to={`/post/${post.slug}`}>{post.title}</Link></td>
                  <td>
                    {post.published
                      ? <span className="badge badge-success">Published</span>
                      : <span className="badge badge-warning">Draft</span>
                    }
                  </td>
                  <td>{post.author}</td>
                  <td>{new Date(post.createdAt || post.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <Link to={`/admin/posts/${post.id}/edit`} className="btn btn-sm">Edit</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(post.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
