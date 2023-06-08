import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AuctionProductCard.css";

const AuctionProductCard = ({ product }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
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

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <Link className="productCard" to={`/auction/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <span className="productCred">Starting bid:</span>
        <span className="productCred">{`₹${product.startingBid}`}</span>
      </div>

      <div>
        <span className="productCred">Current bid:</span>
        <span className="productCred">{`₹${product.currentBid}`}</span>
      </div>

      {product.auctionEndTime && timeRemaining > 0 ? (
        <div>
          <span className="productCred">Time Left:</span>
          <span className="productCred">{formatTime(timeRemaining)}</span>
        </div>
      ) : (
        <div>
          <span className="productCred">Auction Ended</span>
        </div>
      )}
    </Link>
  );
};

export default AuctionProductCard;
