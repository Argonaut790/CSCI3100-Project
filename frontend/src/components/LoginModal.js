import React, { useState, useRef } from "react";
import axios from "axios";

const LoginModal = ({ setShowModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const login = () => {
    console.log(checkAdmin(email));
    const user = {
      email: email,
      password: password,
    };
    axios
      .post("http://localhost:5500/account/login", user)
      .then((res) => {
        if (res.status === 200) {
          console.log("Signed in successfully");
          localStorage.setItem(
            "user",
            JSON.stringify({
              username: res.data.username,
              email: email,
              isAdmin: isAdmin,
              isGoogleSign: false,
            })
          );
          console.log(localStorage);
          //   this.props.history.push("/postlogon");
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          console.log("Error: ", err.response.status);
          document.getElementById("result").innerText = err.response.data;
        } else {
          console.log("Error: ", err.response.status);
          document.getElementById("result").innerText =
            "Wrong email / password";
        }
      });
  };

  const checkAdmin = (email) => {
    axios
      .get("http://localhost:5500/account/" + email)
      .then((res) => {
        console.log(res.data.user[0].isAdmin);
        if (res.status === 200) {
          setIsAdmin(res.data.user[0].isAdmin);
        } else {
          console.log("Unknown Error");
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          console.log("Error: ", err.response.status);
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
    //TODO: client-side validation
    e.preventDefault();
    document.getElementById("result").innerText = "";
    if (email === "") {
      document.getElementById("result").innerText = "Please enter your email\n";
    }
    if (password === "") {
      document.getElementById("result").innerText +=
        "Please enter your password\n";
    }
    if (email !== "" && password !== "") {
      login();
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
          type="password"
          name="password"
          id="password"
          className="user-input"
          placeholder="password"
          value={password}
          onChange={onChangePassword}
        />
        <div className="buttonContainer">
          <input type="submit" value="Login" className="btn btn-primary" />
        </div>
      </form>
      <span id="result"></span>
    </div>
  );
};

export default LoginModal;
