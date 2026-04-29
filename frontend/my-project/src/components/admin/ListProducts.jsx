import React, { useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useDispatch } from "react-redux";
import {
  useDeleteProductMutation,
  useGetAdminProductsQuery,
} from "../../redux/productAPi";
import AdminLayout from "../layout/AdminLayout";

const ListProduct = () => {
  const dispatch = useDispatch();
  //   const navigate = useNavigate();
  const { data, isLoading, error, isSuccess } = useGetAdminProductsQuery();
  const [
    deleteProduct,
    { isLoading: isDeleteLoading, error: deleteError, isSuccess: success },
  ] = useDeleteProductMutation();
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }
    if (success) {
      toast.success("PRODUCT DELETED");
    }
  }, [error, deleteError, success]);

  const handleDeleteProduct = (id) => {
    deleteProduct(id);
  };

  if (isLoading) return <Loader />;
  console.log("Order table data", data);
  return (
    <>
      <AdminLayout>
        <MetaData title={"Product List"} />
        <div>
          <h1 className="my-5">{data?.products?.length} Orders</h1>
          <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.products?.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.name.substring(0, 10)}...</td>
                    <td>{item?.stock}</td>
                    <td>{item?.price}</td>
                    {console.log("checking update id", item._id)}
                    <td>
                      <Link
                        to={`/admin/products/${item?._id}`}
                        className="btn btn-outline-primary"
                      >
                        <i className="fa fa-pencil"></i>
                      </Link>
                      <Link
                        to={`/admin/products/${item?._id}/upload-images`}
                        className="btn btn-outline-success ms-2"
                      >
                        <i className="fa fa-image"></i>
                      </Link>
                      <button
                        className="btn btn-outline-danger ms-2"
                        onClick={() => handleDeleteProduct(item?._id)}
                        disabled={isDeleteLoading}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default ListProduct;
