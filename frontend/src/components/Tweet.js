import { Component } from "react";
import axios from "axios";

import ImportAll from "./ImportAll";

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

class Tweet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: "image",
      desc: "",
      tags: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { image, desc, tags } = this.state;
    try {
      await axios.post("http://localhost:5500/tweet", {
        image,
        desc,
        tags,
      });

      console.log("Tweet submitted:", {
        desc: this.state.desc,
        tags: this.state.tags,
      });

      console.log("POST SUCCESSFULLY");

      // clear input fields
      this.setState({ image: "", desc: "", tags: "" });
    } catch (e) {
      console.log(e);
      console.log("Can't POST!");
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
              className="row vh-100 d-flex flex-column justify-content-center align-items-center m-0"
            >
              <div
                className="col-md-8 p-0 d-flex justify-content-center align-items-center tweet-mask"
                id="tweet-section"
              >
                <div className="container-fluid m-0 p-3 h-100 d-flex flex-column justify-content-center align-items-center m-0">
                  <a
                    href="/tweet"
                    className="row m-0 d-flex flex-column justify-content-center align-items-center tweet-mask h3 post-image"
                    id="upload-image-section"
                  >
                    <img
                      src={images["upload.png"]}
                      className="white-img"
                      id="upload"
                      alt="upload icon"
                    />
                    <div>Click here to Upload an image</div>
                  </a>
                  <div className="row m-0 h4" id="tweet-describtion">
                    Description
                  </div>
                </div>
              </div>

              {/* <div className="col-md-8 p-0">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="input-section"
                    placeholder="Description"
                    value={this.state.desc}
                    onChange={(e) => this.setState({ desc: e.target.value })}
                  />
                  <label htmlFor="input-section">Description</label>
                </div>
              </div>
              <div className="col-md-8 p-0">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="input-section"
                    placeholder="Tags"
                    value={this.state.tags}
                    onChange={(e) => this.setState({ tags: e.target.value })}
                  />
                  <label htmlFor="input-section">Tags</label>
                </div>
              </div>
              <button
                type="submit"
                className="col-md-8 p-0 d-flex justify-content-center align-items-center text-light h3"
                id="post-submit"
              >
                Tweet
              </button> */}
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default Tweet;
