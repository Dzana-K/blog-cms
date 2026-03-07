import { NavLink } from 'react-router-dom';

function Layout({ children }) {
  return (
    <>
      <header className="layout-header">
        <h1><NavLink to="/" style={{ color: 'inherit' }}>Blog CMS</NavLink></h1>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/admin">Admin</NavLink>
          <NavLink to="/admin/categories">Categories</NavLink>
        </nav>
      </header>
      <main className="layout-main">
        {children}
      </main>
      <footer className="layout-footer">
        Blog CMS &mdash; Masters Thesis Demo
      </footer>
    </>
  );
}

export default Layout;
