// import { Component } from "react";
// import axios from "axios";

import UserProfileContent from "./UserProfileContent";
import Search from "./Search";
import { useSearchParams } from "react-router-dom";

//function needs to be Capital Letter in the first
const UserProfile = () => {
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get("userId");
  return (
    <>
      <div className="col-lg-6" id="content">
        <UserProfileContent targetUserId={targetUserId} />
      </div>
      <div className="col-lg-3 vh-100" id="explore">
        <div className="container-fluid p-0 mt-4" id="rhs">
          <Search />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
