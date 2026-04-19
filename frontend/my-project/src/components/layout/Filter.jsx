import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPriceQueryParams } from "../../helpers/Helpers";
import { PRODUCT_CATEGORIES } from "../../constaints/constaints";
import { Rating } from "react-simple-star-rating";

const Filter = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ Get values from URL
  const selectedCategory = searchParams.get("category");
  const selectedRating = Number(searchParams.get("ratings")) || 0;

  const [min, setMin] = useState(searchParams.get("min") || "");
  const [max, setMax] = useState(searchParams.get("max") || "");

  // ✅ Price filter
  const handleButtonClick = (e) => {
    e.preventDefault();

    const newParams = new URLSearchParams(searchParams);

    getPriceQueryParams(newParams, "min", min);
    getPriceQueryParams(newParams, "max", max);

    newParams.set("page", 1);

    navigate(`/?${newParams.toString()}`);
  };

  // ✅ Category & Rating filter (single select)
  const handleClick = (e) => {
    const { name, value } = e.target;

    const newParams = new URLSearchParams(searchParams);

    newParams.set(name, value); // ✅ always set (single select)
    newParams.set("page", 1);

    navigate(`/?${newParams.toString()}`);
  };

  return (
    <div className="border p-3 filter">
      <h3>Filters</h3>
      <hr />

      {/* ✅ Price */}
      <h5 className="filter-heading mb-3">Price</h5>
      <form className="px-2" onSubmit={handleButtonClick}>
        <div className="row">
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Min ($)"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Max ($)"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary">
              GO
            </button>
          </div>
        </div>
      </form>

      <hr />

      {/* ✅ Category */}
      <h5 className="mb-3">Category</h5>
      {PRODUCT_CATEGORIES.map((category, index) => (
        <div className="form-check" key={category}>
          <input
            className="form-check-input"
            type="checkbox"
            name="category"
            id={`category-${index}`}
            value={category}
            checked={selectedCategory === category} // ✅ persist
            onChange={handleClick}
          />
          <label className="form-check-label" htmlFor={`category-${index}`}>
            {category}
          </label>
        </div>
      ))}

      <hr />

      {/* ✅ Ratings */}
      <h5 className="mb-3">Ratings</h5>

      {[5, 4, 3, 2, 1].map((rate) => (
        <div className="form-check" key={rate}>
          <input
            className="form-check-input"
            type="checkbox"
            name="ratings"
            id={`rating-${rate}`}
            value={rate}
            checked={selectedRating === rate}
            onChange={handleClick}
          />

          <label className="form-check-label" htmlFor={`rating-${rate}`}>
            <Rating
              initialValue={rate} // ⭐ correct
              size={20}
              fillColor="#ffb829"
              emptyColor="#e4e5e9"
              readOnly
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export default Filter;
