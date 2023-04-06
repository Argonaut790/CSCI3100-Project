import FollowList from "./FollowList";
import PendingFollowList from "./PendingFollowList";
import { createContext, useState } from "react";

export const FollowerContext = createContext();

//function needs to be Capital Letter in the first
const Follow = ({ userId }) => {
  const [followerListUpdated, setFollowerListUpdated] = useState(false);
  return (
    <>
      <FollowerContext.Provider
        value={{ followerListUpdated, setFollowerListUpdated }}
      >
        {userId && <FollowList userId={userId} isFollowerList={false} />}
        {userId && <FollowList userId={userId} isFollowerList={true} />}
        {userId && <PendingFollowList userId={userId} />}
      </FollowerContext.Provider>
    </>
  );
};

export default Follow;
