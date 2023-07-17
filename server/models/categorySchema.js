const { mongoose, Schema } = require("mongoose");

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, "Category cannot be null"],
    unique: [true, "Category needs to be unique."],
  },
  description: {
    type: String,
    required: [true, "Category Description is mandatory"],
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Products",
      default: [],
    },
  ],
});

module.exports = mongoose.model("Categories", categorySchema);
