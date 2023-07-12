const { mongoose, Schema } = require("mongoose");

const productsSchema = new Schema(
  {
    product_name: {
      type: String,
      required: [true, "Product name cannot be blank"],
      unique: [true, "Product name should be unique"],
    },
    product_description: [
      {
        type: String,
        required: [true, "Product Description cannot be blank."],
      },
    ],
    product_images: [
      {
        name: {
          type: String,
          required: true,
        },
        image: {
          data: Buffer,
          contentType: String,
        },
      },
    ],
    price: {
      type: Number,
      required: [true, "Price of a product is compulsory"],
    },
    unit: {
      type: String,
      required: "true",
    },
    currency: {
      type: String,
      default: "INR",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
    },
    dealer: [{ type: Schema.Types.ObjectId, ref: "Users", required: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productsSchema);
