// Create stripe checkout session => /api/v1/payment/checkout-session
import Stripe from "stripe";
import catchAsyncError from "../middleware/catchAsyncError.js";
import Order from "../model/order.js";

const Stripes = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeCheckoutSession = catchAsyncError(async (req, res, next) => {
  const body = req?.body;

  const line_items = body?.orderItems?.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          images: [item?.image],
          metadata: { productId: item?.product },
        },
        unit_amount: item?.price * 100,
      },
      tax_rates: ["txr_1TNxtiKXPBsKD8299n4bSUr8"],
      quantity: item?.quantity,
    };
  });

  const shippingInfo = body?.shippingInfo;

  const shipping_rate =
    body?.itemsPrice >= 200
      ? "shr_1TNxJZKXPBsKD829tn8d3CsR"
      : "shr_1TNxLGKXPBsKD8296BHmD6MY";

  const session = await Stripes.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${process.env.FRONTEND_URL}/me/orders?order_success=true`,
    cancel_url: `${process.env.FRONTEND_URL}`,
    customer_email: req?.user?.email,
    client_reference_id: req?.user?._id?.toString(),
    mode: "payment",
    metadata: { ...shippingInfo, itemsPrice: body?.itemsPrice },
    shipping_options: [
      {
        shipping_rate,
      },
    ],
    line_items,
  });
  console.log("session++++", session);
  res.status(200).json({
    url: session.url,
  });
});

const getOrderItems = async (line_items) => {
  return new Promise((resolve, reject) => {
    let cartItems = [];
    console.log("Before==========array==========", cartItems);
    line_items?.data?.forEach(async (item) => {
      const product = await Stripes.products.retrieve(item.price.product);
      const productId = product.metadata.productId;

      console.log("item++++++++++++", item);
      console.log("======product=========", product);

      cartItems.push({
        product: productId,
        name: product.name,
        price: item.price.unit_amount_decimal / 100,
        quantity: item.quantity,
        image: product.images[0],
      });

      if (cartItems.length === line_items?.data?.length) {
        resolve(cartItems);
      }
      console.log("==========array==========", cartItems);
    });
  });
};

export const stipeWebhook = async (req, res) => {
  try {
    const signature = req.headers["stripe-signature"];

    const event = Stripes.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const line_items = await Stripes.checkout.sessions.listLineItems(
        session.id,
      );

      const orderItems = await getOrderItems(line_items);
      const user = session.client_reference_id;

      const totalAmount = session.amount_total / 100;
      const taxAmount = session.total_details.amount_tax / 100;
      const shippingAmount = session.total_details.amount_shipping / 100;
      const itemsPrice = session.metadata.itemsPrice;

      const shippingInfo = {
        address: session.metadata.address,
        city: session.metadata.city,
        phoneNo: session.metadata.phoneNo,
        zipCode: session.metadata.zipCode,
        country: session.metadata.country,
      };

      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
      };

      const orderData = {
        shippingInfo,
        orderItems,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentInfo,
        paymentMethod: "card",
        user,
      };

      await Order.create(orderData);

      console.log("orderItems------------", orderItems);
      console.log("✅ PAYMENT SUCCESS");
      console.log("payment_status:", session.payment_status); // should be 'paid'

      // 👉 Save order to DB here
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
