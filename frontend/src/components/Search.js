import ImportAll from "./ImportAll";
import React, { useState, useEffect } from "react";
import axios from "axios";

//function needs to be Capital Letter in the first
const Search = () => {
  const [searchString, setSearchString] = useState("");
  const [resultItems, setResultItems] = useState([]);

  const onChangeSearchString = (e) => {
    setSearchString(e.target.value);
  };
  useEffect(() => {
    const fetchResultItems = async () => {
      const res = await axios.get(
        process.env.REACT_APP_DEV_API_PATH + "/account/search/" + searchString
      );
      if (!res.error) {
        setResultItems(res.data);
      } else {
        console.log(res);
      }
    };
    if (searchString !== "") fetchResultItems().catch(console.error);
  }, [searchString]);

  const SearchResults = () => {
    return (
      <div className="d-grid gap-2" id="search-result-div">
        {resultItems.length === 0 ? (
          <p>No result</p>
        ) : (
          resultItems.slice(0, 10).map((item) => (
            <div className="search-result-info">
              <a
                className="resultItem text-decoration-none link-light"
                href={"/user?userId=" + item.userId}
              >
                <img
                  src={images["user_avatar.jpg"]}
                  className="float-start post-user-avatar"
                  alt="user-avatar"
                />
                <div className="d-grid">
                  <div className="fw-bold">{item.username}</div>
                  <div>#{item.userId}</div>
                </div>
              </a>
            </div>
          ))
        )}
      </div>
    );
  };

  const images = ImportAll(
    require.context("../images", false, /\.(png|jpe?g|svg)$/)
  );

  return (
    <div>
      <div className="form-floating" id="search-engine-div">
        <input
          type="text"
          name="searchString"
          className="form-control text-light"
          id="search-engine"
          placeholder="Search Tags"
          value={searchString}
          onChange={onChangeSearchString}
        />
        <label
          htmlFor="search-engine"
          className="d-flex align-items-md-center"
          style={{ padding: "0.6rem", height: "unset" }}
        >
          <img
            src={images["search.png"]}
            className="white-img"
            id="search-icon"
            alt=" "
          />
          Search Twitter
        </label>
        {searchString !== "" && <SearchResults />}
      </div>
    </div>
  );
};

export default Search;
