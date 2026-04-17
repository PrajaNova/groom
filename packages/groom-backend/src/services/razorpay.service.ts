import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export const createRazorpayOrder = async (amount: number, receipt: string) => {
  const options = {
    amount: Math.round(amount * 100), // Razorpay expects amount in paise
    currency: "USD",
    receipt: receipt,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    throw error;
  }
};

export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string,
) => {
  const crypto = require("crypto");
  const hmac = crypto.createHmac(
    "sha256",
    process.env.RAZORPAY_KEY_SECRET || "",
  );
  hmac.update(orderId + "|" + paymentId);
  const generatedSignature = hmac.digest("hex");
  return generatedSignature === signature;
};
