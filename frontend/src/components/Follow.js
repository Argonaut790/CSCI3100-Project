import FollowList from "./FollowList";
import PendingFollowList from "./PendingFollowList";
import SuggestedFollowList from "./SuggestedFollowList";
import { createContext, useState } from "react";

export const FollowContext = createContext();

//function needs to be Capital Letter in the first
const Follow = ({ userId }) => {
  const [followListUpdated, setFollowListUpdated] = useState(false);
  const [openedList, setOpenedList] = useState([false, false, false, true]);

  return (
    <>
      <FollowContext.Provider
        value={{ followListUpdated, setFollowListUpdated }}
      >
        {userId && (
          <FollowList
            userId={userId}
            isFollowerList={false}
            openedList={openedList}
            setOpenedList={setOpenedList}
          />
        )}
        {userId && (
          <FollowList
            userId={userId}
            isFollowerList={true}
            openedList={openedList}
            setOpenedList={setOpenedList}
          />
        )}
        {userId && (
          <PendingFollowList
            userId={userId}
            openedList={openedList}
            setOpenedList={setOpenedList}
          />
        )}
        {userId && (
          <SuggestedFollowList
            userId={userId}
            openedList={openedList}
            setOpenedList={setOpenedList}
          />
        )}
      </FollowContext.Provider>
    </>
  );
};

export default Follow;
