import { useEffect, useState } from "react";
import { useGetProductDetailsQuery } from "../../redux/productAPi";
import { useParams } from "react-router-dom";
import Loader from "../layout/Loader";
import { Rating } from "react-simple-star-rating";
import { useDispatch, useSelector } from "react-redux";
import { setCartItem } from "../../redux/features/cartSlice";
import { toast } from "react-toastify";
import MetaData from "../layout/MetaData";
import NewReview from "../reviews/NewReview";
import ListReview from "../reviews/ListReview";
const ProductDetail = ({ reviews }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const { data, isError, error, isLoading } = useGetProductDetailsQuery(
    params.id,
  );
  const product = data?.product;
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [activeImg, setActiveImg] = useState("");
  const [img, setImg] = useState();

  useEffect(() => {
    setImg(img);
  }, [img]);

  useEffect(() => {
    setActiveImg(
      product?.images[0]
        ? product?.images[0]?.url
        : "/images/default_product.png",
    );
  }, [product]);
  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);

  useEffect(() => {
    if (product?.ratings) {
      setRating(product.ratings);
    }
  }, [product]);

  if (isLoading) {
    return <Loader />;
  }

  const handleRating = (rate) => {
    setRating(rate);
  };

  const increseQty = () => {
    const count = document.querySelector(".count");

    if (count.valueAsNumber >= product.stock) return;
    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };

  const decresQty = () => {
    const count = document.querySelector(".count");

    if (count.valueAsNumber <= 1) return;
    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };

  const setItemToCart = () => {
    const cartItem = {
      product: product?._id,
      name: product?.name,
      price: product?.price,
      image: product?.images[0]?.url,
      stock: product?.stock,
      quantity,
    };
    dispatch(setCartItem(cartItem));
    toast.success("Item added to cart");
  };
  console.log("preoduct detail0-----------", data);
  return (
    <>
      <MetaData title={"Product Details"} />
      <div className="row d-flex justify-content-around">
        <div className="col-12 col-lg-5 img-fluid" id="product_image">
          <div className="p-3">
            <img
              className="d-block w-100"
              src={activeImg}
              alt={product?.name}
              width="340"
              height="390"
            />
          </div>
          <div className="row justify-content-start mt-5">
            {product?.images.map((img) => (
              <div key={img?.public_id} className="col-2 ms-4 mt-2">
                <a role="button">
                  <img
                    className={`d-block border rounded p-3 cursor-pointer ${img.url === activeImg ? "border-warning" : ""}`}
                    height="100"
                    width="100"
                    src={img?.url}
                    alt={img?.url}
                    onClick={(e) => setActiveImg(img?.url)}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-5 mt-5">
          <h3>{product?.name}</h3>
          <p id="product_id">Product # {product?._id}</p>

          <hr />

          <div className="d-flex">
            <Rating onClick={handleRating} initialValue={rating} size={20} />

            <span id="no-of-reviews" className="pt-1 ps-2">
              {" "}
              ({product?.numOfReview} Reviews){" "}
            </span>
          </div>
          <hr />

          <p id="product_price">${product?.price}</p>
          <div className="stockCounter d-inline">
            <span className="btn btn-danger minus" onClick={decresQty}>
              -
            </span>
            <input
              type="number"
              className="form-control count d-inline"
              value={quantity}
              readOnly
            />
            <span className="btn btn-primary plus" onClick={increseQty}>
              +
            </span>
          </div>
          <button
            type="button"
            id="cart_btn"
            className="btn btn-primary d-inline ms-4"
            disabled={product?.stock <= 0}
            onClick={setItemToCart}
          >
            Add to Cart
          </button>

          <hr />

          <p>
            Status:
            <span
              id="stock_status"
              className={product?.stock > 0 ? "greenColor" : "redColor"}
            >
              {product?.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>

          <hr />

          <h4 className="mt-2">Description:</h4>
          <p>{product?.description}</p>
          <hr />
          <p id="product_seller mb-3">
            Sold by: <strong>{product?.seller}</strong>
          </p>
          {isAuthenticated ? (
            <NewReview productId={product?._id} />
          ) : (
            <div className="alert alert-danger my-5" type="alert">
              Login to post your review.
            </div>
          )}
        </div>
      </div>
      {product?.reviews?.length > 0 && (
        <ListReview reviews={product.reviews} product={product} />
      )}
    </>
  );
};

export default ProductDetail;
