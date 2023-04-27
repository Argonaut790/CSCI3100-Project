import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ setShowModal, setShowForgotPasswordModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = () => {
    const user = {
      email: email,
      password: password,
    };
    axios
      .post(process.env.REACT_APP_DEV_API_PATH + "/account/login", user)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          document.getElementById("result").innerText =
            "Logged in successfully!";

          localStorage.setItem(
            "user",
            JSON.stringify({ userId: res.data.userId })
          );

          navigate("/");
          window.location.reload();
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          document.getElementById("result").innerText = err.response.data;
        } else {
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

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
    setShowModal(false);
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
          <label htmlFor="floatingEmail">Email address</label>
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
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <div className="buttonContainer d-grid">
          <input
            type="submit"
            value="Login"
            className="btn btn-outline-warning"
          />
        </div>
      </form>
      <div className="d-grid gap-1 pt-2">
        <button className="btn btn-light" onClick={handleForgotPassword}>
          Forgot Password?
        </button>
        <span id="result"></span>
      </div>
    </div>
  );
};
// forgot password button ||
export default LoginModal;
