import { useRef, useEffect, useCallback, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import ScrollContext from "./components/ScrollContext";
import ImportAll from "./components/ImportAll";
import Home from "./components/Home";
// import Chat from "./components/Chat";
import Profile from "./components/Profile";
import Tweet from "./components/Tweet";
import AccountConfirm from "./components/AccountConfirm";
import SignUp from "./components/SignUp";
import Admin from "./components/Admin";
import UserProfile from "./components/UserProfile";
import ResetPassword from "./components/ResetPassword";
import Notification from "./components/Notification";

const images = ImportAll(
  require.context("./images", false, /\.(png|jpe?g|svg)$/)
);

const TopLeft = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleIconClick = () => {
    if (location.pathname === "/home" || location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/home");
    }
  };

  return (
    <div
      className="pe-auto row h3 head d-flex flex-row align-items-center justify-content-center"
      id="top-left"
      onClick={handleIconClick}
    >
      <img
        src={images["doge.png"]}
        className="mr-1"
        id="icon"
        alt="icon"
        style={{ cursor: "pointer" }}
      />
      <div className="user-select-none" id="rettiwt">
        Rettiwt
      </div>
    </div>
  );
};

function App() {
  const [userId, setUserId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [tweetHandled, setTweetHandled] = useState(false);
  const [postStatus, setPostStatus] = useState(null);
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);
  const [opacity, setOpacity] = useState(0.1);

  const maskBackgroundRef = useRef();

  let location = useLocation();

  useEffect(() => {
    // Check if user logged in everytime if user change browsing page
    const checkUserLogin = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.userId && user.userId.length !== 0) {
        setUserId(user.userId);
        setLoggedIn(true);
      } else {
        setUserId("");
        setLoggedIn(false);
      }
    };
    checkUserLogin().catch(console.error);

    const fetchUserData = async () => {
      const res = await axios.get(
        process.env.REACT_APP_DEV_API_PATH + "/account/" + userId
      );
      if (!res.error) {
        setUsername(res.data.username);
        localStorage.setItem(
          "username",
          JSON.stringify({ username: res.data.username })
        );
        setIsAdmin(res.data.isAdmin);
        setOpacity(res.data.backgroundOpacity);
        // console.log("Opacity : " + opacity);
        if (!res.data.avatar) {
          setUserAvatar(images["avatar.png"]);
          return;
        }
        const avatarURL =
          process.env.REACT_APP_DEV_API_PATH +
          "/account/profile/avatar/" +
          res.data.avatar;
        const imageResponse = await axios.get(avatarURL, {
          responseType: "blob",
        });
        if (imageResponse) {
          const imageURL = URL.createObjectURL(imageResponse.data);
          setUserAvatar(imageURL);
          localStorage.setItem(
            "userAvatar",
            JSON.stringify({ userAvatar: imageURL })
          );
        }
      } else {
        console.log(res);
      }
    };
    fetchUserData().catch(console.error);
  }, [userId, location, opacity]);

  const handleLogout = useCallback(() => {
    setUserId("");
    setLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("userAvatar");
  }, []);

  const handleTweet = () => {
    if (tweetHandled) {
      setTweetHandled(false);
    } else {
      setTweetHandled(true);
    }
    console.log("TweetHandled : " + tweetHandled);
    console.log("LoggedIn : " + loggedIn);
  };

  const handlePostStatus = (status) => {
    setPostStatus(status);
    console.log("Post Status : " + postStatus);
  };

  const User = () => {
    // Render avatar, username, userId, lagout button in left-bottom corner
    return (
      <div
        className="row h4 m-0 d-flex flex-row align-items-md-center"
        id="user"
      >
        <div className="col-md-5 h-100 d-flex align-items-center justify-content-center">
          <ConditionalNavLink to="/profile">
            <img
              src={userAvatar}
              className="float-start img-fluid"
              id="avatar"
              alt="avatar"
            />
          </ConditionalNavLink>
        </div>
        <div className="col-md-7 h-100 d-flex align-items-center">
          <div className="row d-flex flex-column" id="user-info">
            <div className="col-md-12 p-0">{username}</div>
            <div className="col-md-12 p-0">#{userId}</div>
            <button
              type="button"
              className="btn btn-dark"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  };
  // button type="button" className="btn btn-outline-dark"

  const NavItem = ({ text, id, imgsrc, delay, onClick }) => {
    const navLinkRef = useRef(null);

    useEffect(() => {
      // slide in effect
      navLinkRef.current.classList.add("visible");
    }, []);

    return (
      <li>
        <Link
          to={`/${id}`}
          className={`nav-link text-center mask btn delay-${delay}`}
          style={{ cursor: "pointer" }}
          id={`${id}`}
          ref={navLinkRef}
        >
          <img
            src={images[`${imgsrc}.png`]}
            className="mr-1 white-img"
            alt={`${id} icon`}
          />
          <span className="d-none d-md-inline">{text}</span>
        </Link>
      </li>
    );
  };

  const TweetButton = ({ handleTweet }) => {
    const navLinkRef = useRef(null);

    useEffect(() => {
      // slide in effect
      navLinkRef.current.classList.add("visible");
    }, []);

    return (
      <li>
        <div
          className={"nav-link text-center mask delay-4 btn"}
          style={{ cursor: "pointer" }}
          id="tweet"
          ref={navLinkRef}
          onClick={handleTweet}
        >
          <img
            src={images["tweet.png"]}
            className="mr-1 white-img"
            alt="tweet icon"
          />
          <span className="d-none d-md-inline">Tweet</span>
        </div>
      </li>
    );
  };

  const ConditionalNavLink = ({ to, children, ...rest }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = (e) => {
      e.preventDefault();

      if (location.pathname === to) {
        window.location.reload();
      } else {
        navigate(to);
      }
    };

    return (
      <Link to={to} onClick={handleClick} {...rest}>
        {children}
      </Link>
    );
  };

  const NavLinks = ({ userId, handleTweet }) => {
    return (
      <nav className="h4 nav flex-column p-0">
        <NavItem user={userId} text="Home" id="home" imgsrc="home" delay="1" />
        {/* {user && (
          <NavItem user={user} text="Chat" id="chat" imgsrc="chat" delay="2" />
        )} */}
        {loggedIn && (
          <NavItem
            user={userId}
            text="Profile"
            id="profile"
            imgsrc="user"
            delay="3"
          />
        )}
        {loggedIn && <TweetButton handleTweet={handleTweet} />}
        {loggedIn && isAdmin && (
          <NavItem
            user={userId}
            text="Admin"
            id="admin"
            imgsrc="admin"
            delay="4"
          />
        )}
        {loggedIn && (
          <Link
            to={"/home"}
            onClick={handleLogout}
            className="nav-link"
            style={{ cursor: "pointer" }}
          >
            Logout
          </Link>
        )}
      </nav>
    );
  };

  return (
    <div
      className="mask-background"
      ref={maskBackgroundRef}
      style={{ backgroundColor: `rgba(0, 0, 0, ${parseFloat(opacity)})` }}
      id="mask-background"
    >
      <ScrollContext.Provider value={maskBackgroundRef}>
        {/* Routes */}
        {/* user interface */}
        {!loggedIn && (
          <div
            className="mask-background d-flex justify-content-center align-items-center"
            id="sign-up-mask"
          >
            <div
              className="col-lg-3 d-flex justify-content-center align-items-center"
              id="sign-up-div"
            >
              <SignUp loggedIn={loggedIn} />
            </div>
          </div>
        )}
        {loggedIn && tweetHandled && (
          <Tweet
            handleTweet={handleTweet}
            handlePostStatus={handlePostStatus}
            userId={userId}
            username={username}
            userAvatar={userAvatar}
          />
        )}
        {/* Tweet upload status */}
        {postStatus && (
          <div
            className="position-fixed bottom-0 end-0 p-3"
            style={{ zIndex: "11" }}
          >
            <div
              id="liveToast"
              className="toast show tweet-mask"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              <div className="toast-header" style={{ color: "black" }}>
                {/* <img src="..." className="rounded me-2" alt="..." /> */}
                <strong className="me-auto">Rettiwt</strong>
                {/* <small>11 mins ago</small> */}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="toast"
                  aria-label="Close"
                ></button>
              </div>
              {postStatus === 200 && (
                <div className="toast-body">Rettiwt Successfully! </div>
              )}
              {postStatus === 400 && (
                <div className="toast-body">Rettiwt Failed Successfully! </div>
              )}
            </div>
          </div>
        )}
        <div className="container px-4">
          <div className="row gx-5 h-100">
            <div className="col-lg-3 vh-100" id="nav">
              <div className="container-fluid" id="lhs">
                <TopLeft />
                <div className="row d-flex m-0" id="nav">
                  <NavLinks user={userId} handleTweet={handleTweet} />
                </div>

                {loggedIn && <User />}
              </div>
            </div>
            <Routes>
              <Route
                path="/"
                element={
                  <Home userId={userId} maskBackgroundRef={maskBackgroundRef} />
                }
              />
              <Route
                path="/home"
                element={
                  <Home userId={userId} maskBackgroundRef={maskBackgroundRef} />
                }
              />
              {/* <Route
              path="/Homepage/:id"
              render={(props) => <PostLogon {...props} user={user} />}
            /> */}
              {/* {loggedIn && <Route path="/chat" element={<Chat />} />} */}
              {loggedIn && (
                <Route
                  path="/profile"
                  element={
                    <Profile
                      userId={userId}
                      maskBackgroundRef={maskBackgroundRef}
                    />
                  }
                />
              )}
              {loggedIn && isAdmin && (
                <Route path="/admin" element={<Admin />} />
              )}
              {/* {loggedIn && <Route path="/tweet" element={<Tweet />} />} */}
              <Route path="/confirm" element={<AccountConfirm />} />
              <Route path="/user" element={<UserProfile />}></Route>
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </div>
        </div>
        {/* admin interface */}
        {/* login interface */}
      </ScrollContext.Provider>
      <Notification />
    </div>
  );
}

export default App;
