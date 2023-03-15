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
        <div class="fw-bold">UserName</div>
        <div>#UserID</div>
      </div>
    </div>
  );
};

// const PostDescription = () => {
//   return (
//     <div id="post-describtion">
//       <h5>UserName</h5>
//       <p>Describtion</p>
//       <input
//         type="text"
//         name="desc"
//         placeholder="Description"
//         value={this.state.desc}
//         onChange={(e) => this.setState({ desc: e.target.value })}
//       />
//     </div>
//   );
// };

class Tweet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      desc: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    // const name = target.name;
    const value = target.type === "file" ? target.files[0] : target.value;

    console.log(value);

    this.setState({
      image: value,
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { image, desc } = this.state;

    // Create a FormData object and append the image file to it
    const formData = new FormData();
    formData.append("image", image);

    // Add the description and tags fields to the formData object
    formData.append("desc", desc);

    console.log(formData);
    console.log(formData.get("image"));
    console.log(formData.get("desc"));

    try {
      await axios.post("http://localhost:5500/tweet", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Tweet submitted:", {
        desc: this.state.desc,
      });

      console.log("POST SUCCESSFULLY");

      // clear input fields
      this.setState({ image: null, desc: "" });
    } catch (e) {
      console.log(e);
      console.log("Can't Upload Image!");
    }
  }

  render() {
    return (
      <>
        <div className="col-md" id="content">
          <div className="container-fluid p-0 h-100">
            <form
              onSubmit={this.handleSubmit}
              action="POST"
              className="row vh-100 d-flex justify-content-center align-items-center m-0"
              enctype="multipart/form-data"
            >
              <div className="col-md-8 p-0 tweet-mask" id="tweet-section">
                <div className="text-break post">
                  <UserID />
                  <div className="container-fluid m-0 p-3 h-100 d-flex flex-column justify-content-center align-items-center m-0">
                    <label
                      htmlFor="image-upload"
                      className="row m-0 d-flex flex-column justify-content-center align-items-center tweet-mask h3 post-image"
                    >
                      <img
                        src={images["upload.png"]}
                        className="white-img"
                        id="upload"
                        alt="upload icon"
                      />
                      <div>Click here to Upload an image</div>
                      <input
                        type="file"
                        id="image-upload"
                        name="image"
                        accept="image/*"
                        onChange={this.handleInputChange}
                        // style={{ display: "none" }}
                      />
                    </label>
                  </div>
                  <div id="post-describtion">
                    <h5>UserName</h5>
                    <p>Describtion</p>
                    <input
                      type="text"
                      name="desc"
                      placeholder="Description"
                      value={this.state.desc}
                      onChange={(e) => this.setState({ desc: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="col-md-8 p-0 d-flex justify-content-center align-items-center text-light h3"
                id="post-submit"
              >
                Tweet
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default Tweet;
