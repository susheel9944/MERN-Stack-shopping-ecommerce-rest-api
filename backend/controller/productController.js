import catchAsyncError from "../middleware/catchAsyncError.js";
import Product from "../model/products.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";

//Get all Product => /api/v1/products
export const getProducts = catchAsyncError(async (req, res) => {
  const resPerPage = 4;
  const apiFilters = new APIFilters(Product, req.query).search().filters();
  let products = await apiFilters.query;
  let filteredProductsCount = products.length;

  //Pagination
  apiFilters.pagination(resPerPage);
  products = await apiFilters.query.clone();
  res.status(200).json({
    resPerPage,
    filteredProductsCount,
    products,
  });
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

export const getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params?.id);

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

  await product.deleteOne();

  res.status(200).json({
    message: "Product is deleted",
  });
});
