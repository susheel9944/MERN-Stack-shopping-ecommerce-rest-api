import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Rating } from "react-simple-star-rating";

const ProductItem = ({ product, columnSize }) => {
  const [rating, setRating] = useState(0);

  const handleRating = (rate) => {
    setRating(rate);
  };

  useEffect(() => {
    if (product?.ratings) {
      setRating(product.ratings);
    }
  }, [product]);

  console.log("susheel", product.numOfReview);
  return (
    <div className={`col-sm-12 col-md-6 col-lg-columnSize my-3`}>
      <div className="card p-3 rounded">
        <img
          className="card-img-top mx-auto"
          src={product.images[0]?.url}
          alt=""
        />
        <div className="card-body ps-3 d-flex justify-content-center flex-column">
          <h5 className="card-title">
            <Link to={`/product/${product?._id}`}>{product.name}</Link>
          </h5>
          <div className="ratings mt-auto d-flex">
            <Rating onClick={handleRating} initialValue={rating} size={20} />

            <span id="no_of_reviews" className="pt-2 ps-2">
              {product.numOfReview}
            </span>
          </div>
          <p className="card-text mt-2">${product.price}</p>
          <Link
            to={`/product/${product?._id}`}
            id="view_btn"
            className="btn btn-block"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
