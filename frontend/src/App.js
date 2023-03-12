import React, { useEffect, useState } from "react";
import { Switch, Route, Link, useLocation } from "react-router-dom";

import Lhs from "./components/Lhs";
import Middle from "./components/Middle";
import Rhs from "./components/Rhs";

function App() {
  const [user, setUser] = useState();
  let location = useLocation();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div class="mask-background">
      <div class="container px-4">
        <div class="row gx-5 h-100">
          <div class="col-md vh-100" id="nav">
            <div class="container-fluid" id="lhs">
              <Lhs />
            </div>
          </div>
          <div class="col-md-6" id="content">
            <Middle />
          </div>
          <div class="col-md vh-100" id="explore">
            <div class="container-fluid p-0" id="rhs">
              <Rhs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
