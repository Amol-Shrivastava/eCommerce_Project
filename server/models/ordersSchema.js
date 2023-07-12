const { mongoose, Schema } = require("mongoose");

const ordersSchema = new Schema(
  {
    productId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: [true, "Orders needs to have some products to execute."],
      },
    ],
    order_status: {
      type: String,
      enum: ["NOT_PLACED", "ORDER_PLACED", "CANCELLED", "DELIVERED"],
      default: "NOT_PLACED",
    },
    amount: {
      type: Number,
      required: [true, "Total order value cannot be blank"],
    },
    paymentMode: {
      type: String,
      enum: ["COD", "UPI", "Debit/Credit Card"],
      default: "UPI",
    },
    payment_status: {
      type: String,
      enum: ["NOT_DONE", "SUCCESSFUL", "ERROR"],
      default: "NOT_DONE",
    },
    orderBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    orderTo: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", ordersSchema);
