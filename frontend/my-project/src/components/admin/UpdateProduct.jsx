import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { useEffect, useState } from "react";
import { PRODUCT_CATEGORIES } from "../../constaints/constaints";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from "../../redux/productAPi";
import { toast } from "react-toastify";
import MetaData from "../layout/MetaData";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  console.log("routing checkin000000--", window.location.pathname);

  console.log("update product params", params);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    seller: "",
  });

  const [updateProduct, { isLoading, error, isSuccess }] =
    useUpdateProductMutation();
  const { name, description, price, category, stock, seller } = product;
  const { data } = useGetProductDetailsQuery(params?.id);

  useEffect(() => {
    if (data?.product) {
      setProduct({
        name: data?.product?.name,
        description: data?.product?.description,
        price: data?.product?.price,
        category: data?.product?.category,
        stock: data?.product?.stock,
        seller: data?.product?.seller,
      });
    }

    if (error) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      toast.success("Product updated");
      navigate("/admin/products");
    }
  }, [error, isSuccess, data]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    updateProduct({ id: params?.id, body: product });
  };
  return (
    <>
      <AdminLayout>
        <MetaData title={"Create new Product"} />
        <div className="row wrapper">
          <div className="col-10 col-lg-10 mt-5 mt-lg-0">
            <form className="shadow rounded bg-body" onSubmit={submitHandler}>
              <h2 className="mb-4">Update Product</h2>
              <div className="mb-3">
                <label htmlFor="name_field" className="form-label">
                  {" "}
                  Name{" "}
                </label>
                <input
                  type="text"
                  id="name_field"
                  className="form-control"
                  name="name"
                  value={product.name}
                  onChange={handleOnChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description_field" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description_field"
                  rows="8"
                  name="description"
                  value={product.description}
                  onChange={handleOnChange}
                ></textarea>
              </div>

              <div className="row">
                <div className="mb-3 col">
                  <label htmlFor="price_field" className="form-label">
                    {" "}
                    Price{" "}
                  </label>
                  <input
                    type="text"
                    id="price_field"
                    className="form-control"
                    name="price"
                    value={product.price}
                    onChange={handleOnChange}
                  />
                </div>

                <div className="mb-3 col">
                  <label htmlFor="stock_field" className="form-label">
                    {" "}
                    Stock{" "}
                  </label>
                  <input
                    type="number"
                    id="stock_field"
                    className="form-control"
                    name="stock"
                    value={product.stock}
                    onChange={handleOnChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col">
                  <label htmlFor="category_field" className="form-label">
                    {" "}
                    Category{" "}
                  </label>
                  <select
                    className="form-select"
                    id="category_field"
                    name="category"
                    value={product.category}
                    onChange={handleOnChange}
                  >
                    <option value="">Select Category</option>
                    {PRODUCT_CATEGORIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3 col">
                  <label htmlFor="seller_field" className="form-label">
                    {" "}
                    Seller Name{" "}
                  </label>
                  <input
                    type="text"
                    id="seller_field"
                    className="form-control"
                    name="seller"
                    value={product.seller}
                    onChange={handleOnChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn w-100 py-2"
                disabled={isLoading}
              >
                {isLoading ? "Creating" : "CREATE"}
              </button>
            </form>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default UpdateProduct;
