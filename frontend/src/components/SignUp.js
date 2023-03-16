import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import SignUpForm from "./SignUpForm";

const SignUp = () => {
  const clientId =
    "221274346471-hn17eih5bjq1p6kprlcal0g9cv644sqm.apps.googleusercontent.com";
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");

  const onGoogleSignInSuccess = (response) => {
    //TODO: Create special handling for google signin
    const userObject = jwt_decode(response.credential);
    setUserName(userObject.name);
    setEmail(userObject.email);

    const user = {
      username: username,
      email: email,
      password: "",
      isGoogleSign: true,
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

    localStorage.setItem(
      "user",
      JSON.stringify({
        username: username,
        email: email,
        isAdmin: false,
        isGoogleSign: true,
      })
    );
    //TODO: redirect to postlogon page
  };

  const onGoogleSignInFailure = (response) => {
    console.log("Google sign in failed.");
    console.log(response);
  };

  return (
    <div id="signUp" className="signUpContainer" key="signUp">
      <h2>New to Rettiwt?</h2>
      <Link
        to={`/signup`}
        className={`signUpEmailLink`}
        style={{ cursor: "pointer" }}
      >
        Sign Up with Email
      </Link>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={onGoogleSignInSuccess}
          onError={onGoogleSignInFailure}
        />
      </GoogleOAuthProvider>
      <Routes>
        <Route path="/signup" element={<SignUpForm />} />
      </Routes>
    </div>
  );
};

export default SignUp;
