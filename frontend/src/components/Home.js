import HomeContent from "./HomeContent";
import Search from "./Search";
import FollowList from "./FollowList";

//function needs to be Capital Letter in the first
const Home = (loggedIn) => {
  const userId = JSON.parse(localStorage.getItem("user")).userId;
  return (
    <>
      <div className="col-md" id="content">
        <HomeContent />
      </div>
      <div className="col-md-3 vh-100" id="explore">
        <div className="container-fluid p-0" id="rhs">
          <Search />
          {userId && <FollowList userId={userId} isFollowerList={false} />}
        </div>
      </div>
    </>
  );
};

export default Home;
