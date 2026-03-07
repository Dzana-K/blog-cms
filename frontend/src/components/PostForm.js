import { useState, useEffect } from 'react';
import api from '../api/client';

function PostForm({ post, onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState('Admin');
  const [published, setPublished] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [categoryIds, setCategoryIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setExcerpt(post.excerpt || '');
      setAuthor(post.author || 'Admin');
      setPublished(post.published || false);
      setCoverImageUrl(post.coverImageUrl || post.cover_image_url || '');
      setCategoryIds(post.categories?.map((c) => c.id) || []);
    }
  }, [post]);

  const handleCategoryToggle = (id) => {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { title, content, excerpt, author, published, coverImageUrl, categoryIds };
      if (post) {
        await api.put(`/posts/${post.id}`, data);
      } else {
        await api.post('/posts', data);
      }
      if (onSave) onSave();
    } catch (err) {
      console.error('Failed to save post:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Excerpt</label>
        <input type="text" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary" />
      </div>
      <div className="form-group">
        <label>Author</label>
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Content</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Cover Image URL</label>
        <input type="text" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://..." />
      </div>
      <div className="form-group">
        <label>Categories</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {categories.map((cat) => (
            <label key={cat.id} className="checkbox-group" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={categoryIds.includes(cat.id)}
                onChange={() => handleCategoryToggle(cat.id)}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="checkbox-group">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Published
        </label>
      </div>
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
      </button>
    </form>
  );
}

export default PostForm;
