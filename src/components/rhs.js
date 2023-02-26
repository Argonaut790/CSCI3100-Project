import ImportAll from "./ImportAll";
//function needs to be Capital Letter in the first
const Rhs = () => {
  return (
    <>
      <Searchbar />
    </>
  );
};

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

const Searchbar = () => {
  return (
    <div>
      <div class="form-floating" id="search-engine-div">
        <input
          class="form-control text-light"
          id="search-engine"
          placeholder="Search Tags"
        />
        <label for="search-engine" class="d-flex align-items-md-center">
          <img
            src={images["search.png"]}
            class="white-img"
            id="search-icon"
            alt=" "
          />
          Search Twitter
        </label>
      </div>
    </div>
  );
};

export default Rhs;
