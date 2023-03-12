import React, { useEffect, useState } from "react";
import { Switch, Route, Link, useLocation } from "react-router-dom";

import ImportAll from "./components/ImportAll";
import Home from "./components/Home";
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

  useEffect(() => {
    //slide in effect
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.add("visible");
    });

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
                  <a className="nav-link mask delay-0" href="/">
                    <img
                      src={images["home.png"]}
                      className="mr-1 white-img"
                      alt="home icon"
                    />
                    <span>Home</span>
                  </a>
                  <a className="nav-link mask delay-1" href="/">
                    <img
                      src={images["explore.png"]}
                      className="mr-1 white-img"
                      alt="explore icon"
                    />
                    <span>Explore</span>
                  </a>
                  <a className="nav-link mask delay-2" href="/">
                    <img
                      src={images["chat.png"]}
                      className="mr-1 white-img"
                      alt="chat icon"
                    />
                    <span>Chat</span>
                  </a>
                  <a className="nav-link mask delay-3" href="/">
                    <img
                      src={images["user.png"]}
                      className="mr-1 white-img"
                      alt="user icon"
                    />
                    <span>Profile</span>
                  </a>
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
          <Switch>
            <Route exact path={["/", "/Homepage"]} component={Home} />
            {/* <Route
              path="/Homepage/:id"
              render={(props) => <PostLogon {...props} user={user} />}
            /> */}
            <Route path="/tweet" component={Tweet} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;
