// import { Component } from "react";
// import axios from "axios";

import ProfileContent from "./ProfileContent";
import Search from "./Search";

//function needs to be Capital Letter in the first
const Profile = (loggedIn) => {
  return (
    <>
      <div className="col-md-6" id="content">
        <ProfileContent />
      </div>
      <div className="col-md-3 vh-100" id="explore">
        <div className="container-fluid p-0" id="rhs">
          <Search loggedIn={loggedIn} />
        </div>
      </div>
    </>
  );
};

export default Profile;
