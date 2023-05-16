const { mongoose, Schema } = require("mongoose");

const productsSchema = new Schema(
  {
    product_description: [
      {
        type: String,
        required: [true, "Product Description cannot be blank."],
      },
    ],
    product_images: [
      {
        type: String,
        default:
          "https://cdns.iconmonstr.com/wp-content/releases/preview/2019/240/iconmonstr-product-3.png",
      },
    ],
    price: {
      type: Number,
      required: [true, "Price of a product is compulsory"],
    },
    dealer: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productsSchema);
