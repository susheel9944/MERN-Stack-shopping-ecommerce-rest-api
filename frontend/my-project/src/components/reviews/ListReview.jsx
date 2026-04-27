import React, { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";
const ListReview = ({ reviews, product }) => {
  const [rating, setRating] = useState(0);

  const handleRating = (rate) => {
    setRating(rate);
  };

  useEffect(() => {
    if (product?.ratings) {
      setRating(product.ratings);
    }
  }, [product]);

  return (
    <div className="reviews w-75">
      <h3>Other's Reviews:</h3>
      <hr />

      {reviews?.map((review) => (
        <div key={review?._id} className="review-card my-3">
          <div className="row">
            <div className="col-1">
              <img
                src={
                  review?.user?.avatar
                    ? review?.user?.avatar.url
                    : "/images/default_avatar.jpg"
                }
                alt="User Name"
                width="50"
                height="50"
                className="rounded-circle"
              />
            </div>
            <div className="col-11">
              <Rating onClick={handleRating} initialValue={rating} size={20} />

              {/* <div className="star-ratings">
                <i className="fa fa-star star-active"></i>
                <i className="fa fa-star star-active"></i>
                <i className="fa fa-star star-active"></i>
                <i className="fa fa-star star-active"></i>
                <i className="fa fa-star star-active"></i>
              </div> */}
              <p className="review_user">by {review?.user?.name}</p>
              <p className="review_comment">{review.comment}</p>
            </div>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default ListReview;
