// import { Component } from "react";
// import axios from "axios";

import ProfileContent from "./ProfileContent";
import Search from "./Search";
import Follow from "./Follow";

//function needs to be Capital Letter in the first
const Profile = ({ userId }) => {
  return (
    <>
      <div className="col-lg-6" id="content">
        <ProfileContent />
      </div>
      <div className="col-lg-3 vh-100" id="explore">
        <div className="container-fluid p-0 d-grid gap-3 mt-4" id="rhs">
          <Search />
          <Follow userId={userId} />
        </div>
      </div>
    </>
  );
};

export default Profile;
