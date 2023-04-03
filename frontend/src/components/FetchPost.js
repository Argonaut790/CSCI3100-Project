import { Component } from "react";
import axios from "axios";
// import ScrollContext from "./ScrollContext";
import ImportAll from "./ImportAll";
// import DeleteButtonContext from "./DeleteButtonContext";
import moment from "moment";

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

const UserID = ({ postId, userId, username, deleteButton }) => {
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

  const handleDeletePost = async (postId) => {
    // setdeleteButton(true);
    const res = await axios.delete("http://localhost:5500/tweet/" + postId);
    if (!res.error) {
      console.log(res);
    } else {
      console.log(res);
    }
  };

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
   *   Version: 1.0 (28/3/2023)
   *   Description: This module is used to handle the like and dislike button
   *   and send the request to the backend. It will also limit the user to
   *   only like or dislike once every 10 seconds (otherwise warning message will be given).
   *
   *   Parameter: postId, userId to post
   * */

  handleLikeClick = async (postId, userId) => {
    try {
      const response = await axios.post("http://localhost:5500/like", {
        postId,
        userId,
      });

      if (response.status === 429) {
        alert("You can only like or unlike once every 10 seconds.");
      } else {
        console.log("Liked successfully:", response.data);
      }
    } catch (error) {
      console.error("Error liking post:", error);
      alert("An error occurred, please try again later.");
    }
  };

  handleDislikeClick = async (postId, userId) => {
    try {
      const response = await axios.post("http://localhost:5500/dislike", {
        postId,
        userId,
      });

      if (response.status === 429) {
        alert("You can only dislike or undislike once every 10 seconds.");
      } else {
        console.log("Disliked successfully:", response.data);
      }
    } catch (error) {
      console.error("Error liking post:", error);
      alert("An error occurred, please try again later.");
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
              />
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
                  onClick={() => this.handleLikeClick(post._id, "userId")}
                >
                  <img
                    className="white-img"
                    src={images["like.svg"]}
                    alt="like"
                  />
                </div>
                <div
                  className="btn rounded-0 px-5 w-30 border-light border-opacity-50 border-top-0 border-end-0 border-bottom-0 d-flex justify-content-center"
                  onClick={() => this.handleDislikeClick(post._id, "userId")}
                >
                  <img
                    className="white-img"
                    src={images["dislike.svg"]}
                    alt="dislike"
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
