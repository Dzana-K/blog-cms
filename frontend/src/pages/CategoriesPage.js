import { useState, useEffect } from 'react';
import api from '../api/client';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await api.post('/categories', { name: newName });
      setNewName('');
      fetchCategories();
    } catch (err) {
      console.error('Failed to create category:', err);
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    try {
      await api.put(`/categories/${id}`, { name: editName });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error('Failed to update category:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Categories</h1>
      </div>

      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
        />
        <button type="submit" className="btn btn-primary">Add</button>
      </form>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="empty">No categories yet.</p>
      ) : (
        <div className="table-wrapper">
          {categories.map((cat) => (
            <div key={cat.id} className="category-item">
              {editingId === cat.id ? (
                <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ flex: 1, padding: '0.25rem 0.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                  />
                  <button className="btn btn-sm btn-primary" onClick={() => handleUpdate(cat.id)}>Save</button>
                  <button className="btn btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <span>
                    <strong>{cat.name}</strong>
                    <span style={{ color: 'var(--text-light)', marginLeft: '0.5rem', fontSize: '0.875rem' }}>/{cat.slug}</span>
                  </span>
                  <div className="actions">
                    <button className="btn btn-sm" onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;
