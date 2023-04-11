import { Component } from "react";
import axios from "axios";
// import Cropper from "cropperjs";
// import "cropperjs/dist/cropper.min.css";

import ImportAll from "./ImportAll";
import moment from "moment";

const MAXLENGTH = 200;

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

class Retweet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      desc: "",
      wordCount: 0,
      previewURL: null,
      isLoading: false,
      selectedPost: this.props.selectedPost,
      userAvatar: images["avatar.png"],
      userId: "defaultUserId",
      username: "defaultUsername",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount = () => {
    // Get userId from localStorage
    if (localStorage.getItem("user"))
      this.setState({
        userId: JSON.parse(localStorage.getItem("user")).userId,
      });

    // Get username from localStorage
    if (localStorage.getItem("username"))
      this.setState({
        username: JSON.parse(localStorage.getItem("username")).username,
      });

    // Get userAvatar from localStorage
    if (localStorage.getItem("userAvatar"))
      this.setState({
        userAvatar: JSON.parse(localStorage.getItem("userAvatar")).userAvatar,
      });

    console.log("selectedPost: " + this.state.selectedPost);
    console.dir(this.state.selectedPost);
  };

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
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    this.setState({ isLoading: true });
    const { desc, userId, selectedPost } = this.state;

    try {
      await axios.post(process.env.REACT_APP_DEV_API_PATH + "/tweet/retweet", {
        desc,
        userId,
        retweetedPostId: selectedPost.postId,
      });
      console.log("Retweet Success!");
      // this.props.handlePostStatus(200);

      // clear input fields
      this.setState({ desc: "", selectedPost: null });
      this.props.handleRetweet();
      this.setState({ isLoading: false });
      // showNotification("POST SUCCESSFULLY", "success");
    } catch (e) {
      // this.props.handlePostStatus(400);
      this.setState({ isLoading: false });
      console.log(e);
      console.log("Can't Upload Image!");
      // showNotification("POST FAILED SUCCESSFULLY", "error");
    }
  }

  handleClose() {
    this.props.handleRetweet();
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
                <div className="w-100 d-grid gap-3">
                  {/* User Info */}
                  <div className="post-user-info p-0 d-flex flex-row justify-content-between">
                    <div>
                      <img
                        src={this.state.userAvatar}
                        className="float-start post-user-avatar"
                        alt="user-avatar"
                      />
                      <div className="d-flex align-items-md-center h-100 m-0 post-user-id">
                        <div className="fw-bold">{this.state.username}</div>
                        <div>#{this.state.userId}</div>
                      </div>
                    </div>
                    <div
                      type="button"
                      className="btn btn-close"
                      id="upload-close-btn"
                      onClick={this.props.handleRetweet}
                      style={{ backgroundColor: "#c844ff" }}
                    ></div>
                  </div>
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
                        src={this.state.selectedPost.imageUrl}
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
                                this.state.selectedPost.avatarURL
                                  ? this.state.selectedPost.avatarURL
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
                              {this.state.selectedPost.username}
                            </div>
                            <div className="">
                              #{this.state.selectedPost.userId}
                            </div>
                          </div>
                        </div>
                        {/* Post Time */}
                        <div className="text-muted fs-6">
                          <div>
                            {moment(this.state.selectedPost.timestamp).format(
                              "MMMM Do"
                            )}
                          </div>
                          <div>
                            {moment(this.state.selectedPost.timestamp).format(
                              "h:mm a"
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Retweeted Post's Description */}
                      <div className="word-break p-1 overflow-y-scroll word-break">
                        {this.state.selectedPost.desc}
                      </div>
                    </div>
                  </div>
                  {/* New Description */}
                  <div className="p-0" id="post-description">
                    <div className="h4 m-0" style={{ padding: "0 0.75rem" }}>
                      {this.state.username}
                    </div>
                    <div className="form-floating h4 text-muted">
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

export default Retweet;
