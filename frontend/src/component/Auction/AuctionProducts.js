import React, { Fragment, useEffect, useState } from "react";
import "./AuctionProducts.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getAuctionProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import Pagination from "react-js-pagination";
import { useAlert } from "react-alert";
import Typography from "@material-ui/core/Typography";
import MetaData from "../layout/MetaData";
import AuctionProductCard from "./AuctionProductCard";

const categories = [
  "T-Shirt",
  "Jeans",
  "Shirt",
  "Tops",
  "Attire",
  "Boots",
  "Sneakers",
  "Hats",
];

const AuctionProducts = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.auctionProducts);

  const keyword = match.params.keyword;
  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };
  let count = filteredProductsCount;

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getAuctionProduct(keyword, currentPage, category));
  }, [dispatch, keyword, currentPage, category, alert, error]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="ACUTION PRODUCTS -- Outfitify" />
          <h2 className="productsHeading">Auction Products</h2>

          <div className="products">
            {products &&
              products.map((product) => (
                <AuctionProductCard key={product._id} product={product} />
              ))}
          </div>

          <div className="filterBox">
            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
          {resultPerPage < count && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default AuctionProducts;
