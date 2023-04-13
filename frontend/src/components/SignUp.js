import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LoginModal";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";

const SignUp = () => {
  const clientId =
    "221274346471-hn17eih5bjq1p6kprlcal0g9cv644sqm.apps.googleusercontent.com";
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
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
        "Unknown error, please try again or sign up with another method.";
      return;
    }
    axios
      .post(process.env.REACT_APP_DEV_API_PATH + "/account", user)
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
          window.location.reload();
        }
      })
      .catch((err) => {
        document.getElementById("errorMessage").innerText = err.response.data;
      });
  };

  const handleSignUp = () => {
    setShowSignUpModal(true);
    setShowForgotPasswordModal(false);
    setShowLoginModal(false);
  };

  const handleLogIn = () => {
    setShowSignUpModal(false);
    setShowForgotPasswordModal(false);
    setShowLoginModal(true);
  };

  const onGoogleSignInFailure = (response) => {
    console.log("Google sign in failed.");
    console.log(response);
  };

  return (
    <div id="signUp" className="signUpContainer d-grid gap-2 p-3" key="signUp">
      <h2>New to Rettiwt?</h2>

      <button type="button" className="btn btn-light" onClick={handleLogIn}>
        Already have an account?
      </button>

      <button type="button" className="btn btn-light" onClick={handleSignUp}>
        Sign Up with Email
      </button>

      <div>
        <GoogleOAuthProvider clientId={clientId}>
          <GoogleLogin
            theme="outline"
            type="standard"
            size="large"
            text="signup_with"
            shape="circle"
            // width="250"
            locale="en"
            onSuccess={onGoogleSignInSuccess}
            onError={onGoogleSignInFailure}
          />
        </GoogleOAuthProvider>
      </div>

      <span id="errorMessage"></span>
      {showSignUpModal ? (
        <SignUpModal setShowModal={setShowSignUpModal} />
      ) : null}
      {showLoginModal ? (
        <LoginModal
          setShowModal={setShowLoginModal}
          setShowForgotPasswordModal={setShowForgotPasswordModal}
        />
      ) : null}
      {showForgotPasswordModal ? (
        <ForgotPasswordModal setShowModal={setShowForgotPasswordModal} />
      ) : null}
    </div>
  );
};

export default SignUp;
