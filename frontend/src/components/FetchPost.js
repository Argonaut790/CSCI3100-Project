import { Component } from "react";
import axios from "axios";

import ImportAll from "./ImportAll";

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

const UserID = () => {
  return (
    <div className="post-user-info">
      <img
        src={images["user_avatar.jpg"]}
        className="float-start post-user-avatar"
        alt="user-avatar"
      />
      <div className="d-flex align-items-md-center h-100 m-0 post-user-id">
        <div className="fw-bold">UserName</div>
        <div>#UserID</div>
      </div>
    </div>
  );
};

class FetchPost extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      isLoading: false,
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get("http://localhost:5500/tweet");
      const posts = response.data;

      for (const post of posts) {
        this.setState({ isLoading: true });
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
    } catch (error) {
      console.error("Error fetching posts:", error);
    }

    this.setState({ isLoading: false });
  }

  render() {
    const { posts } = this.state;

    return (
      <div className="container-fluid p-0" id="mid-center">
        <div className="row d-flex justify-content-center" id="post-list">
          {posts.map((post, index) => (
            <div className="mask-post p-0" id="post" key={index}>
              <UserID />
              <div className="post-image-div">
                <img
                  src={post.imageURL}
                  className="post-image"
                  alt={post.desc}
                />
              </div>
              <div id="post-describtion">
                <h5>UserName</h5>
                <p>{post.desc}</p>
              </div>
            </div>
          ))}
          {this.state.isLoading && (
            <div className="mask-post p-0 d-flex justify-content-center align-items-center">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default FetchPost;
