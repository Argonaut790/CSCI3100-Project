import ImportAll from "./ImportAll";

//function needs to be Capital Letter in the first
const Search = () => {
  return (
    <>
      <Searchbar />
      <div className="container-fluid" id="following-div">
        <div className="row d-flex flex-column">
          <div className="col-md h2">Following</div>
          <br />
          <div className="col-md">Follower 1</div>
          <div className="col-md">Follower 2</div>
          <div className="col-md">Follower 3</div>
          <div className="col-md">Follower 4</div>
        </div>
      </div>
    </>
  );
};

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

const Searchbar = () => {
  return (
    <div>
      <div className="form-floating" id="search-engine-div">
        <input
          className="form-control text-light"
          id="search-engine"
          placeholder="Search Tags"
        />
        <label htmlFor="search-engine" className="d-flex align-items-md-center">
          <img
            src={images["search.png"]}
            className="white-img"
            id="search-icon"
            alt=" "
          />
          Search Twitter
        </label>
      </div>
    </div>
  );
};

export default Search;
