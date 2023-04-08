import React, { useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const captchaRef = useRef(null);

  const navigate = useNavigate();
  const verifyUser = async (code) => {
    axios
      .patch(process.env.REACT_APP_DEV_API_PATH + "/account/auth/" + code)
      .then((response) => {
        if (response.data) {
          // user login
          localStorage.setItem(
            "user",
            JSON.stringify({ userId: response.data })
          );
          setUserId(response.data);
        }
      });
  };

  verifyUser(searchParams.get("confirmationCode"));

  const updatePassword = async (userId, password) => {
    const user = {
      userId: userId,
      password: password,
    };
    console.log(user);
    axios
      .patch(
        process.env.REACT_APP_DEV_API_PATH + "/account/password/reset/",
        user
      )
      .then((response) => {
        console.log(response);
        if (response.data) {
          document.getElementById("result").innerText = response.data;
        }
        setTimeout(() => {
          navigate("/home");
        }, 2500);
      });
    setPassword("");
    setConfirmPassword("");
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
    if (password === "" || confirmPassword === "") {
      document.getElementById("result").innerText +=
        "- Please enter and confirm your password \n";
    } else if (!password.match(passwordRegEx)) {
      document.getElementById("result").innerText +=
        "- Password must contains at least 1 upper case, 1 lower case, 1 number with the minimum length of 8 \n";
    } else if (password !== confirmPassword) {
      document.getElementById("result").innerText +=
        "- Your confirm password does not match\n";
    }

    const token = captchaRef.current.getValue();
    if (!token || token === "") {
      document.getElementById("result").innerText +=
        "- Please finish the captcha";
    }
    if (
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword &&
      password.match(passwordRegEx) &&
      token
    ) {
      captchaRef.current.reset();
      updatePassword(userId, password);
    }
  };

  return (
    <div
      className="mask-background d-flex justify-content-center align-items-center"
      id="sign-up-mask"
    >
      <div
        className="col-lg-4 d-flex justify-content-center align-items-center"
        id="sign-up-div"
      >
        <div className="modalContainer">
          <form className="d-flex flex-column" onSubmit={onSubmit}>
            <h3> Please reset your password.</h3>
            <div className="h6">
              - At least length of 8, 1 upper case, 1 lower case, 1 number for
              password
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
              <label htmlFor="floatingPassword">Password</label>
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
              <label htmlFor="floatingConfirmPassword">Confirm Password</label>
            </div>
            <div className="form-floating mb-3">
              <ReCAPTCHA
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                ref={captchaRef}
              />
            </div>

            <div className="buttonContainer d-grid">
              <input
                type="submit"
                value="Reset Password"
                className="btn btn-outline-warning"
              />
            </div>
          </form>
          <span id="result"></span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
