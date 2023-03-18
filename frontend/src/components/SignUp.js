import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LoginModal";

const SignUp = () => {
  const clientId =
    "221274346471-hn17eih5bjq1p6kprlcal0g9cv644sqm.apps.googleusercontent.com";
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const onGoogleSignInSuccess = (response) => {
    //TODO: Create special handling for google signin
    const userObject = jwt_decode(response.credential);
    setUserName(userObject.name);
    setEmail(userObject.email);

    const user = {
      username: username,
      email: email,
      isGoogleSign: true,
    };

    axios
      .post("http://localhost:5500/account", user)
      .then((res) => {
        if (res.status === 200) {
          console.log("Signed Up successfully"); // For dev
        }
      })
      .catch((err) => {
        document.getElementById("errorMessage").innerText =
          "Unkown error, please try again or use another method to sign up.";
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

      <button onClick={() => setShowSignUpModal(true)}>
        Sign Up with Email
      </button>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={onGoogleSignInSuccess}
          onError={onGoogleSignInFailure}
        />
      </GoogleOAuthProvider>
      <button onClick={() => setShowLoginModal(true)}>
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
