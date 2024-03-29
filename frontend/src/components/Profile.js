// import axios from "axios";
import { useEffect } from "react";
import { useNotification } from "../NotificationContext";
import ProfileContent from "./ProfileContent";
import Search from "./Search";
import Follow from "./Follow";

//function needs to be Capital Letter in the first
const Profile = ({ userId, maskBackgroundRef }) => {
    const { showNotification } = useNotification();
  useEffect(() => {
    if (maskBackgroundRef.current) {
      maskBackgroundRef.current.scrollTo(0, 0);
    }
  }, [maskBackgroundRef]);

  return (
    <>
      <div className="col-lg-6" id="content">
          <ProfileContent
              maskBackgroundRef={maskBackgroundRef}
              showNotification = {showNotification}
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

export default Profile;
