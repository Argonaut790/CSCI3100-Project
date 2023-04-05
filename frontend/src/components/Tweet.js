import { Component } from "react";
import axios from "axios";
// import Cropper from "cropperjs";
// import "cropperjs/dist/cropper.min.css";

import ImportAll from "./ImportAll";

const MAXLENGTH = 200;

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

class Tweet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      desc: "",
      wordCount: 0,
      previewURL: null,
      isLoading: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  onDescriptionChange = (e) => {
    let inputValue = e.target.value;

    // Update the state only if the limited input value is shorter than the current desc
    if (inputValue.split(/\s+/).length <= MAXLENGTH) {
      this.setState({ desc: inputValue });
    }

    // const descWordCount = this.state.desc.split(/\s+/).length;
    let inputLength = inputValue.split(/\s+/).length;
    const inputArray = inputValue.split(/\s+/);

    if (inputArray[inputLength - 1] === "") {
      inputLength--;
    }

    this.setState({ wordCount: inputLength });

    // Update the input element's height to fit its content
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;

    // console.log("wordCount " + this.state.wordCount);
    // console.log("words changed");
    // console.log(inputValue.split(/\s+/));
    // console.log(this.state.desc.split(/\s+/));
  };

  onPaste = (e) => {
    // Prevent the default paste behavior
    e.preventDefault();

    // Get the pasted text from the event
    const pastedText = e.clipboardData.getData("text");
    // console.log("Paste " + pastedText);

    // Use a regular expression to match the leading and trailing spaces
    let leadingSpaces = pastedText.match(/^\s+/);
    let trailingSpaces = pastedText.match(/\s+$/);

    // Extract the leading and trailing spaces, if any
    let leadingSpacesStr = leadingSpaces ? leadingSpaces[0] : "";
    let trailingSpacesStr = trailingSpaces ? trailingSpaces[0] : "";

    // Split the pasted text by whitespace characters and limit to 200 words
    const words = pastedText
      .trim()
      .split(/\s+/)
      .slice(0, MAXLENGTH - this.state.wordCount);

    let sliced =
      pastedText.trim().split(/\s+/).length !== words.length ? true : false;

    if (this.state.desc.split(/\s+/).length + words.length === MAXLENGTH + 1)
      sliced = true;

    // console.log(this.state.desc.split(/\s+/));
    // console.log(this.state.desc.split(/\s+/));
    // console.log("sliced " + sliced);

    // Prepend the leading spaces to the first word in the array
    if (leadingSpaces) {
      words[0] = leadingSpacesStr + words[0];
    }

    // Append the trailing spaces to the last word in the array
    if (!sliced && trailingSpaces) {
      words[words.length - 1] = words[words.length - 1] + trailingSpacesStr;
    }

    // Join the limited words back into a string
    const inputValue = words.join(" ");

    // console.log("Paste inputValue " + inputValue);

    // console.log("Paste words " + words.length);
    // Update the state with the limited pasted text
    const desc = this.state.desc + inputValue;
    if (this.state.wordCount <= MAXLENGTH) {
      this.setState({ wordCount: this.state.wordCount + words.length });
      this.setState({ desc: desc });

      console.log("words changed");
      console.log(inputValue.split(/\s+/));
      console.log(desc.split(/\s+/));
    }

    // Update the input element's height to fit its content
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // componentDidUpdate(prevProps, prevState) {
  //   if (
  //     this.state.previewURL !== prevState.previewURL &&
  //     this.state.previewURL
  //   ) {
  //     const imageElement = document.getElementById("preview");

  //     if (this.state.cropper) {
  //       this.state.cropper.destroy();
  //     }

  //     const cropper = new Cropper(imageElement, {
  //       aspectRatio: 1,
  //       viewMode: 1,
  //       autoCropArea: 1,
  //     });

  //     this.setState({ cropper });
  //   }
  // }

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
      console.log(previewURL);
      this.setState({ previewURL });
      // this.setState({ previewURL }, () => {
      //   // Initialize Cropper when an image is selected
      //   const imageElement = document.getElementById("preview");
      //   if (this.state.cropper) {
      //     this.state.cropper.destroy();
      //   }

      //   imageElement.onload = () => {
      //     const cropper = new Cropper(imageElement, {
      //       aspectRatio: 1,
      //       viewMode: 1,
      //       autoCropArea: 1,
      //     });

      //     this.setState({ cropper });
      //   };
      // });
    }
  }

  // async handleSubmit(e) {
  //   e.preventDefault();

  //   // Check if the cropper instance is not null
  //   if (this.state.cropper) {
  //     console.log("Cropper Passed Successfully");
  //     console.log(this.state.cropper);
  //     // Get the cropped image as a Blob
  //     this.state.cropper.getCroppedCanvas().toBlob(async (blob) => {
  //       const { desc } = this.state;

  //       // Create a FormData object and append the image file to it
  //       const formData = new FormData();
  //       formData.append("image", blob);

  //       // Add the description and tags fields to the formData object
  //       formData.append("desc", desc);

  //       console.log(formData);
  //       console.log(formData.get("image"));
  //       console.log(formData.get("desc"));

  //       try {
  //         await axios.post("http://localhost:5500/tweet", formData, {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         });

  //         console.log("Tweet submitted:", {
  //           desc: this.state.desc,
  //         });

  //         console.log("POST SUCCESSFULLY");

  //         // clear input fields and destroy the cropper instance
  //         this.setState({ image: null, desc: "", previewURL: null });
  //         this.state.cropper.destroy();
  //         this.setState({ cropper: null });
  //       } catch (e) {
  //         console.log(e);
  //         console.log("Can't Upload Image!");
  //       }
  //     });
  //   } else {
  //     console.log("Cropper instance is null, cannot get cropped image.");
  //   }
  // }

  async handleSubmit(e) {
    e.preventDefault();

    this.setState({ isLoading: true });
    const { desc, image } = this.state;

    // Create a FormData object and append the image file to it
    const formData = new FormData();
    formData.append("image", image);

    // Add the description field to the formData object
    formData.append("desc", desc);
    formData.append("userId", this.props.userId);

    try {
      await axios.post("http://localhost:5500/tweet", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      this.props.handlePostStatus(200);
      // clear input fields
      this.setState({ image: null, desc: "", previewURL: null });
      this.props.handleTweet();
      this.setState({ isLoading: false });
    } catch (e) {
      this.props.handlePostStatus(400);
      this.setState({ isLoading: false });
      console.log(e);
      console.log("Can't Upload Image!");
    }
  }

  handleClose() {
    this.props.handleTweet();
  }

  render() {
    return (
      <>
        <div
          className="container-fluid p-0 h-100 overflow-y-scroll"
          style={{
            position: "absolute",
            backgroundColor: "#00000070",
            zIndex: 2,
          }}
        >
          <form
            onSubmit={this.handleSubmit}
            className="row vh-100 d-flex justify-content-center align-items-center m-0"
            encType="multipart/form-data"
            id="tweet-form"
          >
            <div className="col-xl-4" id="tweet-section">
              <div
                className="text-break tweet-mask d-flex justify-content-center align-items-center"
                id="tweet-div"
              >
                <div className="w-100">
                  {/* User Info */}
                  <div className="post-user-info p-0 d-flex flex-row justify-content-between">
                    <div>
                      <img
                        src={images["user_avatar.jpg"]}
                        className="float-start post-user-avatar"
                        alt="user-avatar"
                      />
                      <div className="d-flex align-items-md-center h-100 m-0 post-user-id">
                        <div className="fw-bold">{this.props.username}</div>
                        <div>#{this.props.userId}</div>
                      </div>
                    </div>
                    <div
                      type="button"
                      className="btn btn-close"
                      id="upload-close-btn"
                      onClick={this.handleClose}
                      style={{ backgroundColor: "#c844ff" }}
                    ></div>
                  </div>
                  {/* Upload part */}
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
                    <div className="h4 m-0" style={{ padding: "0 0.75rem" }}>
                      UserName
                    </div>
                    <div className="form-floating h4">
                      <textarea
                        className="form-control"
                        placeholder="Description"
                        id="floatingTextarea2"
                        style={{
                          height: "auto",
                          fontSize: "unset",
                          overflow: "hidden",
                          resize: "none",
                        }}
                        value={this.state.desc}
                        onChange={this.onDescriptionChange}
                        onPaste={this.onPaste}
                        ref={(ref) => (this.textarea = ref)}
                      ></textarea>
                      <label htmlFor="floatingTextarea2">
                        Description {this.state.wordCount}/{MAXLENGTH}
                      </label>
                    </div>
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
                {this.state.isLoading && (
                  <div
                    className=" px-3 d-flex justify-content-center align-items-center"
                    // style={{ aspectRatio: "3/4" }}
                  >
                    <div className="spinner"></div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </>
    );
  }
}

export default Tweet;
