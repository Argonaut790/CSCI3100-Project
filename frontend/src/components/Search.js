import ImportAll from "./ImportAll";
import React, { useState, useEffect } from "react";
import axios from "axios";

//function needs to be Capital Letter in the first
const Search = () => {
  const [searchString, setSearchString] = useState("");
  const [resultItems, setResultItems] = useState([]);

  const onChangeSearchString = (e) => {
    setSearchString(e.target.value);
    console.log(searchString);
  };
  useEffect(() => {
    const fetchResultItems = async () => {
      const res = await axios.get(
        "http://localhost:5500/account/search/" + searchString
      );
      if (!res.error) {
        setResultItems(res.data);
        console.log(resultItems);
      } else {
        console.log(res);
      }
    };
    if (searchString !== "") fetchResultItems().catch(console.error);
  }, [searchString, resultItems]);

  const SearchResults = () => {
    return (
      <div className="searchResult">
        {resultItems.length === 0 ? (
          <p>No result</p>
        ) : (
          resultItems.slice(0, 10).map((item) => (
            <div className="post-user-info">
              <a className="resultItem" href={"/user?userId=" + item.userId}>
                <img
                  src={images["user_avatar.jpg"]}
                  className="float-start post-user-avatar"
                  alt="user-avatar"
                />
                <div className="fw-bold">{item.username}</div>
                <div>#{item.userId}</div>
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
        <label htmlFor="search-engine" className="d-flex align-items-md-center">
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
