import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import MetaData from "../layout/MetaData";
import {
  useDeleteProductReviewsMutation,
  useLazyGetProductReviewsQuery,
} from "../../redux/productAPi";
import Table from "react-bootstrap/Table";
import { toast } from "react-toastify";

const ProductReview = () => {
  const [productId, setProductId] = useState("");
  const [getProductReviews, { data, error, isLoading }] =
    useLazyGetProductReviewsQuery();
  const [
    deleteProductReviews,
    { error: deleteError, isLoading: isDeleteingLoading, isSuccess },
  ] = useDeleteProductReviewsMutation();
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }
    if (isSuccess) {
      toast.success("Review Deleted");
    }
  }, [error, deleteError, isSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    getProductReviews(productId);
  };

  const handleDeleteReview = (id) => {
    deleteProductReviews({ productId, id });
  };
  console.log("review data----", data);
  return (
    <>
      <AdminLayout>
        <MetaData title={"Product Review"} />
        <div className="row justify-content-center my-5">
          <div className="col-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="productId_field" className="form-label">
                  Enter Product ID
                </label>
                <input
                  type="text"
                  id="productId_field"
                  className="form-control"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
              </div>

              <button
                id="search_button"
                type="submit"
                className="btn btn-primary w-100 py-2"
              >
                SEARCH
              </button>
            </form>
          </div>
        </div>

        <h5 className="mt-3 text-center">
          Product name: <b></b>
        </h5>
        <div>
          {data?.reviews.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Review ID</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>User</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {data?.reviews?.length > 0}
              <tbody>
                {data?.reviews?.map((item) => (
                  <tr key={item?._id}>
                    <td>{item?._id}</td>
                    <td>{item?.rating}</td>
                    <td>{item?.comment}</td>
                    <td>{item?.user?.role}</td>
                    {console.log("checking update id", item._id)}
                    <td>
                      <button
                        className="btn btn-outline-danger ms-2"
                        onClick={() => handleDeleteReview(item?._id)}
                        disabled={isDeleteingLoading}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
                color: "red",
              }}
            >
              No Reviews
            </p>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default ProductReview;
