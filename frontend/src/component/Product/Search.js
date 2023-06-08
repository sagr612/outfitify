import React, { useState, Fragment } from "react";
import MetaData from "../layout/MetaData";
import "./Search.css";

const Search = ({ history }) => {
  const [keyword, setKeyword] = useState("");
  const [auction, setAuction] = useState("No");

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (auction === "auction" && keyword.trim()) {
      history.push(`/auction/products/${keyword}`);
    } else if (keyword.trim()) {
      history.push(`/products/${keyword}`);
    } else {
      history.push("/products");
    }
  };

  return (
    <Fragment>
      <MetaData title="Search A Product -- OUTFITIFY" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product ..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />

        <select onChange={(e) => setAuction(e.target.value)}>
          <option value="auction">Auction</option>
          <option value="No" selected>
            Product
          </option>
        </select>
      </form>
    </Fragment>
  );
};

export default Search;
