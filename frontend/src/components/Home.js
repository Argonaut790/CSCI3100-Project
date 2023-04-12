import HomeContent from "./HomeContent";
import Search from "./Search";
import Follow from "./Follow";

//function needs to be Capital Letter in the first
const Home = ({ userId, maskBackgroundRef }) => {
  return (
    <>
      <div className="col-lg-6" id="content">
        <HomeContent maskBackgroundRef={maskBackgroundRef} />
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

export default Home;
