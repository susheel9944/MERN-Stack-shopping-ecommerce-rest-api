import React, { useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useDispatch } from "react-redux";
import AdminLayout from "../layout/AdminLayout";
import {
  useDeleteOrderMutation,
  useGetAdminOrdersQuery,
} from "../../redux/orderApi";

const ListOrder = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetAdminOrdersQuery();

  const [
    deleteOrder,
    { error: deleteError, isLoading: isDeleting, isSuccess },
  ] = useDeleteOrderMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }
    if (isSuccess) {
      toast.success("PRODUCT DELETED");
    }
  }, [error, deleteError, isSuccess]);

  const deleteOrderHandler = (id) => {
    deleteOrder(id);
  };

  if (isLoading) return <Loader />;
  console.log("List Order++++++++", data);
  return (
    <>
      <AdminLayout>
        <MetaData title={"Product List"} />
        <div>
          <h1 className="my-5">{data?.orders?.length} Orders</h1>
          <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>

                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.orders?.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.paymentInfo?.status?.toUpperCase()}</td>
                    <td>{item?.orderStatus}</td>
                    {console.log("checking update id", item._id)}
                    <td>
                      <Link
                        to={`/admin/orders/${item?._id}`}
                        className="btn btn-outline-primary"
                      >
                        <i className="fa fa-pencil"></i>
                      </Link>
                      <button
                        className="btn btn-outline-danger ms-2"
                        onClick={() => deleteOrderHandler(item?._id)}
                        disabled={isDeleting}
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

export default ListOrder;
