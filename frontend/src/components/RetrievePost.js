import { Component } from "react";
import axios from "axios";

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      data: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { username, email, password } = this.state;
    try {
      await axios.post("http://localhost:5500/test", {
        username,
        email,
        password,
      });
      console.log("POST SUCCESSFULLY");

      // clear input fields
      this.setState({ username: "", email: "", password: "" });

      // Fetch the updated data from the server
      const response = await axios.get("http://localhost:5500/test");
      this.setState({ data: response.data });
    } catch (e) {
      console.log(e);
      console.log("can't POST!");
    }
  }

  async componentDidMount() {
    // Fetch the initial data from the server on mount
    try {
      const response = await axios.get("http://localhost:5500/test");
      this.setState({ data: response.data });
    } catch (e) {
      console.log(e);
      console.log("can't GET!");
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} action="POST">
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={(e) => this.setState({ username: e.target.value })}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={this.state.email}
              onChange={(e) => this.setState({ email: e.target.value })}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={(e) => this.setState({ password: e.target.value })}
              required
            />
          </label>
          <button type="submit">Create Account</button>
        </form>

        <h2>Existing Accounts:</h2>
        <ul>
          {this.state.data.map((item) => (
            <li key={item._id}>
              <h4>{item.username}</h4>
              <p>{item.email}</p>
              <p>{item._id}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
