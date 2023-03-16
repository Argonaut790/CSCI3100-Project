import ImportAll from "./ImportAll";
import Test from "./Test";
import SignUp from "./SignUp";
//function needs to be Capital Letter in the first
const Search = () => {
  return (
    <>
      <Searchbar />
      <Test />
      <SignUp />
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
