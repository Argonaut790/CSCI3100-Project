import HomeContent from "./HomeContent";
import Search from "./Search";

//function needs to be Capital Letter in the first
const Home = () => {
  return (
    <>
      <div className="col-md-6" id="content">
        <HomeContent />
      </div>
      <div className="col-md-3 vh-100" id="explore">
        <div className="container-fluid p-0" id="rhs">
          <Search />
        </div>
      </div>
    </>
  );
};

export default Home;
