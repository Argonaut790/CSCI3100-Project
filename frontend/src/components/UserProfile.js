// import { Component } from "react";
// import axios from "axios";

import UserProfileContent from "./UserProfileContent";
import Search from "./Search";
import { useSearchParams, useNavigate } from "react-router-dom";
import Follow from "./Follow";

//function needs to be Capital Letter in the first
const UserProfile = ({ userId, maskBackgroundRef }) => {
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get("userId");
  const navigate = useNavigate();

  // Redirect to profile page when searching own profile
  if (userId === targetUserId) {
    navigate("/profile");
  }
  return (
    <>
      <div className="col-lg-6" id="content">
        <UserProfileContent
          targetUserId={targetUserId}
          maskBackgroundRef={maskBackgroundRef}
        />
      </div>
      <div className="col-lg-3 vh-100" id="explore">
        <div className="container-fluid p-0 d-grid gap-3 mt-4" id="rhs">
          <Search userId={userId} />
          <Follow userId={userId} />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
