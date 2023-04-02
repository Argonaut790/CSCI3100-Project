import { useRef, useEffect, useCallback, useState, createRef } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
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
  const [userId, setUserId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [tweetHandled, setTweetHandled] = useState(false);
  const [postStatus, setPostStatus] = useState(null);
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const maskBackgroundRef = createRef();

  let location = useLocation();

  useEffect(() => {
    // Check if user logged in everytime if user change browsing page
    const checkUserLogin = async () => {
      const userId = JSON.parse(localStorage.getItem("user")).userId;
      if (userId) {
        setUserId(userId);
        setLoggedIn(true);
      } else {
        setUserId("");
        setLoggedIn(false);
      }
    };
    checkUserLogin().catch(console.error);
  }, [location]);

  const handleLogout = useCallback(() => {
    setUserId("");
    setLoggedIn(false);
    localStorage.removeItem("user");
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

  useEffect(() => {
    console.log("postStatus updated:", postStatus);
  }, [postStatus]);

  const User = () => {
    // Get user profile infomation from db
    useEffect(() => {
      const fetchUserData = async () => {
        const res = await axios.get("http://localhost:5500/account/" + userId);
        if (!res.error) {
          setUsername(res.data.username);
          setIsAdmin(res.data.isAdmin);
        } else {
          console.log(res);
        }
      };
      fetchUserData().catch(console.error);
    }, []);

    // Render avatar, username, userId, lagout button in left-bottom corner
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
    <div className="mask-background" ref={maskBackgroundRef}>
      <ScrollContext.Provider value={maskBackgroundRef}>
        {/* Routes */}
        {console.log(userId)}
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
                <div className="toast-body">Retweet Successfully! </div>
              )}
              {postStatus === 400 && (
                <div className="toast-body">Retweet Failed Successfully! </div>
              )}
            </div>
          </div>
        )}
        <div className="container px-4">
          <div className="row gx-5 h-100">
            <div className="col-md-3 vh-100" id="nav">
              <div className="container-fluid" id="lhs">
                <TopLeft />
                <div className="row d-flex m-0" id="nav">
                  <NavLinks user={userId} handleTweet={handleTweet} />
                </div>
                {loggedIn && <User />}
              </div>
            </div>
            <Routes>
              <Route path="/" element={<Home userId={userId} />} />
              <Route path="/home" element={<Home userId={userId} />} />
              {/* <Route
              path="/Homepage/:id"
              render={(props) => <PostLogon {...props} user={user} />}
            /> */}
              {/* {loggedIn && <Route path="/chat" element={<Chat />} />} */}
              {loggedIn && (
                <Route
                  path="/profile"
                  element={<Profile loggedIn={loggedIn} />}
                />
              )}
              {loggedIn && isAdmin && (
                <Route path="/admin" element={<Admin />} />
              )}
              {/* {loggedIn && <Route path="/tweet" element={<Tweet />} />} */}
              <Route path="/confirm" element={<AccountConfirm />} />
              <Route path="/user" element={<UserProfile />}></Route>
            </Routes>
          </div>
        </div>
        {/* admin interface */}
        {/* login interface */}
      </ScrollContext.Provider>
    </div>
  );
}

export default App;
