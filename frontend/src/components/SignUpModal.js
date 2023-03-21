import React, { useState } from "react";
import axios from "axios";

const SignUpModal = ({ setShowModal }) => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
            "This email has been registered. Please click 'Forgot Password' if you cannot login.";
        } else if (err.response.status === 401) {
          document.getElementById("result").innerText =
            "Invalid email / password.";
        } else {
          document.getElementById("result").innerText =
            "Unkown error, please try again.";
        }
      });

    setUserName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
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
  const onChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    document.getElementById("result").innerText = "";
    // Client-side validation
    const passwordRegEx = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
    );
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
    if (confirmPassword === "") {
      document.getElementById("result").innerText +=
        "Please confirm your password\n";
    }
    if (password !== confirmPassword) {
      document.getElementById("result").innerText +=
        "Your confirm password does not match\n";
    }
    if (!password.match(passwordRegEx)) {
      document.getElementById("result").innerText +=
        "Password must contains at least 1 upper case, 1 lower case, 1 number with the minimum length of 8 \n";
    }
    if (
      email !== "" &&
      username !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword &&
      password.match(passwordRegEx)
    ) {
      createAccount();
    }
  };

  return (
    <div className="modalContainer">
      <button
        type="button"
        className="btn-close"
        onClick={() => setShowModal(false)}
      ></button>
      <form className="d-flex flex-column" onSubmit={onSubmit}>
        <span>
          - at least length of 8, 1 upper case, 1 lower case, 1 number for
          password
        </span>
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
          id="sign-up-user"
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
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          className="user-input"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
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
