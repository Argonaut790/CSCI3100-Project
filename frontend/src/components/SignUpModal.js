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
            "Unknown error, please try again.";
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

    let isEmailInvalid = false;
    let isUsernameInvalid = false;
    let isPasswordInvalid = false;
    let isConfirmPasswordInvalid = false;
    let isUsernameLengthInvalid = false;

    document.getElementById("result").innerText = "";
    // Client-side validation
    const passwordRegEx = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
    );
    if (email === "") {
      isEmailInvalid = true;
    } else {
      isEmailInvalid = false;
    }
    if (username === "") {
      isUsernameInvalid = true;
    } else if(username.length > 8){
        document.getElementById("result").innerText +=
            "- Username must be less than 9 characters\n";
        isUsernameLengthInvalid = true;
    }
    else {
      isUsernameInvalid = false;
    }
    if (password === "") {
      isPasswordInvalid = true;
    }
    if (confirmPassword === "") {
      isConfirmPasswordInvalid = true;
    }
    if (password !== confirmPassword) {
      document.getElementById("result").innerText +=
        "- Your confirm password does not match\n";
      isPasswordInvalid = true;
      isConfirmPasswordInvalid = true;
    }
    if (!password.match(passwordRegEx)) {
      document.getElementById("result").innerText +=
        "- Password must contains at least 1 upper case, 1 lower case, 1 number with the minimum length of 8 \n";
      isPasswordInvalid = true;
      isConfirmPasswordInvalid = true;
    }

    if (
      isPasswordInvalid ||
      isConfirmPasswordInvalid ||
      isEmailInvalid ||
      isUsernameInvalid
    ) {
      document.getElementById("result").innerText +=
        "- Please enter your " +
        (isEmailInvalid ? "email" : "") +
        (isUsernameInvalid ? " username" : "") +
        (isPasswordInvalid ? " password" : "") +
        (isConfirmPasswordInvalid ? " and confirm your password " : "");
    }

    if (
      email !== "" &&
      username !== "" &&
      isUsernameLengthInvalid === false &&
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword &&
      password.match(passwordRegEx)
    ) {
      createAccount();
    }

    // Add "is-invalid" class to input fields that match the syntax
    document.getElementById("floatingEmail").className = isEmailInvalid
      ? "form-control floating is-invalid"
      : "form-control floating";
    document.getElementById("floatingUsername").className = isUsernameInvalid
      ? "form-control floating is-invalid"
      : "form-control floating";
    document.getElementById("floatingUsername").className = isUsernameLengthInvalid
        ? "form-control floating is-invalid"
        : "form-control floating";
    document.getElementById("floatingPassword").className = isPasswordInvalid
      ? "form-control floating is-invalid"
      : "form-control floating";
    document.getElementById("floatingConfirmPassword").className =
      isConfirmPasswordInvalid
        ? "form-control floating is-invalid"
        : "form-control floating";
  };

  return (
    <div className="modalContainer">
      <button
        type="button"
        className="btn-close"
        onClick={() => setShowModal(false)}
      ></button>

      <form className="d-flex flex-column" onSubmit={onSubmit}>
        <div className="h6">
          - At least length of 8, 1 upper case, 1 lower case, 1 number for
          password
        </div>
        <div className="form-floating ">
          <input
            type="email"
            name="email"
            className="form-control floating"
            id="floatingEmail"
            placeholder="email"
            value={email}
            onChange={onChangeEmail}
          />
          <label for="floatingInput">Email address</label>
        </div>

        <div className="form-floating">
          <input
            type="text"
            name="username"
            className="form-control floating"
            id="floatingUsername"
            placeholder="username"
            value={username}
            onChange={onChangeUsername}
          />
          <label for="floatingInput">Username</label>
        </div>

        <div className="form-floating">
          <input
            type="password"
            name="password"
            className="form-control floating"
            id="floatingPassword"
            placeholder="password"
            value={password}
            onChange={onChangePassword}
          />
          <label for="floatingPassword">Password</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="password"
            name="confirmPassword"
            className="form-control floating"
            id="floatingConfirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={onChangeConfirmPassword}
          />
          <label for="floatingPassword">Confirm Password</label>
        </div>

        <div className="buttonContainer d-grid">
          <input
            type="submit"
            value="Create Account"
            className="btn btn-outline-warning"
          />
        </div>
      </form>
      <span id="result"></span>
    </div>
  );
};

export default SignUpModal;
