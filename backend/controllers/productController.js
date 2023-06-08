const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const query = { isAuction: "No" };
  const productsCount = await Product.countDocuments(query);

  const apiFeature = new ApiFeatures(Product.find(query), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get All auction Product
exports.getAllAuctionProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const query = { isAuction: "Yes" };
  const productsCount = await Product.countDocuments(query);

  const apiFeature = new ApiFeatures(Product.find(query), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get All normal Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find({ isAuction: "No" });

  res.status(200).json({
    success: true,
    products,
  });
});

// Get All auction Product (Admin)
exports.getAdminAuctionProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find({ isAuction: "Yes" });

  res.status(200).json({
    success: true,
    products,
  });
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // finding the product category
  const productCategory = product.category;

  const relatedProductsTemp = await Product.find({
    category: productCategory,
    isAuction: "No",
  });

  var similarProducts = [];
  // console.log(productCategory);
  // console.log(product._id);
  relatedProductsTemp.forEach(function (relProduct) {
    if (product._id.toString() !== relProduct._id.toString()) {
      similarProducts.push(relProduct);
    }
    // console.log(relProduct._id);
  });

  res.status(200).json({
    success: true,
    product,
    similarProducts,
  });
});

// Get auction Product Details
exports.getAuctionProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // finding the product category
  const productCategory = product.category;

  const relatedProductsTemp = await Product.find({
    category: productCategory,
    isAuction: "Yes",
  });

  var similarProducts = [];
  // console.log(productCategory);
  // console.log(product._id);
  relatedProductsTemp.forEach(function (relProduct) {
    if (product._id.toString() !== relProduct._id.toString()) {
      similarProducts.push(relProduct);
    }
    // console.log(relProduct._id);
  });

  res.status(200).json({
    success: true,
    product,
    similarProducts,
  });
});

// Update Product -- Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

//  update bid
exports.updateProductBid = catchAsyncErrors(async (req, res, next) => {
  const { productId, newBid, userId } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  if (newBid > 25000) {
    return next(
      new ErrorHander("New Bid Must be less than or equal to 25000", 404)
    );
  }
  if (newBid < product.startingBid) {
    return next(
      new ErrorHander(
        "New Bid Must be more than or equal to  starting bid",
        404
      )
    );
  }
  const diff = newBid - product.currentBid;
  if (diff < 200) {
    return next(new ErrorHander("New Bid must exceed current bid by 200", 404));
  }
  if (newBid > product.currentBid) {
    product.currentBid = newBid;
    product.winner = userId;
    product.price = newBid;

    await product.save();
    return res.status(200).json({
      success: true,
      product,
    });
  }

  res.status(400).json({
    success: false,
    message: "New bid must be higher than current bid.",
  });
});

// Get Product Details for all
exports.getProductDetailsForAll = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  // console.log("f\n");
  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});
