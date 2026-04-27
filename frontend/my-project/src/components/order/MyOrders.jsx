import React, { useEffect } from "react";
import { useMyOrdersQuery } from "../../redux/orderApi";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import Table from "react-bootstrap/Table";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, isLoading, error, isSuccess } = useMyOrdersQuery();
  const [searchParams] = useSearchParams();
  const orderSuccess = searchParams.get("order_success");

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (orderSuccess === "true") {
      console.log("CLEARING CART NOW");

      dispatch(clearCart());

      // remove query param after clearing
      navigate("/me/orders");
    }
  }, [error, orderSuccess, dispatch, navigate]);

  const setOrders = () => {};

  if (isLoading) return <Loader />;
  console.log("Order table data", data);
  return (
    <>
      <MetaData title={"My Order"} />
      <div>
        <h1 className="my-5">{data?.orders?.length} Orders</h1>
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount Paid</th>
                <th>Status</th>
                <th>Order Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.orders?.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{`$${item?.totalAmount}`}</td>
                  <td>{item?.paymentInfo?.status?.toUpperCase()}</td>
                  <td>{item?.orderStatus}</td>
                  <td>
                    <Link
                      to={`/me/orders/${item?._id}`}
                      className="btn btn-primary"
                    >
                      <i className="fa fa-eye"></i>
                    </Link>
                    <Link
                      to={`/invoice/order/${item?._id}`}
                      className="btn btn-success ms-2"
                    >
                      <i className="fa fa-print"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default MyOrders;
