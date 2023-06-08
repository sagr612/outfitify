const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
  getAllAuctionProducts,
  getAdminAuctionProducts,
  getAuctionProductDetails,
  updateProductBid,
  getProductDetailsForAll,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/auction/products").get(getAllAuctionProducts);

router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

router
  .route("/admin/auction/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminAuctionProducts);

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// router
// .route("/admin/product/:id")
// .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
// .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);
router.route("/auction/product/:id").get(getAuctionProductDetails);

router.route("/all/product/:id").get(getProductDetailsForAll);

router.route("/auction/bid").put(updateProductBid);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
