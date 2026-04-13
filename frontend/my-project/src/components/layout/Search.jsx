import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [keyword, setKeyWord] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword?.trim()) {
      navigate(`/?keyword=${keyword}&page=1`);
    } else {
      navigate("/");
    }
  };
  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className="input-group">
          <input
            type="text"
            id="search_field"
            aria-describedby="search_btn"
            className="form-control"
            placeholder="Enter Product Name ..."
            name="keyword"
            value={keyword}
            onChange={(e) => setKeyWord(e.target.value)}
          />
          <button id="search_btn" className="btn" type="submit">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Search;
