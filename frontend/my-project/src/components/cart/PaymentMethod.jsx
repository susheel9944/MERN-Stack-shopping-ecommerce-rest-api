import { useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import CheckOutStep from "./CheckOutStep";
import { useSelector } from "react-redux";
import { calculateOrderCost } from "../../helpers/Helpers";
import {
  useCreateNewOrderMutation,
  useStripeCheckoutSessionMutation,
} from "../../redux/orderApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PaymentMethod = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState("");

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
    calculateOrderCost(cartItems);

  const [createNewOrder, { isLoading, error, isSuccess }] =
    useCreateNewOrderMutation();

  const [stripeCheckoutSession, { data: checkoutData, error: checkoutError }] =
    useStripeCheckoutSessionMutation();
  useEffect(() => {
    if (checkoutData) {
      window.location.href = checkoutData?.url;
    }
    if (checkoutError) {
      toast.error(checkoutError?.data?.message);
    }
  }, [checkoutData, checkoutError]);
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      console.log("Order created successfully");

      navigate("/me/orders?order_success=true");
    }
  }, [error, isSuccess, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (method === "COD") {
      const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice,
        shippingAmount: shippingPrice,
        taxAmount: taxPrice,
        totalAmount: totalPrice,
        paymentInfo: {
          status: "Not Paid",
        },
        paymentMethod: "COD",
      };
      createNewOrder(orderData);
    }
    if (method === "card") {
      const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice,
        shippingAmount: shippingPrice,
        taxAmount: taxPrice,
        totalAmount: totalPrice,
      };
      stripeCheckoutSession(orderData);
    }
  };
  return (
    <>
      <MetaData title={"Payment Method"} />
      <CheckOutStep shipping confirmOrder payment />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">Select Payment Method</h2>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="codradio"
                value="COD"
                onChange={(e) => setMethod("COD")}
              />
              <label className="form-check-label" htmlFor="codradio">
                Cash on Delivery
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="cardradio"
                value="card"
                onChange={(e) => setMethod("card")}
              />
              <label className="form-check-label" htmlFor="cardradio">
                Card - VISA, MasterCard
              </label>
            </div>

            <button
              id="shipping_btn"
              type="submit"
              className="btn py-2 w-100"
              disabled={isLoading}
            >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
