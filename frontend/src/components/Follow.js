import FollowList from "./FollowList";
import PendingFollowList from "./PendingFollowList";
import SuggestedFollowList from "./SuggestedFollowList";
import { createContext, useState } from "react";

export const FollowContext = createContext();

//function needs to be Capital Letter in the first
const Follow = ({ userId }) => {
  const [followListUpdated, setFollowListUpdated] = useState(false);
  return (
    <>
      <FollowContext.Provider
        value={{ followListUpdated, setFollowListUpdated }}
      >
        {userId && <FollowList userId={userId} isFollowerList={false} />}
        {userId && <FollowList userId={userId} isFollowerList={true} />}
        {userId && <PendingFollowList userId={userId} />}
        {userId && <SuggestedFollowList userId={userId} />}
      </FollowContext.Provider>
    </>
  );
};

export default Follow;
