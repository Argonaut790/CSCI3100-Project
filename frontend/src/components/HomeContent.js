import FetchPost from "./FetchPost";
import { useNotification } from "../NotificationContext";
//function needs to be Capital Letter in the first

const HomeContent = ({ maskBackgroundRef, userId }) => {
  return (
    <>
      <TopMid />
      <Content maskBackgroundRef={maskBackgroundRef} userId={userId} />
    </>
  );
};

const TopMid = () => {
  return (
    <div className="container-fluid top-p-1" id="top-mid">
      <div className="row">
        <div className="h3 head d-flex">✨ Home</div>
      </div>
    </div>
  );
};

const Content = ({ maskBackgroundRef, userId }) => {
  const { showNotification } = useNotification();
  return (
    <div className="container-fluid p-0" id="mid-center">
      <FetchPost
        userId={userId}
        profile={false}
        maskBackgroundRef={maskBackgroundRef}
        showNotification={showNotification}
      />
    </div>
  );
};

export default HomeContent;
