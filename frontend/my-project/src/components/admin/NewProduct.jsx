import { useNavigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { useEffect, useState } from "react";
import { PRODUCT_CATEGORIES } from "../../constaints/constaints";
import { useCreateProductMutation } from "../../redux/productAPi";
import { toast } from "react-toastify";
import MetaData from "../layout/MetaData";

const NewProduct = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    seller: "",
  });

  const [createProduct, { isLoading, error, isSuccess }] =
    useCreateProductMutation();
  const { name, description, price, category, stock, seller } = product;

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      toast.success("Product created");
      navigate("/admin/products");
    }
  }, [error, isSuccess]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    createProduct(product);
  };
  return (
    <>
      <AdminLayout>
        <MetaData title={"Create new Product"} />
        <div className="row wrapper">
          <div className="col-10 col-lg-10 mt-5 mt-lg-0">
            <form className="shadow rounded bg-body" onSubmit={submitHandler}>
              <h2 className="mb-4">New Product</h2>
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

export default NewProduct;
