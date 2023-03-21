import { useRef, useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import ImportAll from "./components/ImportAll";
import Home from "./components/Home";
import Chat from "./components/Chat";
import Profile from "./components/Profile";
import Tweet from "./components/Tweet";
import AccountConfirm from "./components/AccountConfirm";
import SignUp from "./components/SignUp";

const images = ImportAll(
  require.context("./images", false, /\.(png|jpe?g|svg)$/)
);

const TopLeft = () => {
  return (
    <div
      className="row h3 head d-flex flex-row align-items-center justify-content-center"
      id="top-left"
    >
      <img
        src={images["twittericon.png"]}
        className="mr-1 white-img"
        id="icon"
        alt="icon"
      />
      <div id="rettiwt">Rettiwt</div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [tweetHandled, setTweetHandled] = useState(false);

  let location = useLocation();

  const handleTweet = () => {
    if (tweetHandled) {
      setTweetHandled(false);
    } else {
      setTweetHandled(true);
    }
    console.log("TweetHandled : " + tweetHandled);
    console.log("LoggedIn : " + loggedIn);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  if (user) {
    console.log("User Exists");
  } else {
    console.log("User Doesn't Exist");
  }
  console.log("User Object : " + user);
  const { username, email, isAdmin, isGoogleSign } = user || {};
  console.log("username : " + username);
  console.log("email : " + email);
  console.log("Admin : " + isAdmin);
  console.log("Google : " + isGoogleSign);

  const User = () => {
    return (
      <div
        className="row h4 m-0 d-flex flex-row align-items-md-center"
        id="user"
      >
        <div className="col-md-5 h-100 d-flex align-items-center justify-content-center">
          <img
            src={images["user_avatar.jpg"]}
            className="float-start img-fluid"
            id="avatar"
            alt="avatar"
          />
        </div>
        <div className="col-md-7 h-100 d-flex align-items-center">
          <div className="row d-flex flex-column" id="user-info">
            <div className="col-md-12 p-0">{user.username}</div>
            <div className="col-md-12 p-0">#ID</div>
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
  // button type="button" class="btn btn-outline-dark"

  const NavItem = ({ text, id, imgsrc, delay }) => {
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

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      setLoggedIn(true);
    } else {
      setUser(null);
      setLoggedIn(false);
    }
  }, [location]);

  const handleLogout = () => {
    setUser(null);
    setLoggedIn(false);
    localStorage.removeItem("user");
  };

  const NavLinks = ({ user, handleTweet }) => {
    return (
      <nav className="h4 nav flex-column p-0">
        <NavItem user={user} text="Home" id="home" imgsrc="home" delay="1" />
        {/* {user && (
          <NavItem user={user} text="Chat" id="chat" imgsrc="chat" delay="2" />
        )} */}
        {user && (
          <NavItem
            user={user}
            text="Profile"
            id="profile"
            imgsrc="user"
            delay="3"
          />
        )}
        {user && <TweetButton handleTweet={handleTweet} />}
        {user && (
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
    <div className="mask-background">
      {/* Routes */}
      {console.log(user)}
      {/* {user ? ({admin ? (<Admin/) : (<User/>)}) : (<Login/>)} */}
      {/* user interface */}
      {!loggedIn && (
        <div
          className="mask-background d-flex justify-content-center align-items-center"
          id="sign-up-mask"
        >
          <div
            className="d-flex justify-content-center align-items-center"
            id="sign-up-div"
          >
            <SignUp loggedIn={loggedIn} />
          </div>
        </div>
      )}
      {loggedIn && tweetHandled && <Tweet handleTweet={handleTweet} />}
      <div className="container px-4">
        <div className="row gx-5 h-100">
          <div className="col-md-3 vh-100" id="nav">
            <div className="container-fluid" id="lhs">
              <TopLeft />
              <div className="row d-flex m-0" id="nav">
                <NavLinks user={user} handleTweet={handleTweet} />
              </div>
              {user && <User />}
            </div>
          </div>
          <Routes>
            <Route path="/" element={<Home loggedIn={loggedIn} />} />
            <Route path="/home" element={<Home loggedIn={loggedIn} />} />
            {/* <Route
              path="/Homepage/:id"
              render={(props) => <PostLogon {...props} user={user} />}
            /> */}
            {user && <Route path="/chat" element={<Chat />} />}
            {user && (
              <Route
                path="/profile"
                element={<Profile loggedIn={loggedIn} />}
              />
            )}
            {/* {user && <Route path="/tweet" element={<Tweet />} />} */}
            <Route path="/confirm" element={<AccountConfirm />} />
          </Routes>
        </div>
      </div>
      {/* admin interface */}
      {/* login interface */}
    </div>
  );
}

export default App;
