import { Component } from "react";
import { useNotification } from "../NotificationContext";
import { Link } from "react-router-dom";
import axios from "axios";
// import ScrollContext from "./ScrollContext";
import ImportAll from "./ImportAll";
// import DeleteButtonContext from "./DeleteButtonContext";
import moment from "moment";
import Retweet from "./Retweet";

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

// Get userId from localStorage
const userId = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")).userId
  : "defaultUserId";

// Get userId from localStorage
const username = localStorage.getItem("username")
  ? JSON.parse(localStorage.getItem("username")).username
  : "defaultUsername";

// Get userId from localStorage
const userAvatar = localStorage.getItem("userAvatar")
  ? JSON.parse(localStorage.getItem("userAvatar")).userAvatar
  : images["avatar.png"];

const UserID = ({ postId, userId, username, deleteButton, userAvatar }) => {
  const { showNotification } = useNotification();

  const handleDeletePost = async (postId) => {
    if (window.confirm("Do you want to delete this post?")) {
      try {
        await axios.delete(
          process.env.REACT_APP_DEV_API_PATH + "/tweet/" + postId
        );
        // console.log("Post deleted successfully!");

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
              <div className="d-flex flex-cloumn align-items-md-center h-100 m-0 post-user-id">
                <div className="fw-bold">{username}</div>
                <div>#{userId}</div>
              </div>
            </div>
          ) : (
            <div>
              <img
                src={images["avatar.png"]}
                className="float-start post-user-avatar white-img"
                alt="user-avatar"
              />
              <div className="d-flex flex-cloumn align-items-md-center h-100 m-0 post-user-id">
                <div className="fw-bold">{username}</div>
                <div>#{userId}</div>
              </div>
            </div>
          )}
        </Link>
      </div>
      {deleteButton && <div>{deleteButtonDiv}</div>}
    </div>
  );
};

const CommentUserID = ({ postId, userId, username, userAvatar, timestamp }) => {
  return (
    <div className="overflow-hidden p-2 d-flex flex-row justify-content-between">
      <Link to={"/user?userId=" + userId}>
        {userAvatar ? (
          <div className="d-flex pe-2">
            <img
              src={userAvatar}
              className="float-start post-user-avatar"
              alt="user-avatar"
            />
            <div className="d-flex flex-cloumn align-items-md-center h-100 m-0 post-user-id">
              <div className="fw-bold">{username}</div>
              <div>#{userId}</div>
            </div>
          </div>
        ) : (
          <div className="d-flex pe-2 ">
            <img
              src={images["avatar.png"]}
              className="float-start post-user-avatar white-img"
              alt="user-avatar"
            />
            <div className="d-flex flex-cloumn align-items-md-center h-100 m-0 post-user-id">
              <div className="fw-bold">{username}</div>
              <div>#{userId}</div>
            </div>
          </div>
        )}
      </Link>

      <div className="">
        <div>{moment(timestamp).format("MMMM Do")}</div>
        <div>{moment(timestamp).format("h:mm a")}</div>
      </div>
    </div>
  );
};

const Comment = ({
  comment,
  postId,
  userId,
  username,
  userAvatar,
  timestamp,
}) => {
  return (
    <div className="p-2">
      <div className="rounded border border-light border-opacity-50 overflow-hidden p-2 d-flex flex-column justify-content-between">
        <div className="overflow-hidden p-2 d-flex flex-row justify-content-between">
          <Link to={"/user?userId=" + userId}>
            {userAvatar ? (
              <div className="d-flex pe-2">
                <img
                  src={userAvatar}
                  className="float-start post-user-avatar"
                  alt="user-avatar"
                />
                <div className="d-flex flex-cloumn align-items-md-center h-100 m-0 post-user-id">
                  <div className="fw-bold">{username}</div>
                  <div>#{userId}</div>
                </div>
              </div>
            ) : (
              <div className="d-flex pe-2">
                <img
                  src={images["avatar.png"]}
                  className="float-start post-user-avatar white-img"
                  alt="user-avatar"
                />
                <div className="d-flex flex-cloumn align-items-md-center h-100 m-0 post-user-id">
                  <div className="fw-bold">{username}</div>
                  <div>#{userId}</div>
                </div>
              </div>
            )}
          </Link>

          <div className="">
            <div>{moment(timestamp).format("MMMM Do")}</div>
            <div>{moment(timestamp).format("h:mm a")}</div>
          </div>
        </div>
        <div className="p-2 border-top border-light border-opacity-25 text-break">
          {comment}
        </div>
      </div>
    </div>
  );
};

class FetchPost extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      selectedPostcomments: [],
      selectedPost: null,
      isLoading: false,
      isNoPost: false,
      page: 0,
      hasMore: true,
      likedPosts: JSON.parse(localStorage.getItem("likedPosts")) || [],
      dislikedPosts: JSON.parse(localStorage.getItem("dislikedPosts")) || [],
      commentText: "",
      commentTextCount: 0,
      showCommentInput: false,
      retweetHandled: false,
    };
    this.handleCommentChange = this.handleCommentChange.bind(this);
    // this.postListRef = createRef();
  }

  validateLikedDislikedPosts = (userId) => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
    const dislikedPosts =
      JSON.parse(localStorage.getItem("dislikedPosts")) || [];

    const validatedLikedPosts = likedPosts.filter(
      (post) => post.userId === userId
    );
    const validatedDislikedPosts = dislikedPosts.filter(
      (post) => post.userId === userId
    );

    localStorage.setItem("likedPosts", JSON.stringify(validatedLikedPosts));
    localStorage.setItem(
      "dislikedPosts",
      JSON.stringify(validatedDislikedPosts)
    );

    this.setState({
      likedPosts: validatedLikedPosts,
      dislikedPosts: validatedDislikedPosts,
    });
  };

  async componentDidMount() {
    const { maskBackgroundRef } = await this.props;
    const { current } = maskBackgroundRef;
    // console.dir(this.props);
    // console.log("maskBackgroundRef in FetchPost: " + current);

    try {
      current.addEventListener("scroll", this.handleScroll);
      // console.log("current: " + current);
      // console.log("Success");
    } catch (error) {
      console.log(error);
    }

    // Validate liked and disliked posts for the current user
    this.validateLikedDislikedPosts(this.props.userId);

    this.fetchPosts();
  }

  // componentWillUnmount() {
  //   const { profile, maskBackgroundRef } = this.props;
  //   const { current } = maskBackgroundRef;

  //   if (maskBackgroundRef && maskBackgroundRef.current) {
  //     current.removeEventListener("scroll", this.handleScroll);
  //   }
  // }

  /*  Module: handleLickClick and handleDislikeClick
   *   Version: 3.0 (3/4/2023)
   *   Description: This module is used to handle the like and dislike button
   *   and send the request to the backend. It will also limit the user to
   *   only like or dislike once every 10 seconds (otherwise warning message will be given).
   *
   *   Parameter: postId, userId to post
   * */

  handleLikeClick = async (postId, userId) => {
    const { showNotification } = this.props;
    try {
      // check if the user has already disliked the post
      if (this.state.dislikedPosts.includes(postId)) {
        showNotification(
          "You have already disliked this post. Please undislike it before liking.",
          "error"
        );
        //  alert(
        //    "You have already disliked this post. Please undislike it before liking.");
        return;
      }
      // limit the user to only like or dislike once every 10 seconds
      // I check the last time the user like or dislike the post
      const lastLikeTime = localStorage.getItem(
        `lastLikeTime_${postId}_${userId}`
      );
      const currentTime = Date.now();

      if (lastLikeTime && currentTime - lastLikeTime < 3 * 1000) {
        showNotification(
          "You can only like or unlike once every 3 seconds.",
          "error"
        );
        //alert("You can only like or unlike once every 3 seconds.");
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
        showNotification("Unliked successfully!", "success");
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
        // Update the like count in the state
        this.setState((prevState) => ({
          posts: prevState.posts.map((post) =>
            post._id === postId
              ? { ...post, likeCount: post.likeCount - 1 }
              : post
          ),
        }));
      } else {
        // If the post is not liked yet, send a POST request to like it
        await axios.post(process.env.REACT_APP_DEV_API_PATH + "/like", {
          postId,
          userId,
        });
        showNotification("Liked successfully!", "success");
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
        // Update the like count in the state
        this.setState((prevState) => ({
          posts: prevState.posts.map((post) =>
            post._id === postId
              ? { ...post, likeCount: post.likeCount + 1 }
              : post
          ),
        }));
      }
    } catch (error) {
      showNotification("Error liking post!", "error");
    }
  };

  handleDislikeClick = async (postId, userId) => {
    const { showNotification } = this.props;
    try {
      // check if the user has already liked the post
      if (this.state.likedPosts.includes(postId)) {
        showNotification(
          "You have already liked this post. Please unlike it before disliking.",
          "error"
        );
        //  alert(
        //    "You have already liked this post. Please unlike it before disliking.");
        return;
      }
      // limit the user to only like or dislike once every 10 seconds
      // I check the last time the user like or dislike the post
      const lastdislikeTime = localStorage.getItem(
        `lastDislikeTime_${postId}_${userId}`
      );
      const currentTime = Date.now();

      if (lastdislikeTime && currentTime - lastdislikeTime < 2 * 1000) {
        showNotification(
          "You can only dislike or undislike once every 2 seconds.",
          "error"
        );
        //alert("You can only dislike or undislike once every 2 seconds.");
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
        showNotification("UnDisliked successfully!", "success");
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
        // Update the dislike count in the state
        this.setState((prevState) => ({
          posts: prevState.posts.map((post) =>
            post._id === postId
              ? { ...post, dislikeCount: post.dislikeCount - 1 }
              : post
          ),
        }));
      } else {
        // If the post is not liked yet, send a POST request to like it
        await axios.post(process.env.REACT_APP_DEV_API_PATH + "/dislike", {
          postId,
          userId,
        });
        showNotification("Disliked successfully!", "success");
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
        // Update the dislike count in the state
        this.setState((prevState) => ({
          posts: prevState.posts.map((post) =>
            post._id === postId
              ? { ...post, dislikeCount: post.dislikeCount + 1 }
              : post
          ),
        }));
      }
    } catch (error) {
      showNotification("Error disliking post.", "error");
      //alert("Debug 3");
    }
  };

  //Comment part
  handleCommentClick = (post) => {
    this.setState((prevState) => ({
      selectedPost: post,
      showCommentInput: !prevState.showCommentInput,
    }));
    this.fetchComments(post.postId);
  };

  handleCommentChange = (e) => {
    // Get the input value
    let inputValue = e.target.value;
    console.log("inputValue" + inputValue);

    // Update the state only if the limited input value is shorter than the current desc
    if (inputValue.split(/\s+/).length <= 200) {
      this.setState({ commentText: e.target.value });
    }
    // const descWordCount = this.state.desc.split(/\s+/).length;
    let inputLength = inputValue.split(/\s+/).length;
    const inputArray = inputValue.split(/\s+/);

    if (inputArray[inputLength - 1] === "") {
      inputLength--;
    }

    this.setState({ commentTextCount: inputLength });

    // Update the input element's height to fit its content
    // it's not working
    e.target.style.height = "auto";
    e.target.style.height =
      e.target.scrollHeight > 200 ? "200px" : e.target.scrollHeight + "px";
    e.target.style.overflowY =
      e.target.scrollHeight > 200 ? "scroll" : "hidden";
  };

  submitComment = async (postId) => {
    const { showNotification } = this.props;
    try {
      console.log("postId" + postId);
      console.log("userId" + userId);
      console.log("comment" + this.state.commentText);
      const response = await axios.post(
        process.env.REACT_APP_DEV_API_PATH + "/comment",
        {
          postId,
          userId,
          comment: this.state.commentText,
        }
      );

      console.log("Comment submitted:", response.data);
      // Use a timeout to delay showing the message after the page has reloaded
      showNotification("Comment Submitted", "success");
    } catch (error) {
      showNotification("Error submitting comment:", "error");
      console.error("Error submitting comment:", error);
    }

    this.setState((prevState) => ({
      selectedPostcomments: [
        ...prevState.selectedPostcomments,
        {
          userId: userId,
          comment: this.state.commentText,
          timestamp: Date.now(),
          username: username,
          avatarURL: userAvatar,
        },
      ],
    }));

    this.setState({ commentText: "", showCommentInput: false });
  };

  //fetech comments
  fetchComments = async (postId) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DEV_API_PATH + `/comment/${postId}`
      );

      this.setState({ selectedPostcomments: response.data });
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  //Retweet part
  handleRetweet = async (post) => {
    this.setState((prevState) => ({
      selectedPost: post,
      retweetHandled: !prevState.retweetHandled,
    }));
  };

  // don't fetch the pictures again if the user scroll back to the top
  fetchPosts = async () => {
    const { page } = this.state;
    const targetUserId = this.props.targetUserId ? this.props.targetUserId : "";
    const currentUserId = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).userId
      : "";
    try {
      this.setState({ isLoading: true });
      const response = await axios.get(
        process.env.REACT_APP_DEV_API_PATH +
          `/tweet?limit=10&page=${page}&targetUserId=${targetUserId}&userId=${currentUserId}`
      );
      const posts = response.data;
      console.log(userId);
      if (posts.length === 0) {
        if (window.location.pathname === "/home" && page === 0) {
          this.setState({ isNoPost: true, hasMore: false });
        } else {
          this.setState({ hasMore: false });
        }
      } else {
        const postsWithImages = await Promise.all(
          posts.map(async (post) => {
            if (!post.retweetedPostId) {
              // handle the original post
              const imageResponse = await axios.get(post.imageUrl, {
                responseType: "blob",
              });

              const imageURL = URL.createObjectURL(imageResponse.data);
              return { ...post, imageURL };
            } else {
              // handle the retweet post
              const retweetedPostResponse = await axios.get(
                process.env.REACT_APP_DEV_API_PATH +
                  `/tweet/post/${post.retweetedPostId}`
              );

              const retweetedPostImageResponse = await axios.get(
                retweetedPostResponse.data.imageUrl,
                {
                  responseType: "blob",
                }
              );
              const postImageURL = URL.createObjectURL(
                retweetedPostImageResponse.data
              );
              console.dir(retweetedPostResponse);
              return {
                ...post,
                retweetedPostData: retweetedPostResponse.data,
                postImageURL,
              };
            }
          })
        );

        const postsWithDislikeCounts = await Promise.all(
          postsWithImages.map(async (post) => {
            const response = await axios.get(
              process.env.REACT_APP_DEV_API_PATH + "/dislike",
              {
                params: {
                  postId: post._id,
                  userId,
                },
              }
            );
            const dislikeCount = response.data.dislikeNum;
            const isDisliked = response.data.isDisliked;
            return { ...post, dislikeCount, isDisliked };
          })
        );

        const postsWithLikeCounts = await Promise.all(
          postsWithImages.map(async (post) => {
            const response = await axios.get(
              process.env.REACT_APP_DEV_API_PATH + "/like",
              {
                params: {
                  postId: post._id,
                  userId,
                },
              }
            );
            const isLiked = response.data.isLiked;
            const likeCount = response.data.likeNum;
            return { ...post, likeCount, isLiked };
          })
        );

        const combinedPosts = postsWithImages.map((post, index) => {
          const updatedPost = {
            ...post,
            dislikeCount: postsWithDislikeCounts[index].dislikeCount,
            likeCount: postsWithLikeCounts[index].likeCount,
          };

          if (
            postsWithDislikeCounts[index].isDisliked &&
            !this.state.dislikedPosts.includes(post._id)
          ) {
            this.setState(
              (prevState) => ({
                dislikedPosts: [...prevState.dislikedPosts, post._id],
              }),
              () => {
                localStorage.setItem(
                  "dislikedPosts",
                  JSON.stringify(this.state.dislikedPosts)
                );
              }
            );
          }

          if (
            postsWithLikeCounts[index].isLiked &&
            !this.state.likedPosts.includes(post._id)
          ) {
            this.setState(
              (prevState) => ({
                likedPosts: [...prevState.likedPosts, post._id],
              }),
              () => {
                localStorage.setItem(
                  "likedPosts",
                  JSON.stringify(this.state.likedPosts)
                );
              }
            );
          }

          return updatedPost;
        });

        this.setState((prevState) => ({
          posts: [...prevState.posts, ...combinedPosts],
          page: prevState.page + 1,
        }));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }

    this.setState({ isLoading: false });
  };

  handleScroll = () => {
    const { maskBackgroundRef } = this.props;
    const { current } = maskBackgroundRef;

    const { isLoading, hasMore } = this.state;
    // console.log("handleScroll");
    if (isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = current;

    // console.log("scrollTop:", scrollTop);
    // console.log("scrollHeight:", scrollHeight);
    // console.log("clientHeight:", clientHeight);

    if (scrollTop + clientHeight >= scrollHeight) {
      // console.log("Fetching more posts...");
      this.fetchPosts();
    }
  };

  render() {
    const { posts, isLoading } = this.state;
    const { deleteButton } = this.props;
    const { showNotification } = this.props;
    return (
      <div className="container-fluid p-0" id="mid-center">
        <div
          className="row d-flex justify-content-center"
          id="post-list"
          // ref={this.postListRef}
        >
          {this.state.isNoPost && (
            <div
              className="no-post-warning mask-post d-flex justify-content-center align-items-center"
              style={{ height: "50rem" }}
            >
              <div className="fw-bold h3">Follow more people to view posts</div>
            </div>
          )}
          {posts.map((post, index) => (
            <div className="mask-post p-0" id="post" key={index}>
              <UserID
                postId={post._id}
                userId={post.userId}
                username={post.username}
                deleteButton={deleteButton}
                userAvatar={post.avatarURL}
              />
              {/* Post Image */}
              {!post.retweetedPostId && (
                <div
                  className="post-image-div d-flex justify-content-center align-items-center"
                  style={{ aspectRatio: "1/1" }}
                >
                  <img
                    className="spinner"
                    style={{
                      aspectRatio: "1/1",
                      width: "65px",
                      height: "65px",
                    }}
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
              )}
              {/* Retweet part */}
              {post.retweetedPostId && (
                <>
                  {/* <div>
                    <img src={post.postImageURL} alt="retweet-post-pic"></img>
                  </div>
                  <div>{post.retweetedPostData.desc}</div> */}
                  <div className="text-break mask-post w-100 d-flex justify-content-center align-items-center">
                    <div className="w-100 d-grid gap-3">
                      {/* Retweet's post */}
                      <div
                        className="d-flex flex-row rounded "
                        style={{
                          boxShadow: "0 0 0.7rem rgb(0 0 0 / 100%)",
                          aspectRatio: "4/3",
                        }}
                      >
                        <div
                          style={{ width: "75%" }}
                          className="d-flex justify-content-center align-items-center border-end border-white border-opacity-50"
                        >
                          {/* Retweet Post Image  */}
                          <img
                            src={post.postImageURL}
                            alt="Retweeted Post"
                            className="w-100 rounded-start"
                            style={{
                              boxShadow: "0 0 0.7rem rgb(0 0 0 / 100%)",
                              aspectRatio: "1/1",
                            }}
                          ></img>
                        </div>

                        <div
                          className="d-flex flex-column"
                          style={{ width: "25%" }}
                        >
                          {/* Retweeted Post's User Info */}
                          <div className="p-1 d-grid gap-1 border-bottom border-light border-opacity-50">
                            <div className="d-flex flex-row ">
                              <div>
                                {/* User Avatar */}
                                <img
                                  src={
                                    post.retweetedPostData.avatarURL
                                      ? post.retweetedPostData.avatarURL
                                      : images["avatar.png"]
                                  }
                                  alt="Retweeted Post's User Avatar"
                                  className="float-start post-user-avatar"
                                  style={{ height: "2.5rem" }}
                                ></img>
                              </div>
                              {/* User Name and ID */}
                              <div className="d-grid">
                                <div className="fw-bold">
                                  {post.retweetedPostData.username}
                                </div>
                                <div className="">
                                  #{post.retweetedPostData.userId}
                                </div>
                              </div>
                            </div>
                            {/* Post Time */}
                            <div className="text-muted fs-6">
                              <div>
                                {moment(
                                  post.retweetedPostData.timestamp
                                ).format("MMMM Do")}
                              </div>
                              <div>
                                {moment(
                                  post.retweetedPostData.timestamp
                                ).format("h:mm a")}
                              </div>
                            </div>
                          </div>
                          {/* Retweeted Post's Description */}
                          <div className="word-break p-1 overflow-y-scroll word-break">
                            {post.retweetedPostData.desc}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {/* Post Description */}
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
                <p className="text-break">{post.desc}</p>
              </div>
              {/* function bar  */}
              {!post.retweetedPostId && (
                <div
                  className="border-light border-opacity-50 pt-2 d-flex flex-row border-top justify-content-evenly"
                  id="post-function"
                >
                  {/* Like button */}
                  <div
                    className="btn rounded-0 px-5 w-30 d-flex flex-column justify-content-center border-0"
                    onClick={() => this.handleLikeClick(post._id, userId)}
                  >
                    <div>
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
                    <div className="d-flex justify-content-center align-items-center text-white p-1">
                      <div>{post.likeCount || 0}</div>
                    </div>
                  </div>
                  {/* Dislike button */}
                  <div
                    className="btn rounded-0 px-5 w-30 border-light border-opacity-50 border-top-0 border-end-0 border-bottom-0 d-flex flex-column justify-content-center"
                    onClick={() => this.handleDislikeClick(post._id, userId)}
                  >
                    <div>
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
                    <div className="d-flex justify-content-center align-items-center text-white p-1">
                      <div>{post.dislikeCount || 0}</div>
                    </div>
                  </div>
                  {/* Comment button */}
                  <div
                    className="btn rounded-0 px-5 border-light border-opacity-50 border-top-0 border-bottom-0 w-30 d-flex justify-content-center"
                    onClick={() => this.handleCommentClick(post)}
                  >
                    <img
                      className="white-img"
                      src={images["comment-alt.svg"]}
                      alt="comment"
                    />
                  </div>
                  {/* display comment section  */}
                  {this.state.showCommentInput && (
                    <div
                      className="overlay"
                      onClick={() => this.handleCommentClick(post)}
                    >
                      <div
                        className="comment-container d-flex "
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="comment-left border-end border-light border-opacity-50">
                          <div
                            id="comment-post-div"
                            className="h-100 d-flex justify-content-center align-items-center"
                          >
                            {/* post image  */}
                            <img
                              src={this.state.selectedPost.imageUrl}
                              className="post-image"
                              alt={this.state.selectedPost.desc}
                              style={{
                                display: "none",
                                borderRadius: "unset",
                                boxShadow:
                                  "10px 0 8px -4px rgb(0, 0, 0, 0.7), -10px 0 8px -4px rgb(0, 0, 0, 0.7)",
                              }}
                              ref={(el) => (this[`commentImage${index}`] = el)}
                              // onload success
                              onLoad={() => {
                                this[`spinner${index}`].style.display = "none";
                                this[`commentImage${index}`].style.display =
                                  "block";
                              }}
                            ></img>
                          </div>
                        </div>
                        <div className="comment-right">
                          <div
                            className="overflow-y-scroll"
                            style={{ height: "90%" }}
                          >
                            <div
                              // style={{ height: "20%" }}
                              className="overflow-hidden d-grid border-bottom border-light border-opacity-50"
                            >
                              <CommentUserID
                                postId={this.state.selectedPost._id}
                                userId={this.state.selectedPost.userId}
                                username={this.state.selectedPost.username}
                                userAvatar={this.state.selectedPost.avatarURL}
                                timestamp={this.state.selectedPost.timestamp}
                              />
                              <div className="p-2 text-break">
                                {this.state.selectedPost.desc}
                              </div>
                            </div>
                            <div
                              className="comment-list p-3"
                              // style={{ height: "80%" }}
                            >
                              {/* Display previous comments */}

                              {this.state.selectedPostcomments.map(
                                (comment, index) => (
                                  <Comment
                                    key={index}
                                    comment={comment.comment}
                                    userId={comment.userId}
                                    username={comment.username}
                                    userAvatar={comment.avatarURL}
                                    timestamp={comment.timestamp}
                                  />
                                )
                              )}
                            </div>
                          </div>
                          <div
                            style={{ height: "10%" }}
                            className="w-100 p-3 comment-input-section border-top border-light border-opacity-50 d-flex justify-content-evenly align-items-center"
                          >
                            {/* comment field  */}

                            {/* <input
                            type="text"
                            value={this.state.commentText}
                            onChange={this.handleCommentChange}
                            placeholder="Write your comment here..."
                          /> */}

                            <div
                              className="form-floating"
                              id="comment-input-div"
                            >
                              <textarea
                                name="Comment"
                                className="text-light border border-0 border-bottom"
                                id="floatingComment"
                                placeholder="Comment"
                                rows="1"
                                value={this.commentText}
                                onChange={this.handleCommentChange}
                              />
                              {/* <label htmlFor="floatingUsername">Comment</label> */}
                            </div>

                            {/* submit button  */}
                            {/* <button
                            onClick={() => this.submitComment(post._id, userId)}
                            disabled={!this.state.commentText.trim()}
                          >
                            Submit Comment
                          </button> */}
                            <div
                              className="d-flex justify-content-center align-items-center"
                              id="comment-submit-div"
                            >
                              <img
                                src={images["comment.svg"]}
                                className="white-img"
                                id="comment-submit"
                                alt="comment-submit"
                                onClick={() =>
                                  this.submitComment(
                                    this.state.selectedPost.postId
                                  )
                                }
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Retweet button */}
                  <div
                    onClick={() => {
                      this.handleRetweet(post);
                    }}
                    className="btn rounded-0 px-5 w-30 d-flex justify-content-center border-0"
                  >
                    <img
                      className="white-img"
                      src={images["arrows-retweet.svg"]}
                      alt="retweet"
                    />
                  </div>
                  {/* display retweet section  */}
                  {this.state.retweetHandled &&
                    this.state.selectedPost._id === post._id && (
                      <div
                        className="overlay"
                        // onClick={() => {
                        //   console.log(this.state.selectedPost._id);
                        //   console.log(post._id);
                        //   this.handleRetweet(post);
                        // }}
                      >
                        <Retweet
                          handleRetweet={this.handleRetweet}
                          // handleTweet={handleTweet}
                          // handlePostStatus={handlePostStatus}
                          userId={userId}
                          username={username}
                          userAvatar={userAvatar}
                          selectedPost={this.state.selectedPost}
                          showNotification={showNotification}
                        />
                      </div>
                    )}
                </div>
              )}
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
