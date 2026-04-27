import { useParams } from "react-router-dom";
import MetaData from "../layout/MetaData";
import "./invoice.css";
import { useOrderDetailsQuery } from "../../redux/orderApi";
import Loader from "../layout/Loader";
import { useEffect } from "react";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const Invoice = () => {
  const params = useParams();
  const { data, isLoading, error } = useOrderDetailsQuery(params?.id);

  const order = data?.order || {};
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalAmount,
    orderStatus,
    itemsPrice,
    taxAmount,
    shippingAmount,
  } = order;

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  }, [error]);

  const handleDownload = async () => {
    const input = document.getElementById("order_invoice");

    const canvas = await html2canvas(input, {
      scale: 2, // better quality
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice_${order?._id}.pdf`);
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={"Order Invoice"} />

      <div className="order-invoice my-5">
        {/* Download Button */}
        <div className="row d-flex justify-content-center mb-5">
          <button className="btn btn-success col-md-5" onClick={handleDownload}>
            <i className="fa fa-print"></i> Download Invoice
          </button>
        </div>

        {/* Invoice */}
        <div id="order_invoice" className="p-3 border border-secondary">
          <header className="clearfix">
            <div id="logo">
              <img src="/images/invoice-logo.png" alt="Company Logo" />
            </div>

            <h1>INVOICE # {order?._id}</h1>

            <div id="company" className="clearfix">
              <div>MShop</div>
              <div>
                455 Foggy Heights,
                <br />
                AZ 85004, US
              </div>
              <div>+91 9958183244</div>
              <div>
                <a href="mailto:info@shopit.com">info@shopit.com</a>
              </div>
            </div>

            {/* Customer Info */}
            <div id="project">
              <div>
                <span>Name</span> {user?.name}
              </div>
              <div>
                <span>Email</span> {user?.email}
              </div>
              <div>
                <span>Phone</span> {shippingInfo?.phoneNo}
              </div>
              <div>
                <span>Address</span>{" "}
                {shippingInfo
                  ? `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zipCode}, ${shippingInfo.country}`
                  : ""}
              </div>
              <div>
                <span>Date</span>{" "}
                {order?.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : ""}
              </div>
              <div>
                <span>Payment Status</span> {paymentInfo?.status}
              </div>
              <div>
                <span>Order Status</span> {orderStatus}
              </div>
            </div>
          </header>

          <main>
            <table className="mt-5">
              <thead>
                <tr>
                  <th className="service">ID</th>
                  <th className="desc">NAME</th>
                  <th>PRICE</th>
                  <th>QTY</th>
                  <th>TOTAL</th>
                </tr>
              </thead>

              <tbody>
                {orderItems?.map((item, index) => (
                  <tr key={item?.product || index}>
                    <td className="service">{item?.product}</td>
                    <td className="desc">{item?.name}</td>
                    <td className="unit">${item?.price}</td>
                    <td className="qty">{item?.quantity}</td>
                    <td className="total">${item?.price * item?.quantity}</td>
                  </tr>
                ))}

                {/* Subtotal */}
                <tr>
                  <td colSpan="4">
                    <b>SUBTOTAL</b>
                  </td>
                  <td className="total">${itemsPrice}</td>
                </tr>

                {/* Tax */}
                <tr>
                  <td colSpan="4">
                    <b>TAX</b>
                  </td>
                  <td className="total">${taxAmount}</td>
                </tr>

                {/* Shipping Price */}
                <tr>
                  <td colSpan="4">
                    <b>SHIPPING</b>
                  </td>
                  <td className="total">${shippingAmount}</td>
                </tr>

                {/* Grand Total */}
                <tr>
                  <td colSpan="4" className="grand total">
                    <b>GRAND TOTAL</b>
                  </td>
                  <td className="grand total">${totalAmount}</td>
                </tr>
              </tbody>
            </table>

            {/* Notice */}
            <div id="notices">
              <div>NOTICE:</div>
              <div className="notice">
                A finance charge of 1.5% will be made on unpaid balances after
                30 days.
              </div>
            </div>
          </main>

          <footer>
            Invoice was created on a computer and is valid without the
            signature.
          </footer>
        </div>
      </div>
    </>
  );
};

export default Invoice;
