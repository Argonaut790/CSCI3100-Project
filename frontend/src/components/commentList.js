import React from 'react';

const CommentList = ({ comments }) => {
    console.log('Rendering CommentList with comments:', comments);
    return (
        <div className="comment-list-container">
            {comments.map((comment) => (
                <div key={comment._id} className="comment">
                    <div className="user-avatar">
                        <img
                            src={comment.avatarURL }
                            alt="user avatar"
                        />
                    </div>
                    <div className="comment-content">
                        <p>
                            <strong>{comment.username}</strong> ({comment.userId})
                        </p>
                        <p>{comment.comment}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CommentList;