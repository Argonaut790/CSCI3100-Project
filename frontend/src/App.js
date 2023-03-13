import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import ImportAll from "./components/ImportAll";
import Home from "./components/Home";
import Chat from "./components/Chat";
import Profile from "./components/Profile";
import Tweet from "./components/Tweet";

const images = ImportAll(
  require.context("./images", false, /\.(png|jpe?g|svg)$/)
);

const TopLeft = () => {
  return (
    <div className="row h3 head d-flex align-items-center" id="top-left">
      <img
        src={images["twittericon.png"]}
        className="mr-1 white-img"
        id="icon"
        alt="icon"
      />
      Rettiwt
    </div>
  );
};

const User = () => {
  return (
    <div className="row h4 d-flex align-items-md-center" id="user">
      <img
        src={images["user_avatar.jpg"]}
        className="float-start"
        id="avatar"
        alt="avatar"
      />
      Username #ID
    </div>
  );
};

function App() {
  const [user, setUser] = useState();
  let location = useLocation();

  const NavItem = (props) => {
    const { text, id, imgsrc, delay } = props;

    useEffect(() => {
      //slide in effect
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.add("visible");
      });
    }, []);

    return (
      <li>
        {user ? (
          <Link
            to={"/profile"}
            className="nav-link mask delay-3"
            style={{ cursor: "pointer" }}
            id="profile"
          >
            <img
              src={images["user.png"]}
              className="mr-1 white-img"
              alt="profile icon"
            />
            Profile
          </Link>
        ) : (
          //false here suppose to be null, just testing here
          <Link
            to={`/${id}`}
            className={`nav-link mask delay-${delay}`}
            style={{ cursor: "pointer" }}
            id={`${id}`}
          >
            <img
              src={images[`${imgsrc}.png`]}
              className="mr-1 white-img"
              alt={`${id} icon`}
            />
            {text}
          </Link>
        )}
      </li>
    );
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    } else {
      setUser(null);
    }
  }, [location]);

  // const handleLogout = () => {
  //   setUser(null);
  //   localStorage.removeItem("user");
  // };

  return (
    <div className="mask-background">
      <div className="container px-4">
        <div className="row gx-5 h-100">
          <div className="col-md-3 vh-100" id="nav">
            <div className="container-fluid" id="lhs">
              <TopLeft />
              <div className="row d-flex" id="nav">
                <nav className="h4 nav flex-column">
                  <NavItem text="Home" id="home" imgsrc="home" delay="1" />
                  <NavItem text="Chat" id="chat" imgsrc="chat" delay="2" />
                  <NavItem
                    text="Profile"
                    id="profile"
                    imgsrc="user"
                    delay="3"
                  />
                  <li>
                    {user ? (
                      <Link
                        to={"/tweet"}
                        className="nav-link h5 text-center mask delay-4"
                        style={{ cursor: "pointer" }}
                        id="tweet"
                      >
                        Tweet
                      </Link>
                    ) : (
                      //false here suppose to be null, just testing here
                      <Link
                        to={"/tweet"}
                        className="nav-link h5 text-center mask delay-4"
                        style={{ cursor: "pointer" }}
                        id="tweet"
                      >
                        Tweet
                      </Link>
                    )}
                  </li>
                </nav>
              </div>
              <User />
            </div>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            {/* <Route
              path="/Homepage/:id"
              render={(props) => <PostLogon {...props} user={user} />}
            /> */}
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tweet" element={<Tweet />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
