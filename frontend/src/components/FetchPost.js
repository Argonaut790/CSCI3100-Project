import { Component, useContext } from "react";
import axios from "axios";
// import ScrollContext from "./ScrollContext";
import ImportAll from "./ImportAll";
import DeleteButtonContext from "./DeleteButtonContext";

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

const UserID = () => {
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
          <div className="fw-bold">UserName</div>
          <div>#UserID</div>
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
              <UserID />
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
                id="post-describtion "
                className="d-flex flex-column overflow-hidden"
              >
                <div className="h5 d-flex flex-row justify-content-between">
                  <div>UserName</div>
                  <div>post timestamp</div>
                </div>
                <p>#UserID {post.desc}</p>
              </div>
              <div
                className="pt-2 d-flex flex-row border-top justify-content-evenly"
                id="post-function"
              >
                <div className=" px-5 w-30 d-flex justify-content-center">
                  <img
                    className="white-img"
                    src={images["heart.svg"]}
                    alt="heart"
                  />
                </div>
                <div className="px-5 border-start border-end w-30 d-flex justify-content-center">
                  <img
                    className="white-img"
                    src={images["comment-alt.svg"]}
                    alt="comment"
                  />
                </div>

                <div className="px-5 w-30 d-flex justify-content-center">
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
