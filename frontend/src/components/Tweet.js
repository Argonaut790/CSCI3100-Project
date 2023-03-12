import { Component } from "react";
import axios from "axios";

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
              className="row d-flex flex-column justify-content-center align-items-center m-0"
            >
              <a
                href="/tweet"
                className="col-md-8 p-0 d-flex justify-content-center align-items-center h-100 h2 tweet-mask"
                id="upload-image-section"
              >
                Click here to upload an image
              </a>
              <div className="col-md-8 p-0">
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
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default Tweet;
