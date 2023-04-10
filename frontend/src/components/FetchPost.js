import { Component } from "react";
import { useNotification } from "../NotificationContext";
import { Link } from "react-router-dom";
import axios from "axios";
// import ScrollContext from "./ScrollContext";
import ImportAll from "./ImportAll";
// import DeleteButtonContext from "./DeleteButtonContext";
import moment from "moment";
import CommentList from "./commentList";

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

// Get userId from localStorage
const userId = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")).userId
  : "defaultUserId";
// print the userId in console
console.log("userId is: " + userId);

const UserID = ({ postId, userId, username, deleteButton, userAvatar }) => {
  const { showNotification } = useNotification();

  const handleDeletePost = async (postId) => {
    if (window.confirm("Do you want to delete this post?")) {
      try {
        await axios.delete(
          process.env.REACT_APP_DEV_API_PATH + "/tweet/" + postId
        );
        console.log("Post deleted successfully!");

        // Use a timeout to delay showing the message after the page has reloaded
        showNotification("Post has been deleted!", "success");
        await new Promise((resolve) => setTimeout(resolve, 3000));
        window.location.reload(); // refresh the page
        //handleDeleteStatus(200);
        // Wait for 5 seconds before refreshing the page
        //await new Promise((resolve) => setTimeout(resolve, 3000));
      } catch (error) {
        console.error("Error deleting post:", error);

        // Use a timeout to delay showing the message after the page has reloaded
        showNotification("Post has not been deleted!", "error");
        await new Promise((resolve) => setTimeout(resolve, 3000));
        window.location.reload(); // refresh the page
      }
    }
  };

  const deleteButtonDiv = (
    <div className="btn" onClick={() => handleDeletePost(postId)}>
      <img
        src={images["trash.svg"]}
        className="white-img"
        alt="delete-button"
        id="delete-button"
      />
    </div>
  );

  /*
  const handleDeletePost = async (postId) => {
    // setdeleteButton(true);
    const res = await axios.delete(
      process.env.REACT_APP_DEV_API_PATH + "/tweet/" + postId
    );
    if (!res.error) {
      console.log(res);
    } else {
      console.log(res);
    }
  };*/

  return (
    <div className="post-user-info d-flex flex-row justify-content-between">
      <div>
        <Link to={"/user?userId=" + userId}>
          {userAvatar ? (
            <div>
              <img
                src={userAvatar}
                className="float-start post-user-avatar"
                alt="user-avatar"
              />
            </div>
          ) : (
            <div>
              <img
                src={images["avatar.png"]}
                className="float-start post-user-avatar white-img"
                alt="user-avatar"
              />
            </div>
          )}
        </Link>
        <div className="d-flex flex-cloumn align-items-md-center h-100 m-0 post-user-id">
          <div className="fw-bold">{username}</div>
          <div>#{userId}</div>
        </div>
      </div>
      {deleteButton && <div>{deleteButtonDiv}</div>}
    </div>
  );
};

class FetchPost extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      isLoading: false,
      page: 0,
      hasMore: true,
      likedPosts: JSON.parse(localStorage.getItem("likedPosts")) || [],
      dislikedPosts: JSON.parse(localStorage.getItem("dislikedPosts")) || [],
      commentText: "",
      showCommentInput: false,
      comments: [],
    };
    // this.postListRef = createRef();
  }

  async componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.fetchPosts();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  /*  Module: handleLickClick and handleDislikeClick
   *   Version: 3.0 (3/4/2023)
   *   Description: This module is used to handle the like and dislike button
   *   and send the request to the backend. It will also limit the user to
   *   only like or dislike once every 10 seconds (otherwise warning message will be given).
   *
   *   Parameter: postId, userId to post
   * */

  handleLikeClick = async (postId, userId) => {
    try {
      // check if the user has already disliked the post
      if (this.state.dislikedPosts.includes(postId)) {
        alert(
          "You have already disliked this post. Please undislike it before liking."
        );
        return;
      }
      // limit the user to only like or dislike once every 10 seconds
      // I check the last time the user like or dislike the post
      const lastLikeTime = localStorage.getItem(
        `lastLikeTime_${postId}_${userId}`
      );
      const currentTime = Date.now();

      if (lastLikeTime && currentTime - lastLikeTime < 3 * 1000) {
        alert("You can only like or unlike once every 3 seconds.");
        return;
      }

      localStorage.setItem(`lastLikeTime_${postId}_${userId}`, currentTime);

      const response = await axios.get(
        process.env.REACT_APP_DEV_API_PATH + "/like",
        {
          params: {
            postId,
            userId,
          },
        }
      );

      if (response.data.isLiked) {
        // If the post is already liked, send a DELETE request to unlike it
        await axios.delete(process.env.REACT_APP_DEV_API_PATH + "/like", {
          params: {
            postId,
            userId,
          },
        });
        console.log("Unliked successfully:", response.data);
        this.setState(
          (prevState) => ({
            likedPosts: prevState.likedPosts.filter((id) => id !== postId),
          }),
          () => {
            localStorage.setItem(
              "likedPosts",
              JSON.stringify(this.state.likedPosts)
            );
          }
        );
      } else {
        // If the post is not liked yet, send a POST request to like it
        await axios.post(process.env.REACT_APP_DEV_API_PATH + "/like", {
          postId,
          userId,
        });
        console.log("Liked successfully:", response.data);
        this.setState(
          (prevState) => ({
            likedPosts: [...prevState.likedPosts, postId],
          }),
          () => {
            localStorage.setItem(
              "likedPosts",
              JSON.stringify(this.state.likedPosts)
            );
          }
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
      alert("Debug 3");
    }
  };

  handleDislikeClick = async (postId, userId) => {
    try {
      // check if the user has already liked the post
      if (this.state.likedPosts.includes(postId)) {
        alert(
          "You have already liked this post. Please unlike it before disliking."
        );
        return;
      }
      // limit the user to only like or dislike once every 10 seconds
      // I check the last time the user like or dislike the post
      const lastdislikeTime = localStorage.getItem(
        `lastDislikeTime_${postId}_${userId}`
      );
      const currentTime = Date.now();

      if (lastdislikeTime && currentTime - lastdislikeTime < 2 * 1000) {
        alert("You can only dislike or undislike once every 2 seconds.");
        return;
      }

      localStorage.setItem(`lastDislikeTime_${postId}_${userId}`, currentTime);

      const response = await axios.get(
        process.env.REACT_APP_DEV_API_PATH + "/dislike",
        {
          params: {
            postId,
            userId,
          },
        }
      );
      if (response.data.isDisliked) {
        // If the post is already liked, send a DELETE request to unlike it
        await axios.delete(process.env.REACT_APP_DEV_API_PATH + "/dislike", {
          params: {
            postId,
            userId,
          },
        });
        console.log("UnDisliked successfully:", response.data);
        this.setState(
          (prevState) => ({
            dislikedPosts: prevState.dislikedPosts.filter(
              (id) => id !== postId
            ),
          }),
          () => {
            localStorage.setItem(
              "dislikedPosts",
              JSON.stringify(this.state.dislikedPosts)
            );
          }
        );
      } else {
        // If the post is not liked yet, send a POST request to like it
        await axios.post(process.env.REACT_APP_DEV_API_PATH + "/dislike", {
          postId,
          userId,
        });
        console.log("Disliked successfully:", response.data);
        this.setState(
          (prevState) => ({
            dislikedPosts: [...prevState.dislikedPosts, postId],
          }),
          () => {
            localStorage.setItem(
              "dislikedPosts",
              JSON.stringify(this.state.dislikedPosts)
            );
          }
        );
      }
    } catch (error) {
      console.error("Error disliking post:", error);
      alert("Debug 3");
    }
  };

  fetchComments = async (postId) => {
    try {
      console.log("Fetching comments for postId:", postId);
      const response = await axios.get(
        process.env.REACT_APP_DEV_API_PATH + "/comment/" + postId
      );
      const comments = response.data;
      console.log("Fetched comments:", response.data);

      this.setState({ comments });
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  handleCommentClick = (postId) => {
    // Fetch comments for the clicked post
    this.fetchComments(postId);

    this.setState((prevState) => ({
      showCommentInput: !prevState.showCommentInput,
    }));
  };

  handleCommentChange = (event) => {
    this.setState({ commentText: event.target.value });
  };

  submitComment = async (postId, userId) => {
    try {
      // Replace this with the actual API endpoint for submitting a comment
      const response = await axios.post(
        process.env.REACT_APP_DEV_API_PATH + "/comment",
        {
          postId,
          userId,
          comment: this.state.commentText,
        }
      );

      console.log("Comment submitted:", response.data);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }

    this.setState({ commentText: "", showCommentInput: false });
    await this.fetchComments(postId);
  };

  // New handleRetweet function
  handleRetweet = async (postId, userId) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_DEV_API_PATH + "/tweet/retweet" + postId,
        {
          userId,
        }
      );

      console.log("Retweeted successfully:", response.data);
    } catch (error) {
      console.error("Error retweeting post:", error);
      alert("An error occurred while retweeting the post.");
    }
  };

  // don't fetch the pictures again if the user scroll back to the top
  fetchPosts = async () => {
    const { page } = this.state;
    const targetUserId = this.props.userId ? this.props.userId : "";
    try {
      this.setState({ isLoading: true });

      const response = await axios.get(
        process.env.REACT_APP_DEV_API_PATH +
          `/tweet?limit=10&page=${page}&userId=${targetUserId}`
      );
      const posts = response.data;

      if (posts.length === 0) {
        this.setState({ hasMore: false });
      } else {
        const postsWithImages = await Promise.all(
          posts.map(async (post) => {
            const imageResponse = await axios.get(post.imageUrl, {
              responseType: "blob",
            });

            const imageURL = URL.createObjectURL(imageResponse.data);
            return { ...post, imageURL };
          })
        );

        this.setState((prevState) => ({
          posts: [...prevState.posts, ...postsWithImages],
          page: prevState.page + 1,
        }));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }

    this.setState({ isLoading: false });
  };

  // handleScroll = () => {
  //   const { isLoading, hasMore } = this.state;
  //   if (isLoading || !hasMore || !this.postListRef.current) return;

  //   const { scrollTop, scrollHeight, clientHeight } = this.postListRef.current;

  //   console.log("scrollTop:", scrollTop);
  //   console.log("scrollHeight:", scrollHeight);
  //   console.log("clientHeight:", clientHeight);

  //   if (scrollTop + clientHeight >= scrollHeight) {
  //     console.log("Fetching more posts...");
  //     this.fetchPosts();
  //   }
  // };

  render() {
    const { posts, isLoading } = this.state;
    const { deleteButton } = this.props;
    return (
      <div className="container-fluid p-0" id="mid-center">
        <div
          className="row d-flex justify-content-center"
          id="post-list"
          // ref={this.postListRef}
        >
          {posts.map((post, index) => (
            <div className="mask-post p-0" id="post" key={index}>
              <UserID
                postId={post._id}
                userId={post.userId}
                username={post.username}
                deleteButton={deleteButton}
                userAvatar={post.avatarURL}
              />
              <div
                className="post-image-div d-flex justify-content-center align-items-center"
                style={{ aspectRatio: "1/1" }}
              >
                <img
                  className="spinner"
                  style={{ aspectRatio: "1/1", width: "65px", height: "65px" }}
                  src={images["doge.png"]}
                  alt="spinner"
                  ref={(el) => (this[`spinner${index}`] = el)}
                ></img>
                <img
                  src={post.imageUrl}
                  className="post-image"
                  alt={post.desc}
                  style={{ display: "none" }}
                  ref={(el) => (this[`image${index}`] = el)}
                  // onload success
                  onLoad={() => {
                    this[`spinner${index}`].style.display = "none";
                    this[`image${index}`].style.display = "block";
                  }}
                />
              </div>
              <div
                id="post-description "
                className="d-flex flex-column overflow-hidden"
              >
                <div className="h5 d-flex flex-row justify-content-between">
                  <div>
                    <b>{post.username}</b>
                  </div>
                  <div>{moment(post.timestamp).format("MMMM Do, h:mm a")}</div>
                </div>
                <p>{post.desc}</p>
              </div>
              <div
                className="border-light border-opacity-50 pt-2 d-flex flex-row border-top justify-content-evenly"
                id="post-function"
              >
                {/* Like button */}
                <div
                  className={`btn rounded-0 px-5 w-30 d-flex justify-content-center border-0 like-animation ${
                    this.state.likedPosts.includes(post._id) ? "liked" : ""
                  }`}
                  onClick={() => this.handleLikeClick(post._id, userId)}
                >
                  <img
                    className="white-img"
                    src={
                      this.state.likedPosts.includes(post._id)
                        ? images["clickedLike.svg"]
                        : images["like.svg"]
                    }
                    alt="like"
                  />
                </div>
                {/* Dislike button */}
                <div
                  className={`btn rounded-0 px-5 w-30 border-light border-opacity-50 border-top-0 border-end-0 border-bottom-0 d-flex justify-content-center dislike-animation ${
                    this.state.dislikedPosts.includes(post._id)
                      ? "disliked"
                      : ""
                  }`}
                  onClick={() => this.handleDislikeClick(post._id, userId)}
                >
                  <img
                    className="white-img"
                    src={
                      this.state.dislikedPosts.includes(post._id)
                        ? images["clickedDislike.svg"]
                        : images["dislike.svg"]
                    }
                    alt="like"
                  />
                </div>
                {/* Comment button */}
                <div
                  className="btn rounded-0 px-5 border-light border-opacity-50 border-top-0 border-bottom-0 w-30 d-flex justify-content-center"
                  onClick={this.handleCommentClick}
                >
                  <img
                    className="white-img"
                    src={images["comment-alt.svg"]}
                    alt="comment"
                  />
                </div>
                {this.state.showCommentInput && (
                  <div
                    className="overlay"
                    onClick={() => this.handleCommentClick(post._id)}
                  >
                    <div
                      className="comment-container"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="comment-left">
                        {/* Display post information */}
                      </div>
                      <div className="comment-right">
                        <div className="comment-list">
                          {/* Display previous comments */}
                          <CommentList comments={this.state.comments} />
                        </div>
                        <div className="comment-input-section">
                          <input
                            type="text"
                            value={this.state.commentText}
                            onChange={this.handleCommentChange}
                            placeholder="Write your comment here..."
                          />
                          <button
                            onClick={() => this.submitComment(post._id, userId)}
                            disabled={!this.state.commentText.trim()}
                          >
                            Submit Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Retweet button */}
                <div
                  className="btn rounded-0 px-5 w-30 d-flex justify-content-center border-0"
                  onClick={() => this.handleRetweet(post._id, userId)} // Add onClick event handler for retweet button
                >
                  <img
                    className="white-img"
                    src={images["arrows-retweet.svg"]}
                    alt="retweet"
                  />
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div
              className="mask-post p-0 d-flex justify-content-center align-items-center"
              style={{ aspectRatio: "3/4" }}
            >
              <img
                className="spinner"
                src={images["doge.png"]}
                alt="spinner"
              ></img>
            </div>
          )}
        </div>
      </div>
    );
  }
}

// FetchPost.contextType = ScrollContext;

export default FetchPost;
