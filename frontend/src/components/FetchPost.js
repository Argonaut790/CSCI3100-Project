import { Component, useContext } from "react";
import axios from "axios";
// import ScrollContext from "./ScrollContext";
import ImportAll from "./ImportAll";
import DeleteButtonContext from "./DeleteButtonContext";
import moment from "moment";

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

// Get userId from localStorage
const userId = JSON.parse(localStorage.getItem("user")).userId;
// print the userId in console
console.log("userId is: " + userId);


const UserID = ({ userId, username }) => {
  const deleteButton = useContext(DeleteButtonContext);
  return (
    <div className="post-user-info d-flex flex-row justify-content-between">
      <div>
        <div>
          <img
            src={images["user_avatar.jpg"]}
            className="float-start post-user-avatar"
            alt="user-avatar"
          />
        </div>
        <div className="d-flex flex-cloumn align-items-md-center h-100 m-0 post-user-id">
          <div className="fw-bold">{username}</div>
          <div>#{userId}</div>
        </div>
      </div>
      {deleteButton && <div>{deleteButton}</div>}
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
      // limit the user to only like or dislike once every 10 seconds
      // I check the last time the user like or dislike the post
      const lastLikeTime = localStorage.getItem(`lastLikeTime_${postId}_${userId}`);
      const currentTime = Date.now();

      if (lastLikeTime && currentTime - lastLikeTime < 10 * 1000) {
        alert("You can only like or unlike once every 10 seconds.");
        return;
      }

      localStorage.setItem(`lastLikeTime_${postId}_${userId}`, currentTime);

      const response = await axios.get("http://localhost:5500/like", {
        params: {
          postId,
          userId,
        },
      });

      if (response.data.isLiked) {
        // If the post is already liked, send a DELETE request to unlike it
        await axios.delete("http://localhost:5500/like", {
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
              localStorage.setItem("likedPosts", JSON.stringify(this.state.likedPosts));
            }
        );
      } else {
        // If the post is not liked yet, send a POST request to like it
        await axios.post("http://localhost:5500/like", {
          postId,
          userId,
        });
        console.log("Liked successfully:", response.data);
        this.setState(
            (prevState) => ({
              likedPosts: [...prevState.likedPosts, postId],
            }),
            () => {
              localStorage.setItem("likedPosts", JSON.stringify(this.state.likedPosts));
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
      // limit the user to only like or dislike once every 10 seconds
      // I check the last time the user like or dislike the post
      const lastdislikeTime = localStorage.getItem(`lastDislikeTime_${postId}_${userId}`);
      const currentTime = Date.now();

      if (lastdislikeTime && currentTime - lastdislikeTime < 10 * 1000) {
        alert("You can only dislike or undislike once every 10 seconds.");
        return;
      }

      localStorage.setItem(`lastDislikeTime_${postId}_${userId}`, currentTime);

      const response = await axios.get("http://localhost:5500/dislike", {
        params: {
          postId,
          userId,
        },
      });
      if (response.data.isDisliked) {
        // If the post is already liked, send a DELETE request to unlike it
        await axios.delete("http://localhost:5500/dislike", {
          params: {
            postId,
            userId,
          },
        });
        console.log("UnDisliked successfully:", response.data);
        this.setState(
            (prevState) => ({
              dislikedPosts: prevState.dislikedPosts.filter((id) => id !== postId),
            }),
            () => {
              localStorage.setItem("dislikedPosts", JSON.stringify(this.state.dislikedPosts));
            }
        );
      } else {
        // If the post is not liked yet, send a POST request to like it
        await axios.post("http://localhost:5500/dislike", {
          postId,
          userId,
        });
        console.log("Disliked successfully:", response.data);
        this.setState(
            (prevState) => ({
              dislikedPosts: [...prevState.dislikedPosts, postId],
            }),
            () => {
              localStorage.setItem("dislikedPosts", JSON.stringify(this.state.dislikedPosts));
            }
        );
      }
    } catch (error) {
      console.error("Error disliking post:", error);
      alert("Debug 3");
    }
  };

  fetchPosts = async () => {
    const { page } = this.state;
    try {
      this.setState({ isLoading: true });
      const response = await axios.get(
        `http://localhost:5500/tweet?limit=10&page=${page}`
      );
      const posts = response.data;

      if (posts.length === 0) {
        this.setState({ hasMore: false });
      } else {
        for (const post of posts) {
          const imageResponse = await axios.get(
            `http://localhost:5500/tweet/image/${post.image.filename}`,
            {
              responseType: "blob",
            }
          );

          const imageURL = URL.createObjectURL(imageResponse.data);

          this.setState((prevState) => ({
            posts: [...prevState.posts, { ...post, imageURL }],
          }));
        }
        this.setState((prevState) => ({ page: prevState.page + 1 }));
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

    return (
      <div className="container-fluid p-0" id="mid-center">
        <div
          className="row d-flex justify-content-center"
          id="post-list"
          // ref={this.postListRef}
        >
          {posts.map((post, index) => (
            <div className="mask-post p-0" id="post" key={index}>
              <UserID userId={post.userId} username={post.username} />
              <div
                className="post-image-div d-flex justify-content-center align-items-center"
                style={{ aspectRatio: "1/1" }}
              >
                <div
                  className="spinner"
                  style={{ aspectRatio: "1/1", width: "65px", height: "65px" }}
                  ref={(el) => (this[`spinner${index}`] = el)}
                ></div>
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
                <div
                  className="btn rounded-0 px-5 w-30 d-flex justify-content-center border-0"
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
                <div
                  className="btn rounded-0 px-5 w-30 border-light border-opacity-50 border-top-0 border-end-0 border-bottom-0 d-flex justify-content-center"
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
                <div className="btn rounded-0 px-5 border-light border-opacity-50 border-top-0 border-bottom-0 w-30 d-flex justify-content-center">
                  <img
                    className="white-img"
                    src={images["comment-alt.svg"]}
                    alt="comment"
                  />
                </div>

                <div className="btn rounded-0 px-5 w-30 d-flex justify-content-center border-0">
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
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

// FetchPost.contextType = ScrollContext;

export default FetchPost;
