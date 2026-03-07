import { Link } from 'react-router-dom';
import CategoryBadge from './CategoryBadge';

function PostCard({ post }) {
  const date = new Date(post.createdAt || post.created_at).toLocaleDateString();

  return (
    <div className="post-card">
      <h2><Link to={`/post/${post.slug}`}>{post.title}</Link></h2>
      <div className="meta">
        By {post.author} &middot; {date}
      </div>
      {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
      <div>
        {post.categories?.map((cat) => (
          <CategoryBadge key={cat.id} name={cat.name} />
        ))}
      </div>
    </div>
  );
}

export default PostCard;
