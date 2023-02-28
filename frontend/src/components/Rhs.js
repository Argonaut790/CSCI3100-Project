import ImportAll from "./ImportAll";
//function needs to be Capital Letter in the first
const Rhs = () => {
  return (
    <>
      <Searchbar />
      <Test />
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

const Test = () => {
  return (
    <div>
      <form>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <label>
          Username:
          <input type="text" name="username" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default Rhs;
