import catchAsyncError from "../middleware/catchAsyncError.js";
import Order from "../model/order.js";
import ErrorHandler from "../utils/errorHandler.js";
import Product from "../model/products.js";

// Create new Order => /api/v1/orders/new
export const newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user: req.user._id,
  });

  res.status(200).json({
    order,
  });
});

//Get current user id => /api/v1/me/orders

export const myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    orders,
  });
});

// Get order details => /api/v1/orders/:id
export const getOrderDetails = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user");

  if (!order) {
    return next(new ErrorHandler("No Order found with this Id", 404));
  }
  res.status(200).json({
    order,
  });
});

//Get all orders - ADMIN => /api/v1/admin/orders
export const allOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  res.status(200).json({
    orders,
  });
});

//Update Order - ADMIN => /api/v1/admin/orders/:id

export const updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Order already delivered", 400));
  }

  // Reduce stock only when shipped
  if (req.body.status === "Shipped") {
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product.toString());

      if (!product) {
        return next(new ErrorHandler("No Product found with this ID", 404));
      }

      product.stock -= item.quantity;

      await product.save({ validateBeforeSave: false });
    }
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save();

  res.status(200).json({
    success: true,
  });
});

// Delete Orders => /api/v1/admin/orders/:id
export const deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this Id", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
  });
});

//Create/Update product review => /api/v1/reviews

export const createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req?.user?._id,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const isReviewed = product?.reviews.find(
    (item) => item.user.toString() === req?.user?._id.toString(),
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review?.user?.toString() === req?.user?._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReview = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    message: "Product review added",
  });
});

// Get product reviews => /api/v1/reviews
export const getProductReviews = catchAsyncError(async (req, res, next) => {
  console.log("review list check", res, req);
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Prodcut not found ", 404));
  }
  res.status(200).json({
    reviews: product.reviews,
  });
});

//Delete Review
export const deleteReview = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product?.reviews?.filter(
    (item) => item?._id.toString() !== req?.query?.id?.toString(),
  );

  const numOfReview = reviews?.length;

  // const ratings =
  //   numOfReview === 0
  //     ? 0
  //     : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
  //       numOfReview;

  const ratings =
    numOfReview === 0
      ? 0
      : reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReview;

  product = await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, numOfReview, ratings },
    { new: true },
  );

  res.status(200).json({
    success: true,
    product,
  });
});
