import { useRef, useEffect, useState } from "react";
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

const User = () => {
  return (
    <div className="row h4 m-0 d-flex flex-row align-items-md-center" id="user">
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
          <div className="col-md-12 p-0">Username</div>
          <div className="col-md-12 p-0">#ID</div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState();
  let location = useLocation();

  const NavItem = ({ text, id, imgsrc, delay }) => {
    const navLinkRef = useRef(null);

    useEffect(() => {
      // slide in effect
      navLinkRef.current.classList.add("visible");
    }, []);

    return (
      <li>
        {user ? (
          <Link
            to={`/${id}`}
            className={`nav-link text-center mask delay-${delay}`}
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
        ) : (
          <Link
            to={`/${id}`}
            className={`nav-link text-center mask delay-${delay}`}
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
      {/* Routes */}

      {/* {user ? ({admin ? (<Admin/) : (<User/>)}) : (<Login/>)} */}

      {/* user interface */}
      <div className="container px-4">
        <div className="row gx-5 h-100">
          <div className="col-md-3 vh-100" id="nav">
            <div className="container-fluid" id="lhs">
              <TopLeft />
              <div className="row d-flex m-0" id="nav">
                <nav className="h4 nav flex-column p-0">
                  <NavItem text="Home" id="home" imgsrc="home" delay="1" />
                  <NavItem text="Chat" id="chat" imgsrc="chat" delay="2" />
                  <NavItem
                    text="Profile"
                    id="profile"
                    imgsrc="user"
                    delay="3"
                  />
                  <NavItem text="Tweet" id="tweet" imgsrc="tweet" delay="4" />
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
      {/* admin interface */}

      {/* login interface */}
    </div>
  );
}

export default App;
