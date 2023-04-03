// import { Component } from "react";
// import axios from "axios";

import ProfileContent from "./ProfileContent";
import Search from "./Search";

//function needs to be Capital Letter in the first
const UserProfile = (loggedIn) => {
  return (
    <>
      <div className="col-md-6" id="content">
        <ProfileContent />
      </div>
      <div className="col-md-3 vh-100" id="explore">
        <div className="container-fluid p-0 mt-4" id="rhs">
          <Search />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
