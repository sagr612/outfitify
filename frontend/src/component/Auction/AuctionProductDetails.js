import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./AuctionProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAuctionProductDetails,
  updateBid,
} from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";

import AuctionProductCard from "./AuctionProductCard";
import { addAuctionItemsToCart } from "../../actions/cartAction";

const AuctionProductDetails = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const { product, loading, error, similarProducts } = useSelector(
    (state) => state.auctionProductDetails
  );
  const { isUpdated, error: bidError } = useSelector((state) => state.bid);

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [bid, setBid] = useState(0);

  const bidHandler = () => {
    dispatch(updateBid(product._id, bid, user._id));
  };

  const addToCartHandler = () => {
    dispatch(addAuctionItemsToCart(match.params.id, 1));
    alert.success("Item Added To Cart");
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (bidError) {
      alert.error(bidError);
      dispatch(clearErrors());
    }

    dispatch(getAuctionProductDetails(match.params.id));
  }, [dispatch, match.params.id, error, alert, bidError, isUpdated]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date().getTime();
      const endTime = new Date(product.auctionEndTime).getTime();
      setTimeRemaining(endTime - currentTime);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [product.auctionEndTime]);

  const formatTime = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `  ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} --Outfitify`} />
          <div className="ProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>

              <div className="detailsBlock-2">
                <span className="detailsBlock-2-span">Minimum Bid : </span>

                <span className="detailsBlock-2-span">{`₹${product.startingBid}`}</span>
              </div>

              <div className="detailsBlock-2">
                <span className="detailsBlock-2-span">Maximum Bid : </span>

                <span className="detailsBlock-2-span">₹25000</span>
              </div>

              <div className="detailsBlock-2">
                <span className="detailsBlock-2-span">Current Bid : </span>

                <span className="detailsBlock-2-span">{`₹${product.currentBid}`}</span>
              </div>
              {product.winner && (
                <div className="detailsBlock-2">
                  <span className="detailsBlock-2-span">Winner:</span>
                  <span className="detailsBlock-2-span">{product.winner}</span>
                </div>
              )}

              {product.auctionEndTime && timeRemaining > 0 ? (
                <div className="detailsBlock-2">
                  <span className="detailsBlock-2-span">Time Left :</span>
                  <span className="detailsBlock-2-span">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              ) : (
                <div className="detailsBlock-2">
                  <span className="detailsBlock-2-span">Auction Ended</span>
                </div>
              )}

              {product.winner &&
              product.auctionEndTime &&
              timeRemaining <= 0 &&
              isAuthenticated &&
              user._id.toString() === product.winner.toString() ? (
                <div className="detailsBlock-3-1">
                  <button
                    disabled={product.Stock < 1 ? true : false}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>
              ) : (
                <div></div>
              )}

              {product.auctionEndTime &&
              isAuthenticated &&
              timeRemaining > 0 ? (
                <div className="detailsBlock-3-1">
                  <span className="detailsBlock-2-span">Enter Bid : </span>
                  <input
                    type="number"
                    value={bid}
                    onChange={(e) => setBid(e.target.value)}
                  />
                  <button onClick={bidHandler}>Bid</button>
                </div>
              ) : (
                <div></div>
              )}

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>
            </div>
          </div>

          <h3 className="reviewsHeading">SIMILAR AUCTIONS</h3>
          {similarProducts && similarProducts[0] ? (
            <div className="reviews">
              {similarProducts &&
                similarProducts.map((product) => (
                  <AuctionProductCard key={product._id} product={product} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Similar Products Yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default AuctionProductDetails;
