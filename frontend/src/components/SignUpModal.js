import React, { useState, useRef } from "react";
import axios from "axios";

const SignUpModal = ({ setShowModal }) => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createAccount = () => {
    const user = {
      username: username,
      email: email,
      password: password,
      isGoogleSign: false,
    };

    axios
      .post("http://localhost:5500/account", user)
      .then((res) => {
        if (res.status === 200) {
          console.log("Signed Up successfully");
          document.getElementById("result").innerText =
            "User was registered successfully! Please check your email";
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          document.getElementById("result").innerText =
            "This email has been registered.";
        } else {
          document.getElementById("result").innerText =
            "Unkown error, please try again.";
        }
      });

    setUserName("");
    setEmail("");
    setPassword("");
  };

  const onChangeUsername = (e) => {
    setUserName(e.target.value);
  };
  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = (e) => {
    //TODO: client-side validation
    e.preventDefault();
    document.getElementById("result").innerText = "";
    if (email === "") {
      document.getElementById("result").innerText = "Please enter your email\n";
    }
    if (username === "") {
      document.getElementById("result").innerText +=
        "Please enter your username\n";
    }
    if (password === "") {
      document.getElementById("result").innerText +=
        "Please enter your password\n";
    }
    if (email !== "" && username !== "" && password !== "") {
      createAccount();
    }
  };

  return (
    <div className="modalContainer">
      <button onClick={() => setShowModal(false)}>X</button>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          id="email"
          className="email-input"
          placeholder="email"
          value={email}
          onChange={onChangeEmail}
        />
        <input
          type="text"
          name="username"
          id="user"
          className="user-input"
          placeholder="username"
          value={username}
          onChange={onChangeUsername}
        />
        <input
          type="password"
          name="password"
          id="password"
          className="user-input"
          placeholder="password"
          value={password}
          onChange={onChangePassword}
        />
        <div className="buttonContainer">
          <input
            type="submit"
            value="Create Account"
            className="btn btn-primary"
          />
        </div>
      </form>
      <span id="result"></span>
    </div>
  );
};

export default SignUpModal;
