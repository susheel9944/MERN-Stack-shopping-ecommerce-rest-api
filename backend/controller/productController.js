import catchAsyncError from "../middleware/catchAsyncError.js";
import Product from "../model/products.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";
import Order from "../model/order.js";
import { delete_file, upload_file } from "../utils/cluodnairy.js";
//Get all Product => /api/v1/products
export const getProducts = catchAsyncError(async (req, res, next) => {
  console.log("REQ QUERY:", req.query);

  const resPerPage = 4;
  const apiFilters = new APIFilters(Product, req.query).search().filters();
  let products = await apiFilters.query;
  let filteredProductsCount = products.length;

  // return next(new ErrorHandler("products Error", 400));

  //Pagination
  apiFilters.pagination(resPerPage);
  products = await apiFilters.query.clone();
  res.status(200).json({
    resPerPage,
    filteredProductsCount,
    products,
  });
});

// export const uploadProductImages = catchAsyncError(async (req, res) => {
//   let product = await Product.findById(req?.params?.id);

//   if (!product) {
//     return next(new ErrorHandler("Product not found", 404));
//   }

//   const uploader = async (image) => upload_file(image, "shopit/product");

//   const urls = await Promise.all((req?.body?.images).map(uploader));
//   product?.images?.push(...urls);

//   await product?.save();

//   res.status(200).json({
//     product,
//   });
// });

export const uploadProductImages = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const uploader = async (image) => upload_file(image, "shopit/product");

  const urls = await Promise.all(req.body.images.map(uploader));

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $push: { images: { $each: urls } },
    },
    { new: true },
  );

  res.status(200).json({
    product: updatedProduct,
  });
});

//Delete product Images => /api/v1/admin/products/:id/delete_image
export const deleteProductImage = catchAsyncError(async (req, res, next) => {
  const { imgId } = req.body;

  if (!imgId) {
    return next(new ErrorHandler("Image public_id is required", 400));
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const isDeleted = await delete_file(imgId);

  if (isDeleted) {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          images: { public_id: imgId },
        },
      },
      { new: true },
    );

    return res.status(200).json({
      product: updatedProduct,
    });
  }
});

//Create New Product => /api/v1/admin/products
export const newProducts = catchAsyncError(async (req, res) => {
  req.body.user = req.user._id;
  console.log(req.body.user);
  const product = await Product.create(req.body);
  res.status(200).json({
    product,
  });
});

// Get products - ADMIN => /api/v1/admin/products
export const getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find({});

  res.status(200).json({
    products,
  });
});

export const getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params?.id).populate(
    "reviews.user",
  );

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    product,
  });
});

//Update product details => /api/v1/products/:id
export const updateProduct = catchAsyncError(async (req, res) => {
  let product = await Product.findById(req.params?.id);

  if (!product) {
    return res.status(404).json({
      error: "Product not found",
    });
  }

  product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
  });
  res.status(200).json({
    product,
  });
});

export const deleteProduct = catchAsyncError(async (req, res) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return res.status(404).json({
      error: "Product not found",
    });
  }
  // Deleting image associated with product
  for (let i = 0; i < product?.images?.length; i++) {
    await delete_file(product?.images[i].public_id);
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product is deleted",
  });
});

export const canUserReview = catchAsyncError(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
    "orderItems.product": req.query.productId,
  });

  if (orders.length === 0) {
    return res.status(200).json({ canReview: false });
  }
  res.status(200).json({
    canReview: true,
  });
});
