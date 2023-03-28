import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LoginModal";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const clientId =
    "221274346471-hn17eih5bjq1p6kprlcal0g9cv644sqm.apps.googleusercontent.com";
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const onGoogleSignInSuccess = (response) => {
    //TODO: Create special handling for google signin
    const userObject = jwt_decode(response.credential);
    const user = {
      username: userObject.name,
      email: userObject.email,
      avatar: userObject.picture,
      isGoogleSign: true,
    };
    if (
      userObject.name === "" ||
      userObject.email === "" ||
      userObject.picture === ""
    ) {
      document.getElementById("errorMessage").innerText =
        "Unkown error, please try again or sign up with another method.";
      return;
    }
    axios
      .post("http://localhost:5500/account", user)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              userId: res.data.userId,
            })
          );
          navigate("/");
        }
      })
      .catch((err) => {
        document.getElementById("errorMessage").innerText = err.response.data;
      });
  };

  const handleSignUp = () => {
    setShowSignUpModal(true);
    setShowLoginModal(false);
  };

  const handleLogIn = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };

  const onGoogleSignInFailure = (response) => {
    console.log("Google sign in failed.");
    console.log(response);
  };

  return (
    <div id="signUp" className="signUpContainer d-grid gap-2 p-3" key="signUp">
      <h2>New to Rettiwt?</h2>

      <button type="button" className="btn btn-light" onClick={handleSignUp}>
        Sign Up with Email
      </button>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={onGoogleSignInSuccess}
          onError={onGoogleSignInFailure}
        />
      </GoogleOAuthProvider>
      <button type="button" className="btn btn-light" onClick={handleLogIn}>
        Already have an account?
      </button>
      <span id="errorMessage"></span>
      {showSignUpModal ? (
        <SignUpModal setShowModal={setShowSignUpModal} />
      ) : null}
      {showLoginModal ? <LoginModal setShowModal={setShowLoginModal} /> : null}
    </div>
  );
};

export default SignUp;
