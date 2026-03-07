function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return <p className="empty">No comments yet.</p>;
  }

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <span className="comment-author">{comment.authorName || comment.author_name}</span>
          <span className="comment-date">
            {new Date(comment.createdAt || comment.created_at).toLocaleDateString()}
          </span>
          <p className="comment-body">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
