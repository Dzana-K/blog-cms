import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import AdminPage from './pages/AdminPage';
import PostEditPage from './pages/PostEditPage';
import CategoriesPage from './pages/CategoriesPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/posts/new" element={<PostEditPage />} />
          <Route path="/admin/posts/:id/edit" element={<PostEditPage />} />
          <Route path="/admin/categories" element={<CategoriesPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
