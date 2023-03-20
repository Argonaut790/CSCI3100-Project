import HomeContent from "./HomeContent";
import Search from "./Search";

//function needs to be Capital Letter in the first
const Home = (loggedIn) => {
  return (
    <>
      <div className="col-md" id="content">
        <HomeContent />
      </div>
      <div className="col-md-3 vh-100" id="explore">
        <div className="container-fluid p-0" id="rhs">
          <Search loggedIn={loggedIn} />
        </div>
      </div>
    </>
  );
};

export default Home;
