import React, { useState } from "react";
import axios from "axios";

const SignUpForm = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createAccount = () => {
    const user = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    };

    axios
      .post("http://localhost:5500/account", user)
      .then((res) => {
        if (res.status === 200) {
          console.log("Signed Up successfully");
          document.getElementById("list").innerText =
            "User was registered successfully! Please check your email";
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          document.getElementById("list").innerText =
            "This email has been registered.";
        } else {
          document.getElementById("list").innerText =
            "Unkown error, please try again.";
        }
      });

    this.setState({
      username: "",
      password: "",
      email: "",
    });
  };

  const onChangeUsername = (e) => {
    this.setState({
      username: e.target.value,
    });
  };
  const onChangeEmail = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  const onChangePassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    document.getElementById("list").innerText = "";
    if (this.state.email === "") {
      document.getElementById("list").innerText = "Please enter your email\n";
    }
    if (this.state.username === "") {
      document.getElementById("list").innerText +=
        "Please enter your username\n";
    }
    if (this.state.password === "") {
      document.getElementById("list").innerText +=
        "Please enter your password\n";
    }
    if (
      this.state.email !== "" &&
      this.state.username !== "" &&
      this.state.password !== ""
    ) {
      this.createAccount();
    }
  };

  return (
    <form onSubmit={this.onSubmit}>
      <div id="loginpage" className="login">
        <input
          type="email"
          name="email"
          id="email-f"
          className="email-f-input"
          placeholder="email"
          value={this.state.email}
          onChange={this.onChangeEmail}
        />
        <input
          type="text"
          name="username"
          id="user-f"
          className="user-f-input"
          placeholder="username"
          value={this.state.username}
          onChange={this.onChangeUsername}
        />
        <input
          type="password"
          name="password"
          id="password-f"
          className="user-f-input"
          placeholder="password"
          value={this.state.password}
          onChange={this.onChangePassword}
        />
        <div className="buttonContainer">
          <input
            type="submit"
            value="Create Account"
            className="btn btn-primary"
          />
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
