import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ setShowModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = () => {
    const user = {
      email: email,
      password: password,
    };
    axios
      .post("http://localhost:5500/account/login", user)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          document.getElementById("result").innerText =
            "Logged in successfully!";
          const userData = {
            userId: res.data.userId,
            username: res.data.username,
            email: email,
            isPrivate: res.data.isPrivate,
            isAdmin: res.data.isAdmin,
            isGoogleSign: false,
          };

          localStorage.setItem("user", JSON.stringify(userData));
          navigate("/");
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          console.log("Error: ", err.response.status);
          document.getElementById("result").innerText = err.response.data;
        } else {
          console.log("Error: ", err.response.status);
          document.getElementById("result").innerText =
            "Invalid email / password";
        }
      });
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = (e) => {
    let isEmailInvalid = false;
    let isPasswordInvalid = false;

    //TODO: client-side validation
    e.preventDefault();
    document.getElementById("result").innerText = "";
    if (email === "") {
      isEmailInvalid = true;
    } else {
      isEmailInvalid = false;
    }
    if (password === "") {
      isPasswordInvalid = true;
    }

    if (isPasswordInvalid || isEmailInvalid) {
      document.getElementById("result").innerText +=
        "- Please enter your " +
        (isEmailInvalid ? "email" : "") +
        (isPasswordInvalid ? " password" : "");
    }

    if (email !== "" && password !== "") {
      login();
    }

    // Add "is-invalid" class to input fields that match the syntax
    document.getElementById("floatingEmail").className = isEmailInvalid
      ? "form-control floating is-invalid"
      : "form-control floating";
    document.getElementById("floatingPassword").className = isPasswordInvalid
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

      <form onSubmit={onSubmit}>
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

        <div className="form-floating mb-3">
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

        <div className="buttonContainer d-grid">
          <input
            type="submit"
            value="Login"
            className="btn btn-outline-warning"
          />
        </div>
      </form>
      <button>Forgot password?</button>
      <span id="result"></span>
    </div>
  );
};

export default LoginModal;
