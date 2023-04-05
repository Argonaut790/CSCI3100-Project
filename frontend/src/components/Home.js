import HomeContent from "./HomeContent";
import Search from "./Search";
import FollowList from "./FollowList";
import PendingFollowList from "./PendingFollowList";

//function needs to be Capital Letter in the first
const Home = ({ userId }) => {
  return (
    <>
      <div className="col-lg-6" id="content">
        <HomeContent />
      </div>
      <div className="col-lg-3 vh-100" id="explore">
        <div className="container-fluid p-0 d-grid gap-3 mt-4" id="rhs">
          <Search />
          {userId && <FollowList userId={userId} isFollowerList={false} />}
          {userId && <FollowList userId={userId} isFollowerList={true} />}
          {userId && <PendingFollowList userId={userId} />}
        </div>
      </div>
    </>
  );
};

export default Home;
