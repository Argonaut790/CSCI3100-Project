import { Component } from "react";
import axios from "axios";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";

import ImportAll from "./ImportAll";

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

const UserID = () => {
  return (
    <div className="post-user-info p-0">
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
      previewURL: null,
      cropper: null,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.previewURL !== prevState.previewURL &&
      this.state.previewURL
    ) {
      const imageElement = document.getElementById("preview");

      if (this.state.cropper) {
        this.state.cropper.destroy();
      }

      const cropper = new Cropper(imageElement, {
        aspectRatio: 1,
        viewMode: 1,
        autoCropArea: 1,
      });

      this.setState({ cropper });
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "file" ? target.files[0] : target.value;

    console.log(value);

    this.setState({
      image: value,
    });

    // Create a preview URL when an image is selected
    if (target.type === "file" && value) {
      const previewURL = URL.createObjectURL(value);
      this.setState({ previewURL }, () => {
        // Initialize Cropper when an image is selected
        const imageElement = document.getElementById("preview");
        if (this.state.cropper) {
          this.state.cropper.destroy();
        }

        imageElement.onload = () => {
          const cropper = new Cropper(imageElement, {
            aspectRatio: 1,
            viewMode: 1,
            autoCropArea: 1,
          });

          this.setState({ cropper });
        };
      });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Check if the cropper instance is not null
    if (this.state.cropper) {
      console.log("Cropper Passed Successfully");
      console.log(this.state.cropper);
      // Get the cropped image as a Blob
      this.state.cropper.getCroppedCanvas().toBlob(async (blob) => {
        const { desc } = this.state;

        // Create a FormData object and append the image file to it
        const formData = new FormData();
        formData.append("image", blob);

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

          // clear input fields and destroy the cropper instance
          this.setState({ image: null, desc: "", previewURL: null });
          this.state.cropper.destroy();
          this.setState({ cropper: null });
        } catch (e) {
          console.log(e);
          console.log("Can't Upload Image!");
        }
      });
    } else {
      console.log("Cropper instance is null, cannot get cropped image.");
    }
  }

  render() {
    return (
      <>
        <div className="col-md" id="content">
          <div className="container-fluid p-0 h-100 overflow-y-scroll">
            <form
              onSubmit={this.handleSubmit}
              action="POST"
              className="row vh-100 d-flex justify-content-center align-items-center m-0"
              enctype="multipart/form-data"
              id="tweet-form"
            >
              <div className="col-md-9" id="tweet-section">
                <div
                  className="text-break tweet-mask h-100 d-flex justify-content-center align-items-center"
                  id="tweet-div"
                >
                  <div className="w-100">
                    <UserID />
                    <div
                      className="container-fluid p-0 m-0 d-flex flex-column justify-content-center align-items-center m-0"
                      id="upload-container"
                    >
                      <label
                        htmlFor="image-upload"
                        className="row w-100 m-0 d-flex flex-column justify-content-center align-items-center tweet-mask h3 post-image"
                        id="upload-image-section"
                      >
                        {this.state.previewURL ? (
                          <img
                            src={this.state.previewURL}
                            // className="white-img"
                            id="preview"
                            alt="preview"
                          />
                        ) : (
                          <>
                            <img
                              src={images["upload.png"]}
                              className="white-img"
                              id="upload"
                              alt="upload icon"
                            />
                            <div>Click here to Upload an image</div>
                            <input
                              type="file"
                              className="cursor-pointer"
                              id="image-upload"
                              name="image"
                              accept="image/*"
                              onChange={this.handleInputChange}
                            />
                          </>
                        )}
                      </label>
                    </div>
                    <div className="p-0" id="post-describtion">
                      <h5>UserName</h5>
                      <p>Describtion</p>
                      <input
                        type="text"
                        name="desc"
                        placeholder="Description"
                        value={this.state.desc}
                        onChange={(e) =>
                          this.setState({ desc: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="p-y-2 d-flex justify-content-center align-items-center">
                  <button
                    type="submit"
                    className="col-md-8 p-0 m-0 d-flex justify-content-center align-items-center text-light h3"
                    id="post-submit"
                  >
                    Tweet
                  </button>
                </div>
              </div>
              {/* <div className="col-md p-0 tweet-mask" id="tweet-section">
                <div className="text-break post">
                  <UserID />
                  <div className="container-fluid m-0 p-3 h-100 d-flex flex-column justify-content-center align-items-center m-0">
                    <label
                      htmlFor="image-upload"
                      className="row m-0 d-flex flex-column justify-content-center align-items-center tweet-mask h3 post-image"
                      id="upload-image-section"
                    >
                      {this.state.previewURL ? (
                        <img
                          src={this.state.previewURL}
                          // className="white-img"
                          id="preview"
                          alt="preview"
                        />
                      ) : (
                        <>
                          <img
                            src={images["upload.png"]}
                            className="white-img"
                            id="upload"
                            alt="upload icon"
                          />
                          <div>Click here to Upload an image</div>
                          <input
                            type="file"
                            className="cursor-pointer"
                            id="image-upload"
                            name="image"
                            accept="image/*"
                            onChange={this.handleInputChange}
                          />
                        </>
                      )}
                    </label>
                  </div>
              <div className="col-md-8 tweet-mask" id="tweet-section">
                <div className="text-break post">
                  <UserID />
                  <div className="container-fluid m-0 p-3 h-100 d-flex flex-column justify-content-center align-items-center m-0">
                    <label
                      htmlFor="image-upload"
                      className="row m-0 d-flex flex-column justify-content-center align-items-center tweet-mask h3 post-image"
                      id="upload-image-section"
                    >
                      {this.state.previewURL ? (
                        <img
                          src={this.state.previewURL}
                          // className="white-img"
                          id="preview"
                          alt="preview"
                        />
                      ) : (
                        <>
                          <img
                            src={images["upload.png"]}
                            className="white-img"
                            id="upload"
                            alt="upload icon"
                          />
                          <div>Click here to Upload an image</div>
                          <input
                            type="file"
                            className="cursor-pointer"
                            id="image-upload"
                            name="image"
                            accept="image/*"
                            onChange={this.handleInputChange}
                          />
                        </>
                      )}
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
                  <button
                    type="submit"
                    className="col-md-8 p-0 d-flex justify-content-center align-items-center text-light h3"
                    id="post-submit"
                  >
                    Tweet
                  </button>
                </div>
              </div> */}
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default Tweet;
